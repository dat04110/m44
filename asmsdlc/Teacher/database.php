<?php
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'lms_uni';

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Kết nối cơ sở dữ liệu thất bại: ' . $conn->connect_error]));
}

// Tạo bảng courses nếu chưa tồn tại
$sql = "CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    instructor VARCHAR(100) NOT NULL,
    image VARCHAR(255)
)";
$conn->query($sql);
foreach ($sampleData as $data) {
    $stmt = $conn->prepare("INSERT IGNORE INTO courses (code, title, description, instructor, image) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $data[0], $data[1], $data[2], $data[3], $data[4]);
    $stmt->execute();
}
?>