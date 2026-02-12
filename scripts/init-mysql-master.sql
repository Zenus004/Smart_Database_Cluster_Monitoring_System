-- Create replicator
CREATE USER IF NOT EXISTS 'replicator'@'%' IDENTIFIED WITH mysql_native_password BY 'password123';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';

-- Update root to allow remote access
-- Note: 'root'@'localhost' is created by default by the image.
-- We create 'root'@'%'
CREATE USER 'root'@'%' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;
