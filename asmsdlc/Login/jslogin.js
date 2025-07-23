// --- JS từ Login.html ---
// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// Handle form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simple validation
        if (!email || !password) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        
        // Simulate login process
        const loginBtn = document.querySelector('.login-btn');
        const originalText = loginBtn.innerHTML;
        
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang đăng nhập...';
        loginBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // For demo purposes, redirect to main page
            window.location.href = 'HTML.HTML';
        }, 2000);
    });
}

// Add some interactive effects
// Đã xóa đoạn JS xử lý social-btn

const forgotPassword = document.querySelector('.forgot-password');
if (forgotPassword) {
    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Tính năng khôi phục mật khẩu sẽ được phát triển sau!');
    });
}

// --- Modal yêu cầu cấp quyền email ---
document.addEventListener('DOMContentLoaded', function() {
    var openEmailPermissionBtn = document.getElementById('openEmailPermissionModal');
    var emailPermissionModal = document.getElementById('emailPermissionModal');
    if (openEmailPermissionBtn && emailPermissionModal) {
        openEmailPermissionBtn.addEventListener('click', function() {
            emailPermissionModal.style.display = 'flex';
            document.getElementById('permissionEmail').focus();
        });
    }
    var closeEmailModalBtn = document.getElementById('closeEmailModal');
    if (closeEmailModalBtn && emailPermissionModal) {
        closeEmailModalBtn.addEventListener('click', function() {
            emailPermissionModal.style.display = 'none';
        });
        // Đóng modal khi click ra ngoài nội dung
        emailPermissionModal.addEventListener('mousedown', function(e) {
            if (e.target === emailPermissionModal) {
                emailPermissionModal.style.display = 'none';
            }
        });
    }
    // Xử lý gửi form yêu cầu cấp quyền email
    var emailPermissionForm = document.getElementById('emailPermissionForm');
    if (emailPermissionForm) {
        emailPermissionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('permissionEmail').value;
            if (!email) {
                alert('Vui lòng nhập email!');
                return;
            }
            alert('Yêu cầu cấp quyền email đã được gửi!');
            emailPermissionModal.style.display = 'none';
        });
    }
}); 