-- Allow root remote access so backend can monitor and we can configure replication
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'password123';
FLUSH PRIVILEGES;
