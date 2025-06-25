document.addEventListener("DOMContentLoaded", function () {
  const adminContent = document.getElementById('admin-content');

  document.getElementById('tab-products').onclick = function() {
  adminContent.innerHTML = `
    <h2>Quản lý sản phẩm</h2>
    <form id="product-form" enctype="multipart/form-data" style="margin-bottom:24px;">
      <label>
        Tên sản phẩm:
        <input type="text" name="product_name" required>
      </label>
      <label style="margin-left:16px;">
        Giá:
        <input type="number" name="price" required>
      </label>
      <label style="margin-left:16px;">
        Số lượng:
        <input type="number" name="quantity" required>
      </label>
      <label style="margin-left:16px;">
        Ảnh:
        <input type="file" name="file" accept="image/*" required>
      </label>
      <label style="margin-left:16px;">
        Danh mục:
        <select name="category_id" id="category-select" required>
          <option value="">--Chọn danh mục--</option>
        </select>
      </label>
      <label style="margin-left:16px;">
        Mô tả:
        <input type="text" name="description">
      </label>
      <button type="submit" style="margin-left:16px;">Thêm sản phẩm</button>
    </form>
    <div id='product-table-wrap'>Đang tải sản phẩm...</div>
  `;
  loadCategoriesForProductForm();
  loadProducts();

  // Xử lý submit form
  document.getElementById('product-form').onsubmit = function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch("http://localhost:8080/product/create", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(() => {
      loadProducts();
      this.reset();
    });
  };
};

function loadCategoriesForProductForm() {
  fetch("http://localhost:8080/category/get")
    .then(res => res.json())
    .then(data => {
      const categories = Array.isArray(data) ? data : data.data;
      const select = document.getElementById('category-select');
      categories.forEach(c => {
        const option = document.createElement('option');
        option.value = c.category_id || c.id;
        option.textContent = c.category_name || c.name;
        select.appendChild(option);
      });
    });
}

function loadProducts() {
  fetch("http://localhost:8080/product/get")
    .then(res => res.json())
    .then(data => {
      const products = Array.isArray(data) ? data : data.data;
      let html = `
        <table border="1" cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;">
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
          <tbody>
            ${products.map(p => `
              <tr>
                <td>${p.product_id || p.id || ""}</td>
                <td>${p.product_name || p.name || ""}</td>
                <td>${p.price ? p.price.toLocaleString() + "đ" : ""}</td>
                <td>${p.quantity ?? ""}</td>
                <td>
                  ${p.product_image ? `<img src="http://localhost:8080/product/file/${p.product_image}" alt="" style="height:40px;">` : ""}
                </td>
                <td>${p.description || ""}</td>
                <td>
                  <button class="btn-edit" data-id="${p.product_id || p.id}">Sửa</button>
                  <button class="btn-delete" data-id="${p.product_id || p.id}">Xóa</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
      document.getElementById('product-table-wrap').innerHTML = html;
    })
    .catch(() => {
      document.getElementById('product-table-wrap').innerHTML = "<p style='color:red'>Lỗi khi tải sản phẩm!</p>";
    });
}

  document.getElementById('tab-categories').onclick = function() {
  adminContent.innerHTML = `
    <h2>Quản lý danh mục</h2>
    <div id='category-table-wrap'>Đang tải danh mục...</div>
  `;
  loadCategories();
};

function loadCategories() {
  fetch("http://localhost:8080/category/get")
    .then(res => res.json())
    .then(data => {
      const categories = Array.isArray(data) ? data : data.data;
      let html = `
        <table border="1" cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên danh mục</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            ${categories.map(c => `
              <tr>
                <td>${c.category_id || c.id || ""}</td>
                <td>${c.category_name || c.name || ""}</td>
                <td>
                  <button class="btn-edit" data-id="${c.category_id || c.id}">Sửa</button>
                  <button class="btn-delete" data-id="${c.category_id || c.id}">Xóa</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
      document.getElementById('category-table-wrap').innerHTML = html;
    });
}
  document.getElementById('tab-users').onclick = function() {
    adminContent.innerHTML = "<h2>Quản lý người dùng</h2><p>Chức năng này sẽ hiển thị danh sách, thêm, sửa, xóa người dùng.</p>";
  };

  // Mặc định load tab sản phẩm
  document.getElementById('tab-products').click();
});
// theem sản phẩm
