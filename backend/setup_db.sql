CREATE DATABASE IF NOT EXISTS iot_water CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE iot_water;

CREATE TABLE IF NOT EXISTS water_quality (
  id INT NOT NULL AUTO_INCREMENT,
  turbidity FLOAT NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_created_at (created_at),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admins (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO admins (username, password)
VALUES ('admin', '$2a$10$ZyuuD472Y1jjn61uqTk8Sutf2tp93QRNFsJBWIv4ZlnQJVFlink8W');

INSERT IGNORE INTO water_quality (turbidity, status) VALUES
  (12.5, 'Jernih'),
  (25.0, 'Jernih'),
  (45.3, 'Keruh'),
  (62.1, 'Keruh'),
  (85.7, 'Sangat Keruh'),
  (18.2, 'Jernih'),
  (55.0, 'Keruh'),
  (92.4, 'Sangat Keruh'),
  (8.9,  'Jernih'),
  (71.3, 'Sangat Keruh');

SHOW TABLES;
SELECT id, username FROM admins;
