<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Bật báo lỗi để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'data.php';

// Hàm trả về JSON response
function sendResponse($status, $message, $data = null) {
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

if ($conn->connect_error) {
    sendResponse('error', 'Kết nối cơ sở dữ liệu thất bại: ' . $conn->connect_error);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $conn->prepare("SELECT * FROM courses");
        $stmt->execute();
        $result = $stmt->get_result();
        $courses = [];
        while ($row = $result->fetch_assoc()) {
            $courses[] = $row;
        }
        sendResponse('success', 'Lấy danh sách khóa học thành công', $courses);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['code']) || empty($data['title']) || empty($data['description']) || empty($data['instructor'])) {
            sendResponse('error', 'Vui lòng điền đầy đủ thông tin');
        }
        
        $stmt = $conn->prepare("INSERT INTO courses (code, title, description, instructor, image) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $data['code'], $data['title'], $data['description'], $data['instructor'], $data['image'] ?? '');
        
        if ($stmt->execute()) {
            $newId = $conn->insert_id;
            sendResponse('success', 'Thêm khóa học thành công', ['id' => $newId]);
        } else {
            sendResponse('error', 'Lỗi khi thêm khóa học: ' . $conn->error);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id']) || empty($data['code']) || empty($data['title']) || empty($data['description']) || empty($data['instructor'])) {
            sendResponse('error', 'Vui lòng điền đầy đủ thông tin');
        }
        
        $stmt = $conn->prepare("UPDATE courses SET code = ?, title = ?, description = ?, instructor = ?, image = ? WHERE id = ?");
        $stmt->bind_param("sssssi", $data['code'], $data['title'], $data['description'], $data['instructor'], $data['image'] ?? '', $data['id']);
        
        if ($stmt->execute()) {
            sendResponse('success', 'Cập nhật khóa học thành công');
        } else {
            sendResponse('error', 'Lỗi khi cập nhật khóa học: ' . $conn->error);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id'])) {
            sendResponse('error', 'ID khóa học không hợp lệ');
        }
        
        $stmt = $conn->prepare("DELETE FROM courses WHERE id = ?");
        $stmt->bind_param("i", $data['id']);
        
        if ($stmt->execute()) {
            sendResponse('success', 'Xóa khóa học thành công');
        } else {
            sendResponse('error', 'Lỗi khi xóa khóa học: ' . $conn->error);
        }
        break;

    default:
        sendResponse('error', 'Phương thức không được hỗ trợ');
}
?>