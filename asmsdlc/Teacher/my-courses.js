document.addEventListener('DOMContentLoaded', function() {
    let courses = [];

    // Lấy danh sách khóa học từ API
    function fetchCourses() {
        fetch('api.php')
            .then(response => {
                if (!response.ok) throw new Error('Lỗi kết nối server');
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    courses = data.data;
                    renderCourses(courses);
                } else {
                    showNotification(data.message || 'Lỗi khi tải danh sách khóa học!', 'error');
                }
            })
            .catch(error => {
                showNotification('Lỗi kết nối server: ' + error.message, 'error');
                console.error('Error:', error);
            });
    }

    // Render khóa học
    function renderCourses(courses) {
        const coursesGrid = document.querySelector('.courses-grid');
        coursesGrid.innerHTML = courses.map(course => `
            <div class="course-card" data-id="${course.id}">
                <div class="course-actions">
                    <button class="edit-course-btn" onclick="editCourse(${course.id})" title="Sửa khóa học">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-course-btn" onclick="deleteCourse(${course.id})" title="Xóa khóa học">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <img class="course-img" src="${course.image || 'images/default.jpg'}" alt="${course.title}" onerror="this.src='images/default.jpg'">
                <div class="course-title"><span class="course-code">${course.code}</span> - ${course.title}</div>
                <div class="course-desc">${course.description}</div>
                <div class="course-meta">Giảng viên: ${course.instructor}</div>
                <button class="course-view-btn">Xem</button>
            </div>
        `).join('');
    }

    function openCourseModal() {
        document.getElementById('courseModalTitle').textContent = 'Thêm khóa học mới';
        document.getElementById('courseId').value = '';
        document.getElementById('courseForm').reset();
        document.getElementById('courseModal').style.display = 'flex';
    }

    function editCourse(id) {
        const course = courses.find(c => c.id === id);
        if (course) {
            document.getElementById('courseModalTitle').textContent = 'Sửa khóa học';
            document.getElementById('courseId').value = course.id;
            document.getElementById('courseCode').value = course.code;
            document.getElementById('courseTitle').value = course.title;
            document.getElementById('courseDesc').value = course.description;
            document.getElementById('courseInstructor').value = course.instructor;
            document.getElementById('courseImage').value = course.image || '';
            document.getElementById('courseModal').style.display = 'flex';
        } else {
            showNotification('Không tìm thấy khóa học!', 'error');
        }
    }

    function deleteCourse(id) {
        showCustomConfirm(
            `Bạn có chắc chắn muốn xóa khóa học "${courses.find(c => c.id === id)?.title || ''}"?`,
            () => {
                fetch('api.php', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                })
                .then(response => {
                    if (!response.ok) throw new Error('Lỗi xóa');
                    return response.json();
                })
                .then(data => {
                    if (data.status === 'success') {
                        fetchCourses();
                        showNotification('Đã xóa khóa học thành công!', 'success');
                    } else {
                        showNotification(data.message || 'Lỗi khi xóa khóa học!', 'error');
                    }
                })
                .catch(error => {
                    showNotification('Lỗi kết nối server: ' + error.message, 'error');
                });
            }
        );
    }

    function saveCourse(event) {
        event.preventDefault();
        
        const id = document.getElementById('courseId').value;
        const courseData = {
            code: document.getElementById('courseCode').value,
            title: document.getElementById('courseTitle').value,
            description: document.getElementById('courseDesc').value,
            instructor: document.getElementById('courseInstructor').value,
            image: document.getElementById('courseImage').value
        };

        const method = id ? 'PUT' : 'POST';
        const body = id ? { ...courseData, id: parseInt(id) } : courseData;

        fetch('api.php', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        .then(response => {
            if (!response.ok) throw new Error('Lỗi lưu');
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                fetchCourses();
                showNotification(id ? 'Đã cập nhật khóa học thành công!' : 'Đã thêm khóa học mới thành công!', 'success');
                closeCourseModal();
            } else {
                showNotification(data.message || 'Lỗi khi lưu khóa học!', 'error');
            }
        })
        .catch(error => {
            showNotification('Lỗi kết nối server: ' + error.message, 'error');
        });
    }

    function closeCourseModal() {
        document.getElementById('courseModal').style.display = 'none';
    }

    function showCustomConfirm(message, onConfirm) {
        const confirmDialog = document.createElement('div');
        confirmDialog.className = 'custom-confirm-overlay';
        confirmDialog.innerHTML = `
            <div class="custom-confirm-dialog">
                <div class="confirm-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Xác nhận xóa</h3>
                </div>
                <div class="confirm-content">
                    <p>${message}</p>
                </div>
                <div class="confirm-actions">
                    <button class="btn-cancel-confirm" onclick="this.closest('.custom-confirm-overlay').remove()">
                        <i class="fas fa-times"></i> Hủy
                    </button>
                    <button class="btn-confirm-delete" onclick="this.closest('.custom-confirm-overlay').remove(); window.executeConfirmCallback();">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(confirmDialog);
        window.executeConfirmCallback = onConfirm;
        
        setTimeout(() => {
            confirmDialog.style.opacity = '1';
            confirmDialog.querySelector('.custom-confirm-dialog').style.transform = 'scale(1)';
        }, 10);
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function setupEventListeners() {
        document.getElementById('courseModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeCourseModal();
            }
        });
    }

    // Gọi hàm khởi tạo
    fetchCourses();
    setupEventListeners();

    // Global functions
    window.openCourseModal = openCourseModal;
    window.editCourse = editCourse;
    window.deleteCourse = deleteCourse;
    window.closeCourseModal = closeCourseModal;
    window.saveCourse = saveCourse;
function fetchCourses() {
    fetch('api.php?t=' + new Date().getTime())
        .then(response => {
            if (!response.ok) throw new Error('Lỗi kết nối server');
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                courses = data.data;
                renderCourses(courses);
            } else {
                showNotification(data.message || 'Lỗi khi tải danh sách khóa học!', 'error');
            }
        })
        .catch(error => {
            showNotification('Lỗi kết nối server: ' + error.message, 'error');
            console.error('Error:', error);
        });
}
});