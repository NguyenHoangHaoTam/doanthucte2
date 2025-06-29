document.addEventListener("DOMContentLoaded", function () {
  const productId = new URLSearchParams(window.location.search).get("id");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  function randomSpecValue(type) {
    const specs = {
      cpu: ["Intel Core i5-1240P", "Intel Core i7-12700H", "AMD Ryzen 7 7735HS", "Apple M2", "Intel Core i9-11950H"],
      ram: ["8GB DDR4", "16GB DDR4", "32GB DDR5", "64GB DDR5", "16GB LPDDR5"],
      ssd: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD", "512GB NVMe"],
      vga: ["Intel Iris Xe", "NVIDIA RTX 3050", "NVIDIA RTX A4000", "AMD Radeon 680M", "RTX 4060"],
      display: ['15.6" FHD', '14" QHD', '16" WUXGA', '13.3" OLED', '17.3" FHD']
    };
    const arr = specs[type];
    return arr ? arr[Math.floor(Math.random() * arr.length)] : "...";
  }

  function renderProductDetail(product) {
    const container = document.getElementById('product-detail-container');
    container.innerHTML = `
      <div class="product-gallery">
        <img class="product-main-img" src="http://localhost:8080/product/file/${product.product_image}" alt="${product.product_name}">
        <div class="product-thumb-list">
          <img src="http://localhost:8080/product/file/${product.product_image}" alt="thumb" class="active">
        </div>
        <div class="product-commitment-block" style="background:#f4faff; padding:20px; margin-top:30px; border-radius:8px;">
          <h3 style="color:#d70018; margin-bottom:15px;">Cam kết sản phẩm</h3>
          <div style="margin-bottom:20px;">
            <p>Nguyên hộp, đầy đủ phụ kiện từ nhà sản xuất</p>
            <p>Bảo hành pin và bộ sạc 12 tháng</p>
            <p>Sạc, sách hướng dẫn sử dụng</p>
            <p><strong>Tìm hiểu thêm về laptop nhập khẩu</strong></p>
          </div>
          <div style="border-top:1px solid #ddd; border-bottom:1px solid #ddd; padding:15px 0; margin:15px 0;">
            <div style="display:flex; align-items:center; margin-bottom:10px;">
              <span style="color:#d70018; font-size:1.2em; margin-right:8px;">💶</span>
              <p style="margin:0;">Bảo hành 1 đổi 1 trong vòng 12 tháng bởi Nhà Phân Phối...</p>
            </div>
            <div style="display:flex; align-items:center;">
              <span style="color:#d70018; font-size:1.2em; margin-right:8px;">💷</span>
              <p style="margin:0;">Giá sản phẩm <strong>đã bao gồm thuế VAT</strong>...</p>
            </div>
          </div>
        </div>
      </div>
      <div class="product-info-block">
        <div>
          <div class="product-brand">${product.brand || ""}</div>
          <h1 class="product-title">${product.product_name}</h1>
          <div class="product-price-block">
            ${product.old_price ? `<span class="product-old-price">${Number(product.old_price).toLocaleString()} đ</span>` : ""}
            <span class="product-new-price">${Number(product.price).toLocaleString()} đ</span>
            ${product.old_price ? `<span class="product-discount">-${Math.round(100 - product.price * 100 / product.old_price)}%</span>` : ""}
          </div>
          ${product.old_price ? `<div class="product-save">Tiết kiệm ${(Number(product.old_price) - Number(product.price)).toLocaleString()} đ</div>` : ""}
        </div>
        <div class="product-buy-actions">
          <button class="btn-buy-now" id="btn-buy-now">Mua ngay</button>
          <button class="btn-add-cart" id="btn-add-cart">Thêm vào giỏ</button>
          <span class="product-stock${product.quantity > 0 ? '' : ' out'}">
            ${product.quantity > 0 ? `Còn hàng: ${product.quantity}` : 'Hết hàng'}
          </span>
        </div>
        <div>
          <div class="product-benefits-title">🎁 Ưu đãi / Khuyến mãi</div>
          <ul class="product-benefits-list">
            <li>Bảo hành 24 tháng</li>
            <li>Miễn phí vận chuyển toàn quốc</li>
          </ul>
        </div>
        <table class="product-spec-table">
          <tr><th>Mã sản phẩm</th><td>${product.product_id || product.id || "SP" + Math.floor(Math.random()*10000)}</td></tr>
          <tr><th>CPU</th><td>${product.cpu || randomSpecValue('cpu')}</td></tr>
          <tr><th>RAM</th><td>${product.ram || randomSpecValue('ram')}</td></tr>
          <tr><th>Ổ cứng</th><td>${product.ssd || randomSpecValue('ssd')}</td></tr>
          <tr><th>VGA</th><td>${product.vga || randomSpecValue('vga')}</td></tr>
          <tr><th>Màn hình</th><td>${product.display || randomSpecValue('display')}</td></tr>
        </table>
      </div>
    `;

    // Dùng lại chung 1 hàm handleBuyNow từ trang chủ
    document.getElementById("btn-add-cart").addEventListener("click", () => handleBuyNow(product));

    document.getElementById("btn-buy-now").addEventListener("click", () => handleBuyNow(product));
  }

  if (productId) {
    fetch(`http://localhost:8080/product/get/${productId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.data) throw new Error('Not found');
        renderProductDetail(data.data);
      })
      .catch(() => {
        document.getElementById('product-detail-container').innerHTML = "<p>Không tìm thấy sản phẩm!</p>";
      });
  } else {
    document.getElementById('product-detail-container').innerHTML = "<p>Không tìm thấy sản phẩm!</p>";
  }
});
