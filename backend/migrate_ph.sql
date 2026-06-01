USE iot_water;

-- Tambah kolom ph (skip jika sudah ada)
SET @dbname = 'iot_water';
SET @tablename = 'water_quality';

SET @col_ph = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'ph'
);

SET @col_ph_status = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'ph_status'
);

SET @sql_ph = IF(@col_ph = 0,
  'ALTER TABLE water_quality ADD COLUMN ph FLOAT NULL COMMENT "pH value 0-14" AFTER turbidity',
  'SELECT "Column ph already exists" AS info'
);

SET @sql_ph_status = IF(@col_ph_status = 0,
  'ALTER TABLE water_quality ADD COLUMN ph_status VARCHAR(20) NULL COMMENT "Asam / Normal / Basa" AFTER ph',
  'SELECT "Column ph_status already exists" AS info'
);

PREPARE stmt1 FROM @sql_ph;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

PREPARE stmt2 FROM @sql_ph_status;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- Update data lama dengan pH default 7.0 (Normal)
UPDATE water_quality SET ph = 7.0, ph_status = 'Normal' WHERE ph IS NULL;

-- Verifikasi struktur tabel
DESCRIBE water_quality;
