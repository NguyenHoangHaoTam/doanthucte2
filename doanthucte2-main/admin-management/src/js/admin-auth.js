// Debug: Kiểm tra localStorage
    console.log('Admin token:', localStorage.getItem('admin_token'));
    console.log('Admin username:', localStorage.getItem('admin_username'));
    console.log('Admin ID:', localStorage.getItem('admin_id'));

    // Load thông tin admin từ localStorage
    function loadAdminInfo() {
      const adminUsername = localStorage.getItem('admin_username');
      const adminAvatar = document.getElementById('admin-avatar');
      const adminDisplayName = document.getElementById('admin-display-name');
      
      console.log('Loading admin info for:', adminUsername);
      
      if (adminUsername) {
        // Hiển thị tên admin
        adminDisplayName.textContent = adminUsername;
        
        // Tạo avatar từ chữ cái đầu của username
        const firstLetter = adminUsername.charAt(0).toUpperCase();
        adminAvatar.textContent = firstLetter;
        adminAvatar.classList.remove('loading-avatar');
        
        // Thay đổi màu avatar dựa trên username
        const colors = [
          'linear-gradient(135deg, #4facfe, #00f2fe)',
          'linear-gradient(135deg, #43e97b, #38f9d7)',
          'linear-gradient(135deg, #fa709a, #fee140)',
          'linear-gradient(135deg, #a8edea, #fed6e3)',
          'linear-gradient(135deg, #667eea, #764ba2)',
          'linear-gradient(135deg, #f093fb, #f5576c)'
        ];
        const colorIndex = adminUsername.length % colors.length;
        adminAvatar.style.background = colors[colorIndex];
        
        console.log('Admin info loaded successfully');
      } else {
        console.log('No admin username found in localStorage');
        adminDisplayName.textContent = 'Admin';
        adminAvatar.textContent = 'A';
        adminAvatar.classList.remove('loading-avatar');
      }
    }

    // Load thông tin admin khi trang được tải
    document.addEventListener('DOMContentLoaded', function() {
      console.log('DOM loaded, loading admin info...');
      loadAdminInfo();
    });

    // Thêm delay để đảm bảo localStorage đã được set
    setTimeout(loadAdminInfo, 100);

    // Xử lý active tab
    document.querySelectorAll('nav a:not(#admin-logout)').forEach(tab => {
      tab.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all tabs
        document.querySelectorAll('nav a').forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
      });
    });

    // Đăng xuất Admin
    document.getElementById('admin-logout')?.addEventListener('click', function (e) {
      e.preventDefault();
      console.log('Logging out admin...');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_username');
      localStorage.removeItem('admin_id');
      window.location.href = "admin-login.html";
    });

    // Đăng nhập Admin (dành cho trang admin-login.html)
    document.getElementById('admin-login-form')?.addEventListener('submit', async function (e) {
      e.preventDefault();
      const username = document.getElementById('admin-username').value;
      const password = document.getElementById('admin-password').value;

      try {
        const res = await fetch(`http://localhost:8080/login/admin/sign_in?username=${username}&password=${password}`, {
          method: 'POST'
        });

        const result = await res.json();

        if (result.success) {
          localStorage.setItem('admin_token', result.data.token);
          localStorage.setItem('admin_username', result.data.username);
          localStorage.setItem('admin_id', result.data.adminId);
          window.location.href = 'admin.html';
        } else {
          document.getElementById('admin-login-error').textContent = result.data;
        }
      } catch (err) {
        console.error("Lỗi khi gửi yêu cầu đăng nhập admin:", err);
        document.getElementById('admin-login-error').textContent = "Có lỗi xảy ra khi đăng nhập.";
      }
    });
