document.addEventListener('DOMContentLoaded', function() {
    let currentCourseFilter = localStorage.getItem('currentCourseFilter') || 'all';
    let currentTypeFilter = localStorage.getItem('currentTypeFilter') || 'all';
    const apiUrl = 'backend.php';

    // DOM elements
    const addAssignmentModal = document.getElementById('addAssignmentModal');
    const addAssignmentForm = document.getElementById('addAssignmentForm');
    const addAssignmentBtn = document.getElementById('addAssignmentBtn');
    const closeAddModal = document.getElementById('closeAddModal');
    const assignmentList = document.getElementById('assignmentList');
    const viewAssignmentModal = document.getElementById('viewAssignmentModal');
    const editAssignmentModal = document.getElementById('editAssignmentModal');
    const batchEditModal = document.getElementById('batchEditModal');
    const closeViewModal = document.getElementById('closeViewModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const closeBatchEditModal = document.getElementById('closeBatchEditModal');
    const editAssignmentForm = document.getElementById('editAssignmentForm');
    const batchEditForm = document.getElementById('batchEditForm');
    const viewAssignmentContent = document.getElementById('viewAssignmentContent');

    // Update filter UI
    document.querySelector(`.filter-item[data-course="${currentCourseFilter}"]`)?.classList.add('active');
    document.querySelector(`.type-btn[data-type="${currentTypeFilter}"]`)?.classList.add('active');

    renderAssignments();
    setupEventListeners();

    function formatDate(dateString) {
        if (!dateString) return 'Chưa xác định';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function renderAssignments() {
        if (!assignmentList) {
            console.error('Không tìm thấy phần tử assignmentList');
            return;
        }
        const query = `?course=${currentCourseFilter}&type=${currentTypeFilter}`;

        fetch(apiUrl + query)
            .then(response => {
                if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log('Phản hồi từ API:', data);
                if (data.error) {
                    assignmentList.innerHTML = `<p style="text-align: center; color: #666; padding: 40px;">Lỗi: ${data.error}</p>`;
                } else if (data.message && data.message.includes('Không có')) {
                    assignmentList.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Không có bài tập nào phù hợp với bộ lọc.</p>';
                } else if (Array.isArray(data) && data.length > 0) {
                    assignmentList.innerHTML = data.map(assignment => `
                        <div class="assignment-item">
                            <input type="checkbox" class="assignment-checkbox" data-id="${assignment.id}">
                            <div class="assignment-header">
                                <h3 class="assignment-title">${assignment.title}</h3>
                                <span class="assignment-type ${assignment.type}">
                                    ${assignment.type === 'assignment' ? 'Bài tập' : 'Bài kiểm tra'}
                                </span>
                            </div>
                            <div class="assignment-meta">
                                <span><i class="fas fa-calendar"></i> Hạn nộp: ${formatDate(assignment.due_date)}</span>
                                <span><i class="fas fa-star"></i> Điểm: ${assignment.points || 0}</span>
                                <span><i class="fas fa-circle ${assignment.status === 'completed' ? 'text-success' : 'text-warning'}"></i> 
                                    ${assignment.status === 'completed' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                                </span>
                            </div>
                            <div class="assignment-desc">${assignment.description}</div>
                            <div class="assignment-actions">
                                <button class="action-btn btn-secondary view-btn" data-id="${assignment.id}"><i class="fas fa-eye"></i> Xem</button>
                                <button class="action-btn btn-secondary edit-btn" data-id="${assignment.id}"><i class="fas fa-edit"></i> Sửa</button>
                                <button class="action-btn btn-secondary delete-btn" data-id="${assignment.id}"><i class="fas fa-trash"></i> Xóa</button>
                            </div>
                        </div>
                    `).join('');
                    document.querySelectorAll('.view-btn').forEach(btn => btn.addEventListener('click', () => handleView(btn.getAttribute('data-id'))));
                    document.querySelectorAll('.edit-btn').forEach(btn => btn.addEventListener('click', () => handleEdit(btn.getAttribute('data-id'))));
                    document.querySelectorAll('.delete-btn').forEach(btn => btn.addEventListener('click', () => handleDelete(btn.getAttribute('data-id'))));
                } else {
                    assignmentList.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Dữ liệu không hợp lệ từ server.</p>';
                }
            })
            .catch(error => {
                console.error('Lỗi khi lấy danh sách bài tập:', error);
                assignmentList.innerHTML = `<p style="text-align: center; color: #666; padding: 40px;">Lỗi khi tải bài tập: ${error.message}. Vui lòng thử lại sau.</p>`;
            });
    }

    function setupEventListeners() {
        const searchInput = document.getElementById('courseSearch');
        searchInput.addEventListener('input', function() {
            filterCourses(this.value);
        });

        document.querySelectorAll('.filter-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.filter-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                currentCourseFilter = this.getAttribute('data-course');
                localStorage.setItem('currentCourseFilter', currentCourseFilter);
                renderAssignments();
            });
        });

        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentTypeFilter = this.getAttribute('data-type');
                localStorage.setItem('currentTypeFilter', currentTypeFilter);
                renderAssignments();
            });
        });

        document.getElementById('batchEditBtn')?.addEventListener('click', handleBatchEdit);

        // Add assignment modal events
        addAssignmentBtn.addEventListener('click', function() {
            addAssignmentModal.style.display = 'block';
        });

        closeAddModal.addEventListener('click', function() {
            addAssignmentModal.style.display = 'none';
            addAssignmentForm.reset();
        });

        // Handle add assignment form submission
        addAssignmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('addAssignmentTitle').value;
            const course = document.getElementById('addAssignmentCourse').value;
            const type = document.getElementById('addAssignmentType').value;
            const dueDate = document.getElementById('addAssignmentDueDate').value;
            const desc = document.getElementById('addAssignmentDesc').value;
            const points = document.getElementById('addAssignmentPoints').value;
            const status = 'pending';

            fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'add', title, course, type, due_date: dueDate, description: desc, points, status })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Phản hồi khi thêm:', data);
                if (data.success) {
                    addAssignmentModal.style.display = 'none';
                    addAssignmentForm.reset();
                    renderAssignments();
                } else {
                    alert('Lỗi khi thêm bài tập: ' + (data.error || 'Không xác định'));
                }
            })
            .catch(error => {
                console.error('Lỗi khi gửi yêu cầu:', error);
                alert('Lỗi khi thêm bài tập. Vui lòng thử lại.');
            });
        });

        // View modal close
        closeViewModal?.addEventListener('click', function() {
            viewAssignmentModal.style.display = 'none';
        });

        // Edit modal close
        closeEditModal?.addEventListener('click', function() {
            editAssignmentModal.style.display = 'none';
            editAssignmentForm.reset();
        });

        // Batch edit modal close
        closeBatchEditModal?.addEventListener('click', function() {
            batchEditModal.style.display = 'none';
            batchEditForm.reset();
        });

        // Handle edit assignment form submission
        editAssignmentForm?.addEventListener('submit', function(e) {
            e.preventDefault();
            const id = document.getElementById('editAssignmentId').value;
            const title = document.getElementById('editAssignmentTitle').value;
            const course = document.getElementById('editAssignmentCourse').value;
            const type = document.getElementById('editAssignmentType').value;
            const dueDate = document.getElementById('editAssignmentDueDate').value;
            const desc = document.getElementById('editAssignmentDesc').value;
            const points = document.getElementById('editAssignmentPoints').value;
            const status = document.getElementById('editAssignmentStatus').value;

            fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update', id, title, course, type, due_date: dueDate, description: desc, points, status })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Phản hồi khi sửa:', data);
                if (data.success) {
                    editAssignmentModal.style.display = 'none';
                    editAssignmentForm.reset();
                    renderAssignments();
                } else {
                    alert('Lỗi khi sửa bài tập: ' + (data.error || 'Không xác định'));
                }
            })
            .catch(error => {
                console.error('Lỗi khi gửi yêu cầu:', error);
                alert('Lỗi khi sửa bài tập. Vui lòng thử lại.');
            });
        });

        // Handle batch edit form submission
        batchEditForm?.addEventListener('submit', function(e) {
            e.preventDefault();
            const selectedIds = Array.from(document.querySelectorAll('.assignment-checkbox:checked')).map(checkbox => checkbox.getAttribute('data-id'));
            const dueDate = document.getElementById('batchEditDueDate').value;
            const status = document.getElementById('batchEditStatus').value;

            if (selectedIds.length === 0) {
                alert('Vui lòng chọn ít nhất một bài tập để chỉnh sửa hàng loạt.');
                return;
            }

            fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'batch_update', ids: selectedIds, due_date: dueDate, status })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Phản hồi khi chỉnh sửa hàng loạt:', data);
                if (data.success) {
                    batchEditModal.style.display = 'none';
                    batchEditForm.reset();
                    renderAssignments();
                } else {
                    alert('Lỗi khi chỉnh sửa hàng loạt: ' + (data.error || 'Không xác định'));
                }
            })
            .catch(error => {
                console.error('Lỗi khi gửi yêu cầu:', error);
                alert('Lỗi khi chỉnh sửa hàng loạt. Vui lòng thử lại.');
            });
        });

        // Close modals when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === addAssignmentModal) {
                addAssignmentModal.style.display = 'none';
                addAssignmentForm.reset();
            }
            if (e.target === viewAssignmentModal) {
                viewAssignmentModal.style.display = 'none';
            }
            if (e.target === editAssignmentModal) {
                editAssignmentModal.style.display = 'none';
                editAssignmentForm.reset();
            }
            if (e.target === batchEditModal) {
                batchEditModal.style.display = 'none';
                batchEditForm.reset();
            }
        });
    }

    function handleView(id) {
        fetch(`${apiUrl}?action=view&id=${id}`)
            .then(response => response.json())
            .then(data => {
                console.log('Phản hồi khi xem:', data);
                if (data.success && data.assignment) {
                    const assignment = data.assignment;
                    viewAssignmentContent.innerHTML = `
                        <p><strong>Tiêu đề:</strong> ${assignment.title}</p>
                        <p><strong>Môn học:</strong> ${assignment.course}</p>
                        <p><strong>Loại:</strong> ${assignment.type === 'assignment' ? 'Bài tập' : 'Bài kiểm tra'}</p>
                        <p><strong>Hạn nộp:</strong> ${formatDate(assignment.due_date)}</p>
                        <p><strong>Điểm:</strong> ${assignment.points || 0}</p>
                        <p><strong>Trạng thái:</strong> ${assignment.status === 'completed' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</p>
                        <p><strong>Mô tả:</strong> ${assignment.description}</p>
                    `;
                    viewAssignmentModal.style.display = 'block';
                } else {
                    alert('Lỗi khi xem bài tập: ' + (data.error || 'Không xác định'));
                }
            })
            .catch(error => {
                console.error('Lỗi khi xem bài tập:', error);
                alert('Lỗi khi xem bài tập. Vui lòng thử lại.');
            });
    }

    function handleEdit(id) {
        fetch(`${apiUrl}?action=view&id=${id}`)
            .then(response => response.json())
            .then(data => {
                console.log('Phản hồi khi lấy dữ liệu sửa:', data);
                if (data.success && data.assignment) {
                    const assignment = data.assignment;
                    document.getElementById('editAssignmentId').value = assignment.id;
                    document.getElementById('editAssignmentTitle').value = assignment.title;
                    document.getElementById('editAssignmentCourse').value = assignment.course;
                    document.getElementById('editAssignmentType').value = assignment.type;
                    document.getElementById('editAssignmentDueDate').value = assignment.due_date ? assignment.due_date.split('T')[0] : '';
                    document.getElementById('editAssignmentDesc').value = assignment.description;
                    document.getElementById('editAssignmentPoints').value = assignment.points || 0;
                    document.getElementById('editAssignmentStatus').value = assignment.status;
                    editAssignmentModal.style.display = 'block';
                } else {
                    alert('Lỗi khi lấy thông tin bài tập: ' + (data.error || 'Không xác định'));
                }
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu sửa:', error);
                alert('Lỗi khi lấy thông tin bài tập. Vui lòng thử lại.');
            });
    }

    function handleDelete(id) {
        if (confirm('Bạn có chắc muốn xóa bài tập này?')) {
            fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Phản hồi khi xóa:', data);
                if (data.success) {
                    renderAssignments();
                } else {
                    alert('Lỗi khi xóa bài tập: ' + (data.error || 'Không xác định'));
                }
            })
            .catch(error => {
                console.error('Lỗi khi xóa:', error);
                alert('Lỗi khi xóa bài tập. Vui lòng thử lại.');
            });
        }
    }

    function handleBatchEdit() {
        const selectedIds = Array.from(document.querySelectorAll('.assignment-checkbox:checked')).map(checkbox => checkbox.getAttribute('data-id'));
        if (selectedIds.length === 0) {
            alert('Vui lòng chọn ít nhất một bài tập để chỉnh sửa hàng loạt.');
            return;
        }
        batchEditModal.style.display = 'block';
    }

    function filterCourses(searchTerm) {
        const courseItems = document.querySelectorAll('.filter-item');
        courseItems.forEach(item => {
            const courseName = item.textContent.toLowerCase();
            item.style.display = courseName.includes(searchTerm.toLowerCase()) ? 'block' : 'none';
        });
    }
});