const db = require("../config/db");

/**
 * Determine water status based on turbidity value (NTU)
 * < 30  → Jernih
 * < 70  → Keruh
 * >= 70 → Sangat Keruh
 */
const getWaterStatus = (turbidity) => {
  if (turbidity < 30) return "Jernih";
  if (turbidity < 70) return "Keruh";
  return "Sangat Keruh";
};

/**
 * POST /api/water/add
 * Receive turbidity data from ESP32 and save to database
 */
const addWaterData = async (req, res) => {
  try {
    const { turbidity } = req.body;

    // Validate input
    if (turbidity === undefined || turbidity === null) {
      return res.status(400).json({
        success: false,
        message: "Turbidity value is required.",
      });
    }

    const turbidityValue = parseFloat(turbidity);

    if (isNaN(turbidityValue) || turbidityValue < 0) {
      return res.status(400).json({
        success: false,
        message: "Turbidity must be a valid non-negative number.",
      });
    }

    const status = getWaterStatus(turbidityValue);

    // Insert into database
    const [result] = await db.execute(
      "INSERT INTO water_quality (turbidity, status) VALUES (?, ?)",
      [turbidityValue, status]
    );

    // Fetch the newly created record
    const [rows] = await db.execute(
      "SELECT * FROM water_quality WHERE id = ?",
      [result.insertId]
    );

    const newData = rows[0];

    // Emit realtime event via Socket.IO (attached to req.app)
    const io = req.app.get("io");
    if (io) {
      io.emit("water_data", newData);
    }

    return res.status(201).json({
      success: true,
      message: "Data saved successfully.",
      data: newData,
    });
  } catch (error) {
    console.error("addWaterData error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

/**
 * GET /api/water
 * Retrieve all water quality records (latest first)
 * Supports ?limit=N and ?page=N for pagination
 */
const getWaterData = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    // Get total count
    const [[{ total }]] = await db.execute(
      "SELECT COUNT(*) AS total FROM water_quality"
    );

    // Get paginated records
    const [rows] = await db.execute(
      "SELECT * FROM water_quality ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("getWaterData error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

/**
 * GET /api/water/latest
 * Get the most recent sensor reading
 */
const getLatestData = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM water_quality ORDER BY created_at DESC LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("getLatestData error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

/**
 * GET /api/water/stats
 * Get summary statistics
 */
const getStats = async (req, res) => {
  try {
    const [[stats]] = await db.execute(`
      SELECT
        COUNT(*)                          AS total_readings,
        ROUND(AVG(turbidity), 2)          AS avg_turbidity,
        ROUND(MIN(turbidity), 2)          AS min_turbidity,
        ROUND(MAX(turbidity), 2)          AS max_turbidity,
        SUM(status = 'Jernih')            AS jernih_count,
        SUM(status = 'Keruh')             AS keruh_count,
        SUM(status = 'Sangat Keruh')      AS sangat_keruh_count
      FROM water_quality
    `);

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("getStats error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

/**
 * DELETE /api/water/:id
 * Delete a specific record (protected)
 */
const deleteWaterData = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM water_quality WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Record deleted successfully.",
    });
  } catch (error) {
    console.error("deleteWaterData error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  addWaterData,
  getWaterData,
  getLatestData,
  getStats,
  deleteWaterData,
};
