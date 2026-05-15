/**
 * Socket.IO event handler
 * Manages realtime connections between server and clients
 */
const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Send welcome message to newly connected client
    socket.emit("connected", {
      message: "Connected to IoT Water Monitoring server",
      timestamp: new Date().toISOString(),
    });

    // Handle client requesting latest data on connect
    socket.on("request_latest", () => {
      console.log(`📡 Client ${socket.id} requested latest data`);
      // The client will receive data via the 'water_data' event
      // when ESP32 sends new readings
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id} — Reason: ${reason}`);
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error(`Socket error from ${socket.id}:`, error);
    });
  });
};

module.exports = socketHandler;
