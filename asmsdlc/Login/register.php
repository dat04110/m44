<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng ký - Hệ thống Quản lý Học tập</title>
    <link rel="stylesheet" href="csslogin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="login-container">
        <div class="login-card">
            <!-- Left Side - Welcome Section -->
            <div class="login-left">
                <div class="login-left-content">
                    <div class="login-logo">
                        <a class="login-logo" href="HTML.HTML">
                            <span class="logo-icon"><i class="fas fa-graduation-cap"></i></span>
                            <h1>LMS Uni</h1>
                        </a>
                    </div>
                    <div class="login-welcome">
                        <h2>Chào mừng bạn!</h2>
                        <p>Đăng ký tài khoản để bắt đầu hành trình học tập cùng chúng tôi.</p>
                    </div>
                    <ul class="login-features">
                        <li>
                            <i class="fas fa-book-open"></i>
                            <span>Truy cập khóa học và tài liệu</span>
                        </li>
                        <li>
                            <i class="fas fa-chart-line"></i>
                            <span>Theo dõi tiến độ học tập</span>
                        </li>
                        <li>
                            <i class="fas fa-users"></i>
                            <span>Tương tác với giảng viên</span>
                        </li>
                        <li>
                            <i class="fas fa-calendar-check"></i>
                            <span>Quản lý lịch học và bài tập</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- Right Side - Register Form -->
            <div class="login-right">
                <div class="login-form-header">
                    <h2>Đăng ký</h2>
                    <p>Nhập thông tin để tạo tài khoản mới</p>
                </div>
                <form class="login-form" id="registerForm">
                    <div class="form-group">
                        <label for="fullname">Họ tên</label>
                        <input type="text" id="fullname" name="fullname" placeholder="Nhập họ tên" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Nhập email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Mật khẩu</label>
                        <div class="password-field">
                            <input type="password" id="password" name="password" placeholder="Nhập mật khẩu" required>
                            <button type="button" class="password-toggle" onclick="togglePassword()">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Xác nhận mật khẩu</label>
                        <div class="password-field">
                            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Nhập lại mật khẩu" required>
                            <button type="button" class="password-toggle" onclick="toggleConfirmPassword()">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    <button type="submit" class="login-btn">
                        <i class="fas fa-user-plus"></i>
                        Đăng ký
                    </button>
                    <div class="register-link" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                        <span>Đã có tài khoản?</span>
                        <a href="Login.php" class="register-now-link">Đăng nhập ngay</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="jsregister.js"></script>
</body>
</html> 