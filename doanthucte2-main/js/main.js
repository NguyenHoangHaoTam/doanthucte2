let allProducts = [];
//chuyển động của slide
let currentSlide = 0;
const slides = [
  './anh/anh1.jpg',
  './anh/anh3.jpg',
  './anh/anh4.jpg'
];
const slideImage = document.getElementById('slide');
function showSlide(index) {
  if (!slideImage) return;
  slideImage.style.opacity = 0;
  setTimeout(() => {
    currentSlide = (index + slides.length) % slides.length;
    slideImage.src = slides[currentSlide];
    slideImage.style.opacity = 1; 
  }, 300);
}
function nextSlide() {
  showSlide(currentSlide + 1);
}
function prevSlide() {
  showSlide(currentSlide - 1);
}
if (slideImage) {
  setInterval(() => {
    nextSlide();
  }, 4000);
}

//logo điện thoại
const callButton = document.querySelector('.call-button');
if (callButton) {
  window.addEventListener('scroll', () => {
    let scrollTop = window.scrollY;
    let windowHeight = window.innerHeight;
    callButton.style.top = (scrollTop + windowHeight - 100) + 'px';
  });
}

// cập nhật tổng tiền giỏ hàng trên icon
function updateCartTotal() {
  const cartIcon = document.querySelector('.cart span');
  if (!cartIcon) return;
  let cartId = localStorage.getItem('cart_id');
  if (!cartId) {
    cartIcon.textContent = "0đ";
    return;
  }
  fetch(`http://localhost:8080/cart/${cartId}/cart/total-price`)
    .then(res => {
      if (!res.ok) {
        // Nếu cart không tồn tại, xóa cart_id và reset giao diện icon giỏ hàng
        localStorage.removeItem('cart_id');
        cartIcon.textContent = "0đ";
        throw new Error("Giỏ hàng không tồn tại hoặc đã bị xóa!");
      }
      return res.json();
    })
    .then(data => {
      const total = data.data || 0;
      cartIcon.textContent = total.toLocaleString() + 'đ';
    })
    .catch(() => {
      cartIcon.textContent = "0đ";
    });
}

// Thêm vào giỏ hàng
function handleBuyNow(product) {
  console.log("Clicked Buy Now", product);

  const productId = product.product_id || product.productId;
  localStorage.setItem("productId",productId);
  if (!product || !productId) {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Sản phẩm không hợp lệ!",
    });
    return;
  }

  if (product.quantity <= 0) {
    Swal.fire({
      icon: "warning",
      title: "Hết hàng",
      text: "❌ Sản phẩm đã hết hàng!",
    });
    return;
  }

  let userId = localStorage.getItem("user_id");
  let cartId = localStorage.getItem("cart_id");
  const quantity = 1;

  if (!userId && !cartId) {
    Swal.fire({
      icon: "info",
      title: "Thông báo",
      text: "Bạn cần đăng nhập để mua hàng!",
    });
    return;
  }

  let url = `http://localhost:8080/cartItem/add?product_id=${productId}&quantity=${quantity}`;
  if (cartId) {
    url += `&cart_id=${cartId}`;
  } else if (userId) {
    url += `&user_id=${userId}`;
  }

  console.log("📦 Gửi yêu cầu đến:", url);

  fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log("✅ Phản hồi từ server:", data);
      if (data.data && typeof data.data === "number") {
        localStorage.setItem('cart_id', data.data);
      }
      updateCartTotal?.();

      // Thông báo kèm lựa chọn
      Swal.fire({
        icon: "success",
        title: "Thêm vào giỏ hàng thành công!",
        text: "Bạn muốn đến giỏ hàng để thanh toán ngay, hay tiếp tục mua sắm?",
        showCancelButton: true,
        confirmButtonText: "🛒 Đến giỏ hàng",
        cancelButtonText: "🛍️ Tiếp tục mua",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "cart.html";
        } else {
          console.log("Tiếp tục mua sắm");
        }
      });
    })
    .catch(err => {
      Swal.fire({
        icon: "error",
        title: "Thất bại",
        text: "❌ Thêm vào giỏ hàng thất bại!",
      });
      console.error(err);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchProducts();
  updateCartTotal();
});

//sản phẩm nổi bật 
function renderFeaturedProducts(products) {
  const featured = products.slice(4, 8);

  const featuredList = document.querySelector(".featured-products-list");
  if (!featuredList) return;
  featuredList.innerHTML = "";

  const benefits = [
    "Tặng balo cao cấp",
    "Giảm thêm 5% khi thanh toán online",
    "Bảo hành 2 năm",
    "Miễn phí vận chuyển",
    "Tặng phần mềm bản quyền"
  ];

  featured.forEach((product, index) => {
  const discountPercent = Math.floor(Math.random()*25 + 5);
  const featuredCard = document.createElement("div");
  featuredCard.className = "featured-product-card";
  featuredCard.style.animationDelay = `${index * 0.1}s`;

  const randomBenefits = [...benefits]
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  featuredCard.innerHTML = `
    <div class="vip-tag">BEST SELLER</div>
    <div class="discount-badge">-${discountPercent}%</div>
    <img src="http://localhost:8080/product/file/${product.product_image}" alt="${product.product_name}">
    <h3>${product.product_name}</h3>
    <div class="price-container">
      <span class="old-price">${(product.price * 1.15).toLocaleString()}đ</span>
      <span class="new-price">${product.price.toLocaleString()}đ</span>
      <span class="price-save">Tiết kiệm ${Math.round(product.price * 0.15).toLocaleString()}đ</span>
    </div>
    <ul class="benefits">
      ${randomBenefits.map(benefit => `<li>${benefit}</li>`).join("")}
    </ul>
    <button class="buy-button">
      <span>Mua ngay</span>
      <span>→</span>
    </button>
  `;

  // ✅ Khi click card → chuyển đến trang chi tiết (trừ nút mua)
  featuredCard.addEventListener('click', function (e) {
    if (e.target.closest('.buy-button')) return;
    window.location.href = `product-detail.html?id=${product.product_id}`;
  });

  // ✅ Click "Mua ngay"
  featuredCard.querySelector('.buy-button').addEventListener('click', function (e) {
    e.stopPropagation(); // Không cho sự kiện lan ra ngoài
    handleBuyNow(product);
  });

  featuredList.appendChild(featuredCard);
});
}

