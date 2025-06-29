class CategoryManagement {
  constructor() {
    this.categories = [];
  }

  // Khởi tạo giao diện quản lý danh mục
  init(container) {
    container.innerHTML = `
      <div class="container">
        <div class="header">
            <h2>Quản lý danh mục</h2>
        </div>
        
        <div class="content">
            <div class="form-section">
                <form id="category-form">
                    <div class="form-group">
                        <label for="category-name-input">Tên danh mục mới</label>
                        <input type="text" id="category-name-input" class="form-input" placeholder="Nhập tên danh mục..." required>
                    </div>
                    <button type="submit" class="btn btn-primary">Thêm danh mục</button>
                </form>
            </div>
            
            <div class="table-container">
                <div id='category-table-wrap'>
                    <div class="loading">Đang tải danh mục...</div>
                </div>
            </div>
        </div>
    </div>
    `;
    
    this.bindEvents();
    this.loadCategories();
  }
  bindEvents() {
    document.getElementById('category-form').onsubmit = (e) => {
      e.preventDefault();
      this.addCategory();
    };
  }

  // Thêm danh mục mới
  addCategory() {
    const categoryName = document.getElementById('category-name-input').value.trim();

    if (!categoryName) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    fetch('http://localhost:8080/category/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_name: categoryName })
    })
    .then(res => res.json())
    .then((data) => {
      if (data.success || data.category_id) {
        this.loadCategories();
        document.getElementById('category-form').reset();
        alert('Thêm danh mục thành công!');
      } else {
        throw new Error(data.message || 'Danh mục đã tồn tại');
      }
    })
    .catch(error => {
      console.error('Error adding category:', error);
      alert('Có lỗi xảy ra khi thêm danh mục: ' + error.message);
    });
  }

  // Tải danh sách danh mục
  loadCategories() {
    fetch("http://localhost:8080/category/get")
      .then(res => res.json())
      .then(data => {
        this.categories = Array.isArray(data) ? data : data.data;
        this.renderCategories();
      })
      .catch(error => {
        console.error('Error loading categories:', error);
        document.getElementById('category-table-wrap').innerHTML = 
          "<p style='color:red'>Không thể tải danh mục!</p>";
      });
  }

  // Hiển thị danh sách danh mục
  renderCategories() {
    const html = `
      <table class="table">
                        <thead>
                            <tr>
                                <th style="width: 80px;">ID</th>
                                <th>Tên danh mục</th>
                                <th style="width: 120px;">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.categories.map(category => `
                                <tr>
                                    <td><strong>${category.category_id || category.id || ""}</strong></td>
                                    <td>
                                        <span class="category-name" data-id="${category.category_id || category.id}">
                                            ${category.category_name || category.name || ""}
                                        </span>
                                        <input type="text" class="edit-input" data-id="${category.category_id || category.id}" 
                                               value="${category.category_name || category.name || ""}" style="display:none;">
                                    </td>
                                    <td>
                                        <button class="btn btn-danger btn-delete-category" data-id="${category.category_id || category.id}">
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
    `;
    
    document.getElementById('category-table-wrap').innerHTML = html;
    this.bindTableEvents();
  }
  bindTableEvents() {
    document.querySelectorAll('.btn-delete-category').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        this.deleteCategory(id);
      };
    });
  }

  // Xóa danh mục
  deleteCategory(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      return;
    }

    fetch(`http://localhost:8080/category/delete/${id}`, {
      method: "DELETE"
    })
    .then(res => {
      if (res.ok) {
        this.loadCategories();
        alert('Xóa danh mục thành công!');
      } else {
        throw new Error('Không thể xóa danh mục');
      }
    })
    .catch(error => {
      console.error('Error deleting category:', error);
      alert('Có lỗi xảy ra khi xóa danh mục: ' + error.message);
    });
  }

  // Tìm kiếm danh mục
  searchCategories(keyword) {
    if (!keyword) {
      this.renderCategories();
      return;
    }

    const filteredCategories = this.categories.filter(category => 
      (category.category_name || category.name || "").toLowerCase().includes(keyword.toLowerCase()) ||
      String(category.category_id || category.id).includes(keyword)
    );
    const currentCategories = this.categories;
    this.categories = filteredCategories;
    this.renderCategories();
    this.categories = currentCategories; 
  }
  refresh() {
    this.loadCategories();
  }
}