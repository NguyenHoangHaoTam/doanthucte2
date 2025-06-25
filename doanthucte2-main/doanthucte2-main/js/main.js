let allProducts = [];
//chuyen dong cua silde
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

//logo dien thoaithoai
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
    .then(res => res.json())
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
  let cartId = localStorage.getItem('cart_id');
  const quantity = 1; // mặc định là 1, có thể thay đổi theo nhu cầu
  let url = `http://localhost:8080/cartItem/add?product_id=${product.product_id}&quantity=${quantity}`;
  if (cartId) url += `&cart_id=${cartId}`;
  fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      //"Authorization": "Bearer " + localStorage.getItem("token")
    }
  })
    .then(res => res.json())
    .then(data => {
      // Nếu backend trả về cart_id mới, lưu lại
      if (data.data && typeof data.data === "number") {
        localStorage.setItem('cart_id', data.data);
      }
      alert('Đã thêm vào giỏ hàng!');
      updateCartTotal();
    })
    .catch(err => {
      alert('Thêm vào giỏ hàng thất bại!');
      console.error(err);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchProducts();
  updateCartTotal();
});

//sản phẩm nổi bật 
function renderFeaturedProducts(products) {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  const featured = shuffled.slice(0, 4);

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
    // Thêm sự kiện cho nút mua ngay
    featuredCard.querySelector('.buy-button').addEventListener('click', function() {
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
      allProducts = products;
      renderProducts(products);
      renderFeaturedProducts(products);
    })
    .catch(error => {
      const productList = document.querySelector(".product-list");
      if (productList) {
        productList.innerHTML = "<p>Lỗi khi tải sản phẩm!</p>";
      }
      console.error("Error fetching products:", error);
    });
}

function renderProducts(products) {
  const productList = document.querySelector(".product-list");
  if (!productList) return;
  productList.innerHTML = "";
  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.style.cursor = "pointer";
    productCard.innerHTML = `
      <div class="discount-badge">SALE</div>
      <img src="http://localhost:8080/product/file/${product.product_image}" alt="${product.product_name}">
      <h3>${product.product_name}</h3>
      <p class="product-description">${product.description}</p>
      <p class="old-price">${(product.price * 1.1).toLocaleString()}đ</p>
      <p class="new-price">${product.price.toLocaleString()}đ</p>
      <button class="buy-button">
        <span>Mua ngay</span>
        <span>→</span>
      </button>
    `;

    // Sự kiện chuyển sang trang chi tiết khi click vào card (trừ nút mua ngay)
    productCard.addEventListener('click', function(event) {
      // Nếu bấm vào nút mua ngay thì không chuyển trang chi tiết
      if (event.target.closest('.buy-button')) return;
      window.location.href = `product-detail.html?id=${product.product_id}`;
    });

    // Sự kiện cho nút mua ngay
    productCard.querySelector('.buy-button').addEventListener('click', function(e) {
      e.stopPropagation(); // Ngăn không chuyển trang khi bấm mua ngay
      handleBuyNow(product);
    });

    productList.appendChild(productCard);
  });
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
            renderProducts(category.productsList);
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
  }

  searchButton.addEventListener('click', handleSearch);
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleSearch();
  });
});
