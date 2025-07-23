document.addEventListener('DOMContentLoaded', function() {
    let scheduleData = {
        timeSlots: [],
        days: [],
        schedule: []
    };

    // Tải và hiển thị lịch học và danh sách yêu cầu
    fetchSchedule();
    fetchRequests();
    setupEventListeners();

    // ====== YÊU CẦU THAY ĐỔI LỊCH HỌC ======
    function openRequestModal() {
        document.getElementById('requestForm').reset();
        document.getElementById('requestModal').style.display = 'flex';
    }

    function closeRequestModal() {
        document.getElementById('requestModal').style.display = 'none';
    }

    function submitRequest(event) {
        event.preventDefault();
        const type = document.getElementById('requestType').value;
        const timeSlot = document.getElementById('requestTimeSlot').value;
        const day = document.getElementById('requestDay').value;
        const course = document.getElementById('requestCourse').value;
        const title = document.getElementById('requestTitle').value;
        const room = document.getElementById('requestRoom').value;
        const instructor = document.getElementById('requestInstructor').value;
        const reason = document.getElementById('requestReason').value;

        // Gửi yêu cầu tới backend
        fetch('/api/submit-request.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type,
                timeSlot,
                day,
                course,
                title,
                room,
                instructor,
                reason
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchSchedule(); // Làm mới lịch học
                fetchRequests(); // Làm mới danh sách yêu cầu
                closeRequestModal();
                showNotification(data.message, 'success');
            } else {
                showNotification(data.message, 'error');
            }
        })
        .catch(error => {
            showNotification('Đã có lỗi xảy ra: ' + error.message, 'error');
        });
    }

    function fetchSchedule() {
        fetch('/api/get-schedule.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    scheduleData = {
                        timeSlots: data.timeSlots,
                        days: data.days,
                        schedule: data.schedule
                    };
                    renderSchedule();
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(error => {
                showNotification('Đã có lỗi khi tải lịch học: ' + error.message, 'error');
            });
    }

    function fetchRequests() {
        fetch('/api/get-requests.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    renderRequestList(data.requests);
                } else {
                    showNotification(data.message, 'error');
                }
            })
            .catch(error => {
                showNotification('Đã có lỗi khi tải danh sách yêu cầu: ' + error.message, 'error');
            });
    }

    function renderRequestList(requests) {
        const requestList = document.getElementById('requestList');
        if (!requests.length) {
            requestList.innerHTML = '<div class="empty-request">Chưa có yêu cầu nào.</div>';
            return;
        }
        requestList.innerHTML = requests.map(req => `
            <div class="request-item">
                <div class="request-info">
                    <b>${getRequestTypeText(req.type)}</b> | <span>${scheduleData.timeSlots[req.timeSlot] || ''} - ${scheduleData.days[req.day] || ''}</span><br>
                    <span>${req.course} - ${req.title} | Phòng: ${req.room} | GV: ${req.instructor}</span>
                </div>
                <div class="request-reason">
                    <b>Lý do:</b> ${req.reason}
                </div>
                <div class="request-meta">
                    <span class="request-time">${req.createdAt}</span>
                </div>
            </div>
        `).join('');
    }

    function getRequestTypeText(type) {
        if (type === 'add') return 'Yêu cầu thêm lịch học';
        if (type === 'edit') return 'Yêu cầu sửa lịch học';
        if (type === 'delete') return 'Yêu cầu xóa lịch học';
        return '';
    }

    // ===== HIỂN THỊ LỊCH HỌC =====
    function renderSchedule() {
        const scheduleBody = document.querySelector('.schedule-body');
        scheduleBody.innerHTML = scheduleData.schedule.map((row, rowIndex) => `
            <div class="schedule-row">
                <div class="time-slot">${scheduleData.timeSlots[rowIndex]}</div>
                ${row.map((cell, colIndex) => {
                    if (cell === null) {
                        return '<div class="class-slot empty"></div>';
                    } else {
                        return `
                            <div class="class-slot" data-course="${cell.course}" data-id="${cell.id}">
                                <div class="schedule-content">
                                    ${cell.course} - ${cell.title}<br>
                                    <small>Phòng ${cell.room} | GV: ${cell.instructor}</small>
                                </div>
                            </div>
                        `;
                    }
                }).join('')}
            </div>
        `).join('');
    }

    function setupEventListeners() {
        // Đóng modal khi click bên ngoài
        document.getElementById('requestModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeRequestModal();
            }
        });
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

    // Gán global cho HTML
    window.openRequestModal = openRequestModal;
    window.closeRequestModal = closeRequestModal;
    window.submitRequest = submitRequest;
});