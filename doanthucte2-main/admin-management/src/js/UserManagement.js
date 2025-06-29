class UserManagement {
  constructor() {
    this.allUsers = [];
  }

  init(container) {
    container.innerHTML = `
      <div class="container">
        <div class="header">
            <h2>Quản lý người dùng</h2>
        </div>
        
        <div class="content">
            <div class="search-section">
                <input type="text" id="search-user-input" placeholder="Tìm theo tên đăng nhập..." />
                <button id="search-user-btn">Tìm kiếm</button>
                <button id="reset-user-btn">Làm mới</button>
            </div>
            
            <div class="table-container">
                <div id='user-table-wrap'>
                    <div class="loading">Đang tải danh sách người dùng...</div>
                </div>
            </div>
        </div>
    </div>
    `;

    this.loadUsers();
    this.bindEvents();
  }

  loadUsers() {
    fetch("http://localhost:8080/user/get", {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
      }
    })
      .then(res => res.json())
      .then(data => {
        this.allUsers = Array.isArray(data) ? data : data.data;
        this.renderUsers(this.allUsers);
      })
      .catch(error => {
        console.error('Error loading users:', error);
        document.getElementById('user-table-wrap').innerHTML = "<p style='color:red'>Không thể tải danh sách người dùng!</p>";
      });
  }

  renderUsers(users) {
    const html = `
       <table>
                        <thead>
                            <tr>
                                <th style="width: 80px;">ID</th>
                                <th>Tên đăng nhập</th>
                                <th style="width: 120px;">Vai trò</th>
                                <th style="width: 140px;">Ngày tạo</th>
                                <th style="width: 100px;">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(u => `
                                <tr>
                                    <td><strong>${u.id}</strong></td>
                                    <td>${u.username}</td>
                                    <td>
                                        <span class="role-badge ${u.role_id === 1 ? 'role-user' : u.role_id === 2 ? 'role-admin' : 'role-unknown'}">
                                            ${u.role_id === 1 ? 'User' : u.role_id === 2 ? 'Admin' : 'Không xác định'}
                                        </span>
                                    </td>
                                    <td>${u.created_Dated ? new Date(u.created_Dated).toLocaleDateString('vi-VN') : ""}</td>
                                    <td>
                                        <button class="btn-delete-user" data-id="${u.id}">Xóa</button>
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
    `;
    document.getElementById('user-table-wrap').innerHTML = html;
    
    this.bindDeleteEvents();
  }

  bindDeleteEvents() {
    document.querySelectorAll('.btn-delete-user').forEach(btn => {
      btn.onclick = (e) => {
        const userId = e.target.getAttribute('data-id');
        this.deleteUser(userId);
      };
    });
  }

  deleteUser(userId) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      fetch(`http://localhost:8080/user/${userId}/delete_user`, {
        method: "DELETE",
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
        }
      })
        .then(() => this.loadUsers())
        .catch(error => {
          console.error('Error deleting user:', error);
          alert('Có lỗi xảy ra khi xóa người dùng!');
        });
    }
  }

  searchUsers() {
    const keyword = document.getElementById('search-user-input').value.trim().toLowerCase();
    if (!keyword) return this.renderUsers(this.allUsers);
    
    const filtered = this.allUsers.filter(u =>
      u.username?.toLowerCase().includes(keyword) ||
      String(u.id).includes(keyword)
    );
    this.renderUsers(filtered);
  }

  resetSearch() {
    document.getElementById('search-user-input').value = "";
    this.renderUsers(this.allUsers);
  }

  bindEvents() {
    document.getElementById('search-user-btn').onclick = () => {
      this.searchUsers();
    };

    document.getElementById('reset-user-btn').onclick = () => {
      this.resetSearch();
    };

    document.getElementById('search-user-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.searchUsers();
      }
    });
  }
}