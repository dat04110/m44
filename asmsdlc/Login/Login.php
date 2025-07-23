<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng nhập - Hệ thống Quản lý Học tập</title>
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
                        <h2>Chào mừng trở lại!</h2>
                        <p>Đăng nhập vào hệ thống quản lý học tập để tiếp tục hành trình học tập của bạn.</p>
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

            <!-- Right Side - Login Form -->
            <div class="login-right">
                <div class="login-form-header">
                    <h2>Đăng nhập</h2>
                    <p>Nhập thông tin đăng nhập của bạn</p>
                </div>

                <form class="login-form" id="loginForm">
                    <div class="form-group">
                        <label for="email">Email sinh viên</label>
                        <input type="text" id="email" name="email" placeholder="Nhập email sinh viên" required>
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

                    <div class="form-options">
                        <div class="remember-me">
                            <input type="checkbox" id="remember" name="remember">
                            <label for="remember">Ghi nhớ đăng nhập</label>
                        </div>
                        <a href="#" class="forgot-password">Quên mật khẩu?</a>
                    </div>

                    <button type="submit" class="login-btn">
                        <i class="fas fa-sign-in-alt"></i>
                        Đăng nhập
                    </button>

                    <div class="register-link" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                        <span>Bạn chưa có tài khoản?</span>
                        <a href="register.php" class="register-now-link">Đăng ký ngay</a>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- XÓA modal yêu cầu cấp quyền email và script liên quan -->
    <script src="jslogin.js"></script>
</body>
</html>