class ProductManagement {
  constructor() {
    this.allProducts = [];
    this.filteredProducts = [];
    this.currentPage = 1;
    this.itemsPerPage = 8;
  }

  // Khởi tạo giao diện quản lý sản phẩm
  init(adminContent) {
    adminContent.innerHTML = `
      <div class="product-management">
        <h2>Quản lý sản phẩm</h2>
        
        <!-- Search Section -->
        <div class="search-section">
          <input type="text" id="search-product-input" placeholder="🔍 Tìm kiếm sản phẩm...">
          <button id="search-product-btn" class="btn btn-primary">Tìm kiếm</button>
          <button id="reset-product-btn" class="btn btn-secondary">Làm mới</button>
        </div>

        <!-- Form Section -->
        <div class="form-section">
          <h3>Thêm sản phẩm mới</h3>
          <form id="product-form" enctype="multipart/form-data">
            <div class="form-row">
              <div class="form-group">
                <label>Tên sản phẩm</label>
                <input type="text" name="product_name" required placeholder="Nhập tên sản phẩm">
              </div>
              <div class="form-group">
                <label>Giá (VNĐ)</label>
                <input type="number" name="price" required placeholder="0">
              </div>
              <div class="form-group">
                <label>Số lượng</label>
                <input type="number" name="quantity" required placeholder="0">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Danh mục</label>
                <select name="category_id" id="category_id" required>
                  <option value="">--Chọn danh mục--</option>
                </select>
              </div>
              <div class="form-group">
                <label>Hình ảnh</label>
                <div class="file-upload">
                  <input type="file" name="file" accept="image/*" required>
                  <div class="file-upload-label">📁 Chọn hình ảnh</div>
                </div>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Mô tả</label>
                <textarea name="description" placeholder="Mô tả chi tiết về sản phẩm..."></textarea>
              </div>
            </div>
            
            <div class="form-row">
              <button type="submit" class="btn btn-success">✅ Thêm sản phẩm</button>
            </div>
          </form>
        </div>

        <!-- Table Section -->
        <div class="table-section">
          <div class="table-header">
            <h3>Danh sách sản phẩm</h3>
            <div class="table-info">
              <span id="product-count">Tổng: 0 sản phẩm</span>
            </div>
          </div>
          <div id='product-table-wrap' class="loading">Đang tải sản phẩm...</div>
          
          <!-- Pagination -->
          <div id="pagination-container" class="pagination-container" style="display: none;">
            <div class="pagination-info">
              <span id="pagination-info-text">Hiển thị 1-8 của 0 sản phẩm</span>
            </div>
            <div class="pagination-controls">
              <button id="prev-page" class="btn-pagination" disabled>‹ Trước</button>
              <div id="page-numbers" class="page-numbers"></div>
              <button id="next-page" class="btn-pagination" disabled>Sau ›</button>
            </div>
          </div>
        </div>

        <!-- Modal chỉnh sửa sản phẩm -->
        <div id="edit-product-modal" class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3>✏️ Chỉnh sửa sản phẩm</h3>
            </div>
            <form id="edit-product-form" enctype="multipart/form-data">
              <input type="hidden" name="product_id">
              <div class="form-row">
                <div class="form-group">
                  <label>Tên sản phẩm</label>
                  <input type="text" name="product_name" required>
                </div>
                <div class="form-group">
                  <label>Giá (VNĐ)</label>
                  <input type="number" name="price" required>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Số lượng</label>
                  <input type="number" name="quantity" required>
                </div>
                <div class="form-group">
                  <label>Danh mục</label>
                  <select name="category_id" id="edit-category-select" required>
                    <option value="">--Chọn danh mục--</option>
                  </select>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Mô tả</label>
                  <textarea name="description"></textarea>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Hình ảnh mới (tùy chọn)</label>
                  <div class="file-upload">
                    <input type="file" name="file" accept="image/*">
                    <div class="file-upload-label">📁 Chọn hình ảnh mới</div>
                  </div>
                </div>
              </div>
              
              <div class="modal-actions">
                <button type="button" id="cancel-edit" class="btn btn-secondary">❌ Hủy</button>
                <button type="submit" class="btn btn-success">💾 Cập nhật</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- CSS cho phân trang -->
      <style>
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .table-info {
          font-size: 14px;
          color: #666;
        }

        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding: 15px 0;
          border-top: 1px solid #e1e5e9;
        }

        .pagination-info {
          font-size: 14px;
          color: #666;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-pagination {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          color: #495057;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .product-management {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.product-management h2 {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 2.5rem;
    font-weight: 600;
    margin: 0 0 30px 0;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
}

.product-management h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
}

.product-management h2::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    animation: shimmer 3s infinite;
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%) translateY(-100%) rotate(45deg);
    }
    100% {
        transform: translateX(100%) translateY(100%) rotate(45deg);
    }
}

/* Responsive design */
@media (max-width: 768px) {
    .product-management {
        padding: 10px;
        margin: 10px;
    }

    .product-management h2 {
        font-size: 2rem;
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 16px;
    }
}

@media (max-width: 480px) {
    .product-management {
        padding: 5px;
        margin: 5px;
    }

    .product-management h2 {
        font-size: 1.8rem;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 12px;
    }
}
        .btn-pagination:hover:not(:disabled) {
          background: #e9ecef;
          border-color: #adb5bd;
        }

        .btn-pagination:disabled {
          background: #e9ecef;
          color: #6c757d;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .page-numbers {
          display: flex;
          gap: 5px;
        }

        .page-number {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          color: #495057;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          min-width: 40px;
          text-align: center;
          transition: all 0.2s ease;
        }

        .page-number:hover {
          background: #e9ecef;
          border-color: #adb5bd;
        }

        .page-number.active {
          background: #007bff;
          border-color: #007bff;
          color: white;
        }

        .page-number.active:hover {
          background: #0056b3;
          border-color: #0056b3;
        }

        .page-ellipsis {
          padding: 8px 4px;
          color: #6c757d;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .pagination-container {
            flex-direction: column;
            gap: 10px;
          }

          .pagination-controls {
            flex-wrap: wrap;
            justify-content: center;
          }

          .page-numbers {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      </style>
    `;

    this.setupEventListeners();
    this.loadCategoriesForProductForm();
    this.loadProducts();
    this.addNotificationStyles();
  }

