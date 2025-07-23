<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Khóa học của tôi - Học sinh</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="my-courses.css">
</head>
<body>
    <header class="header">
        <div class="logo">
            <i class="fas fa-graduation-cap"></i>
            <h1>LMS Uni</h1>
        </div>
        <div class="search-bar">
            <input type="text" placeholder="Tìm kiếm khóa học, tài liệu...">
            <button><i class="fas fa-search"></i></button>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
            <div class="user-profile user-menu-container">
                <i class="fas fa-user"></i>
                <div class="user-dropdown-menu">
                    <a href="../Login/Login.php">Đăng nhập</a>
                    <a href="#">Đăng ký</a>
                </div>
            </div>
            <button class="settings-btn settings-menu-container">
                <i class="fas fa-cog"></i>
                <div class="settings-dropdown-menu">
                    <a href="#">Thông tin</a>
                    <a href="#">Liên hệ</a>
                </div>
            </button>
        </div>
    </header>

    <nav class="horizontal-nav">
        <div class="nav-container">
            <ul class="nav-menu">
                <li><a href="schedule.php" class="nav-link"><i class="fas fa-book"></i> Trang Chủ </a></li>
                <li><a href="student-courses.php" class="nav-link active"><i class="fas fa-calendar-alt"></i> Khóa học của tôi</a></li>
                <li><a href="assignment.php" class="nav-link"><i class="fas fa-tasks"></i> Bài tập</a></li>
                <li><a href="discussion.php" class="nav-link"><i class="fas fa-comments"></i> Thảo luận</a></li>
            </ul>
        </div>
    </nav>

    <section class="courses-section">
        <div class="courses-header">
            <h2 class="courses-title">Khóa học của tôi</h2>
        </div>
        <div class="courses-grid">
            <!-- Các card sẽ được render bằng JS -->
        </div>
    </section>

    <footer class="footer">
        <div class="footer-content">
            <p>&copy; 2025 Hệ thống Quản lý Học tập - Đại học Công nghệ</p>
            <div class="footer-links">
                <a href="#">Về chúng tôi</a>
                <a href="#">Hỗ trợ</a>
                <a href="#">Chính sách bảo mật</a>
            </div>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Lấy danh sách khóa học từ API
            fetch('api.php')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        const coursesGrid = document.querySelector('.courses-grid');
                        coursesGrid.innerHTML = data.data.map(course => `
                            <div class="course-card" data-id="${course.id}">
                                <img class="course-img" src="${course.image}" alt="${course.title}" onerror="this.src='images/default.jpg'">
                                <div class="course-title"><span class="course-code">${course.code}</span> - ${course.title}</div>
                                <div class="course-desc">${course.description}</div>
                                <div class="course-meta">Giảng viên: ${course.instructor}</div>
                                <button class="course-view-btn">Xem</button>
                            </div>
                        `).join('');
                    } else {
                        alert('Lỗi khi tải danh sách khóa học!');
                    }
                })
                .catch(error => {
                    alert('Lỗi kết nối server!');
                    console.error('Error:', error);
                });
        });
    </script>
</body>
</html>