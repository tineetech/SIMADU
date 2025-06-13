-- create_laporan_table.sql

DROP TABLE IF EXISTS laporan;

CREATE TABLE laporan (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    image TEXT NOT NULL,
    location_latitude TEXT NOT NULL,
    location_longitude TEXT NOT NULL,
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    category ENUM('jalan_rusak', 'sampah_menumpuk', 'pju_mati', 'banjir', 'lainnya') NOT NULL DEFAULT 'lainnya',
    type_verification ENUM('ai', 'automatic', 'manual') NOT NULL DEFAULT 'ai',
    status ENUM('pending', 'proses', 'failed', 'success') NOT NULL DEFAULT 'pending',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);