  // Thiết lập các event listeners
  setupEventListeners() {
    const form = document.getElementById('product-form');
    form.onsubmit = (e) => this.handleAddProduct(e);
    document.getElementById('search-product-btn').onclick = () => this.handleSearch();
    document.getElementById('reset-product-btn').onclick = () => this.handleReset();
    document.getElementById('cancel-edit').onclick = () => this.hideEditModal();
    document.getElementById('prev-page').onclick = () => this.goToPage(this.currentPage - 1);
    document.getElementById('next-page').onclick = () => this.goToPage(this.currentPage + 1);
    this.setupFileUploadLabels();
  }
  setupFileUploadLabels() {
    document.querySelectorAll('.file-upload input[type="file"]').forEach(input => {
      input.addEventListener('change', function() {
        const label = this.nextElementSibling;
        if (this.files.length > 0) {
          label.textContent = `📁 ${this.files[0].name}`;
          label.style.color = '#27ae60';
        } else {
          label.textContent = '📁 Chọn hình ảnh';
          label.style.color = '#7f8c8d';
        }
      });
    });
  }

  // Xử lý thêm sản phẩm
  handleAddProduct(e) {
    e.preventDefault();
    const form = document.getElementById('product-form');
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Đang thêm...';
    submitBtn.disabled = true;
    
    fetch("http://localhost:8080/product/create", { 
      method: "POST", 
      body: formData 
    })
    .then(res => res.json())
    .then(() => {
      this.loadProducts();
      form.reset();
      // Reset file upload labels
      document.querySelectorAll('.file-upload-label').forEach(label => {
        label.textContent = '📁 Chọn hình ảnh';
        label.style.color = '#7f8c8d';
      });
      this.showNotification('✅ Thêm sản phẩm thành công!', 'success');
    })
    .catch(error => {
      console.error('Error adding product:', error);
      this.showNotification('❌ Có lỗi xảy ra khi thêm sản phẩm!', 'error');
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  }

  // Hiển thị thông báo
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Xử lý tìm kiếm
  handleSearch() {
    const keyword = document.getElementById('search-product-input').value.trim().toLowerCase();
    if (!keyword) {
      this.filteredProducts = [...this.allProducts];
    } else {
      this.filteredProducts = this.allProducts.filter(p => 
        (p.product_name || '').toLowerCase().includes(keyword) || 
        (p.description || '').toLowerCase().includes(keyword)
      );
    }
    
    this.currentPage = 1; 
    this.renderProducts();
  }
  handleReset() {
    document.getElementById('search-product-input').value = "";
    this.filteredProducts = [...this.allProducts];
    this.currentPage = 1;
    this.renderProducts();
  }
  loadCategoriesForProductForm() {
    fetch("http://localhost:8080/category/get")
      .then(res => res.json())
      .then(data => {
        const categories = Array.isArray(data) ? data : data.data;
        const mainSelect = document.getElementById('category_id');
        const editSelect = document.getElementById('edit-category-select');
        mainSelect.innerHTML = '<option value="">--Chọn danh mục--</option>';
        editSelect.innerHTML = '<option value="">--Chọn danh mục--</option>';
        
        categories.forEach(c => {
          const option = document.createElement('option');
          option.value = c.category_id || c.id;
          option.textContent = c.category_name || c.name;
          mainSelect.appendChild(option);

          const editOption = option.cloneNode(true);
          editSelect.appendChild(editOption);
        });
      })
      .catch(error => {
        console.error('Error loading categories:', error);
      });
  }

  // Load danh sách sản phẩm
  loadProducts() {
    document.getElementById('product-table-wrap').innerHTML = '<div class="loading">Đang tải sản phẩm...</div>';
    
    fetch("http://localhost:8080/product/get")
      .then(res => res.json())
      .then(data => {
        this.allProducts = (Array.isArray(data) ? data : data.data)
          .filter(p => !p.deleted || p.deleted === 0 || p.deleted === "0" || p.deleted === false);
        this.filteredProducts = [...this.allProducts];
        this.currentPage = 1;
        this.renderProducts();
      })
      .catch(error => {
        console.error('Error loading products:', error);
        document.getElementById('product-table-wrap').innerHTML = 
          '<div class="empty-state"><h3>❌ Lỗi</h3><p>Không thể tải danh sách sản phẩm!</p></div>';
      });
  }

  // Tính toán phân trang
  calculatePagination() {
    const totalItems = this.filteredProducts.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, totalItems);
    
    return {
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      hasNext: this.currentPage < totalPages,
      hasPrev: this.currentPage > 1
    };
  }
  goToPage(page) {
    const { totalPages } = this.calculatePagination();
    
    if (page < 1 || page > totalPages) return;
    
    this.currentPage = page;
    this.renderProducts();
  }
  renderPagination() {
    const pagination = this.calculatePagination();
    const paginationContainer = document.getElementById('pagination-container');
    document.getElementById('product-count').textContent = `Tổng: ${pagination.totalItems} sản phẩm`;
    if (pagination.totalPages <= 1) {
      paginationContainer.style.display = 'none';
      return;
    }
    paginationContainer.style.display = 'flex';
    const startItem = pagination.startIndex + 1;
    const endItem = pagination.endIndex;
    document.getElementById('pagination-info-text').textContent = 
      `Hiển thị ${startItem}-${endItem} của ${pagination.totalItems} sản phẩm`;
    document.getElementById('prev-page').disabled = !pagination.hasPrev;
    document.getElementById('next-page').disabled = !pagination.hasNext;
    this.renderPageNumbers(pagination.totalPages);
  }
  renderPageNumbers(totalPages) {
    const pageNumbersContainer = document.getElementById('page-numbers');
    pageNumbersContainer.innerHTML = '';
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(totalPages, this.currentPage + 2);
    if (this.currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (this.currentPage >= totalPages - 2) {
      startPage = Math.max(totalPages - 4, 1);
    }
    if (startPage > 1) {
      this.addPageNumber(1);
      if (startPage > 2) {
        this.addEllipsis();
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      this.addPageNumber(i);
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        this.addEllipsis();
      }
      this.addPageNumber(totalPages);
    }
  }
  addPageNumber(pageNum) {
    const pageNumbersContainer = document.getElementById('page-numbers');
    const pageButton = document.createElement('button');
    pageButton.className = `page-number ${pageNum === this.currentPage ? 'active' : ''}`;
    pageButton.textContent = pageNum;
    pageButton.onclick = () => this.goToPage(pageNum);
    pageNumbersContainer.appendChild(pageButton);
  }
  addEllipsis() {
    const pageNumbersContainer = document.getElementById('page-numbers');
    const ellipsis = document.createElement('span');
    ellipsis.className = 'page-ellipsis';
    ellipsis.textContent = '...';
    pageNumbersContainer.appendChild(ellipsis);
  }
  renderProducts() {
    const pagination = this.calculatePagination();
    
    if (this.filteredProducts.length === 0) {
      document.getElementById('product-table-wrap').innerHTML = 
        '<div class="empty-state"><h3>📦 Trống</h3><p>Không có sản phẩm nào được tìm thấy</p></div>';
      document.getElementById('pagination-container').style.display = 'none';
      document.getElementById('product-count').textContent = 'Tổng: 0 sản phẩm';
      return;
    }
    const currentPageProducts = this.filteredProducts.slice(pagination.startIndex, pagination.endIndex);
    
    const tbody = currentPageProducts.map(p => {
      const quantity = p.quantity || 0;
      const quantityClass = quantity < 10 ? 'low' : quantity < 50 ? 'medium' : 'high';
      
      return `
        <tr>
          <td><strong>#${p.product_id || p.id}</strong></td>
          <td><strong>${p.product_name || p.name}</strong></td>
          <td><span class="price">${(p.price || 0).toLocaleString()}₫</span></td>
          <td><span class="quantity ${quantityClass}">${quantity}</span></td>
          <td>
            ${p.product_image ? 
              `<img src="http://localhost:8080/product/file/${p.product_image}" style="height:50px; width:50px; object-fit:cover;">` : 
              '<span style="color:#bdc3c7;">📷 Không có ảnh</span>'
            }
          </td>
          <td><span title="${p.description || ''}">${(p.description || 'Không có mô tả').substring(0, 50)}${(p.description || '').length > 50 ? '...' : ''}</span></td>
          <td class="actions">
            <button class="btn-edit" data-id="${p.product_id || p.id}" title="Chỉnh sửa">✏️</button>
            <button class="btn-delete" data-id="${p.product_id || p.id}" title="Xóa">🗑️</button>
          </td>
        </tr>
      `;
    }).join("");

    document.getElementById('product-table-wrap').innerHTML = `
      <table class="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Hình ảnh</th>
            <th>Mô tả</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>${tbody}</tbody>
      </table>
    `;

    this.setupTableEventListeners();
    this.renderPagination();
  }
  setupTableEventListeners() {
    // Event cho nút sửa
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.onclick = () => this.handleEditProduct(btn.getAttribute('data-id'));
    });

    // Event cho nút xóa
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.onclick = () => this.handleDeleteProduct(btn.getAttribute('data-id'));
    });
  }

  // Xử lý sửa sản phẩm
  handleEditProduct(id) {
    const product = this.allProducts.find(p => (p.product_id || p.id) == id);
    if (!product) return alert("Không tìm thấy sản phẩm!");
    const modal = document.getElementById('edit-product-modal');
    const editForm = document.getElementById('edit-product-form');
    editForm.product_id.value = product.product_id || product.id;
    editForm.product_name.value = product.product_name || product.name;
    editForm.price.value = product.price;
    editForm.quantity.value = product.quantity;
    editForm.description.value = product.description || '';
    document.getElementById('edit-category-select').value = product.category_id;
    modal.classList.add('show');
    editForm.onsubmit = (e) => this.handleUpdateProduct(e);
    modal.onclick = (e) => {
      if (e.target === modal) {
        this.hideEditModal();
      }
    };
  }
  handleUpdateProduct(e) {
    e.preventDefault();
    const editForm = document.getElementById('edit-product-form');
    const formData = new FormData(editForm);
    const updateId = formData.get("product_id");
    const submitBtn = editForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Đang cập nhật...';
    submitBtn.disabled = true;

    fetch(`http://localhost:8080/product/update/${updateId}/full`, {
      method: "PUT",
      body: formData
    })
    .then(res => res.json())
    .then(() => {
      this.hideEditModal();
      this.loadProducts();
      this.showNotification('✅ Cập nhật sản phẩm thành công!', 'success');
    })
    .catch(error => {
      console.error('Error updating product:', error);
      this.showNotification('❌ Có lỗi xảy ra khi cập nhật sản phẩm!', 'error');
    })
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  }
  hideEditModal() {
    const modal = document.getElementById('edit-product-modal');
    modal.classList.remove('show');
    const editForm = document.getElementById('edit-product-form');
    editForm.reset();
    const fileLabel = editForm.querySelector('.file-upload-label');
    if (fileLabel) {
      fileLabel.textContent = '📁 Chọn hình ảnh mới';
      fileLabel.style.color = '#7f8c8d';
    }
  }

  // Xử lý xóa sản phẩm
  handleDeleteProduct(id) {
    const product = this.allProducts.find(p => (p.product_id || p.id) == id);
    const productName = product ? (product.product_name || product.name) : 'sản phẩm này';
    
    if (confirm(`Bạn có chắc muốn xóa "${productName}"?`)) {
      fetch(`http://localhost:8080/product/delete/${id}`, {
        method: "DELETE"
      })
      .then(res => res.json())
      .then(() => {
        this.loadProducts();
        this.showNotification('✅ Xóa sản phẩm thành công!', 'success');
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        this.showNotification('❌ Có lỗi xảy ra khi xóa sản phẩm!', 'error');
      });
    }
  }
  addNotificationStyles() {
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .notification {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          min-width: 300px;
        }
      `;
      document.head.appendChild(style);
    }
  }
}
window.ProductManagement = ProductManagement;