//sản phẩm all
function fetchProducts() {
  fetch("http://localhost:8080/product/get") 
    .then(response => response.json())
    .then(data => {
      const products = Array.isArray(data) ? data : data.data;

      const activeProducts = products.filter(p => 
        !p.deleted || p.deleted === 0 || p.deleted === "0" || p.deleted === false
      );
      
      allProducts = activeProducts; 
      renderProducts(activeProducts);
      renderFeaturedProducts(activeProducts);
    })
    .catch(error => {
      const productList = document.querySelector(".product-list");
      if (productList) {
        productList.innerHTML = "<p>Lỗi khi tải sản phẩm!</p>";
      }
      console.error("Error fetching products:", error);
    });
}

let currentPage = 1;
const pageSize = 8;

function renderProducts(products) {
  const productList = document.querySelector(".product-list");
  if (!productList) return;

  // Tính sản phẩm cần hiển thị theo trang
  const start = 0;
  const end = currentPage * pageSize;
  const visibleProducts = products.slice(0, end);

  productList.innerHTML = ""; 

  visibleProducts.forEach((product, index) => {
  const productCard = document.createElement("div");
  productCard.className = "product-card";
  productCard.style.cursor = "pointer";
  productCard.style.opacity = "0"; 
  productCard.style.animationDelay = `${index * 0.05}s`; 
  
  productCard.innerHTML = `
    <div class="discount-badge">SALE</div>
    <img src="http://localhost:8080/product/file/${product.product_image}" alt="${product.product_name}">
    <h3>${product.product_name}</h3>
    <p class="product-description">${product.description}</p>
    <p class="old-price">${(product.price * 1.1).toLocaleString()}đ</p>
    <p class="new-price">${product.price.toLocaleString()}đ</p>
    <button class="buy-button"><span>Mua ngay</span><span>→</span></button>
  `;

  // Sự kiện click sản phẩm và mua
  productCard.addEventListener('click', function(event) {
    if (event.target.closest('.buy-button')) return;
    window.location.href = `product-detail.html?id=${product.product_id}`;
  });

  productCard.querySelector('.buy-button').addEventListener('click', function(e) {
    e.stopPropagation();
    handleBuyNow(product);
  });

  productList.appendChild(productCard);

  // Hiển thị từ từ (mượt)
  setTimeout(() => {
    productCard.style.opacity = "1";
  }, 50);
});

  // Thêm nút "Xem thêm" nếu còn sản phẩm chưa hiển thị
  const loadMoreContainer = document.querySelector('.load-more-container') || document.createElement('div');
  loadMoreContainer.className = 'load-more-container';
  loadMoreContainer.innerHTML = "";

  if (products.length > visibleProducts.length) {
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.textContent = "Xem thêm";
    loadMoreBtn.className = "load-more-button";
    loadMoreBtn.onclick = () => {
      currentPage++;
      renderProducts(products); 
    };
    loadMoreContainer.appendChild(loadMoreBtn);
  }

  // Gắn vào sau danh sách sản phẩm
  if (!document.querySelector('.load-more-container')) {
    productList.parentElement.appendChild(loadMoreContainer);
  }
}

//xem sản phẩm theo hãng
document.addEventListener("DOMContentLoaded", function () {
  fetchProducts();
  updateCartTotal();

  document.querySelectorAll('.brand-logos-container a[data-category-id]').forEach(logo => {
    logo.addEventListener('click', function(e) {
      e.preventDefault();
      const categoryId = this.getAttribute('data-category-id');
      if (!categoryId) return;

      fetch(`http://localhost:8080/category/get/${categoryId}`)
        .then(res => res.json())
        .then(data => {
          const category = data.data;
          if (category.productsList && Array.isArray(category.productsList)) {

            const activeProducts = category.productsList.filter(p => 
              !p.deleted || p.deleted === 0 || p.deleted === "0" || p.deleted === false
            );
            
            allProducts = activeProducts; 
            renderProducts(activeProducts);
          } else {
            const productList = document.querySelector('.product-list');
            if (productList) productList.innerHTML = '<p>Không có sản phẩm nào!</p>';
          }
        })
        .catch(() => {
          const productList = document.querySelector('.product-list');
          if (productList) productList.innerHTML = '<p>Lỗi khi tải sản phẩm!</p>';
        });
    });
  });
});

// Xử lý tìm kiếm
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector('.search-bar input');
  const searchButton = document.querySelector('.search-bar button');
  if (!searchInput || !searchButton) return;

  function handleSearch() {
    const keyword = searchInput.value.trim().toLowerCase();
    if (!keyword) {
      renderProducts(allProducts); 
      return;
    }
    const filtered = allProducts.filter(product =>
      product.product_name.toLowerCase().includes(keyword) ||
      (product.description && product.description.toLowerCase().includes(keyword))
    );
    renderProducts(filtered);

     document.querySelector('section.product-list')?.scrollIntoView({ behavior: 'smooth' });
  }

  
  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleSearch();
  });
});
