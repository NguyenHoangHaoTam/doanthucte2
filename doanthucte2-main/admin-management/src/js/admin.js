document.addEventListener("DOMContentLoaded", function () {
  const adminContent = document.getElementById('admin-content');
  
  // Khởi tạo instance của các class quản lý
  const productManager = new ProductManagement();
  const categoryManager = new CategoryManagement();
  const userManager = new UserManagement();
  const orderManager = new OrderManagement();
   const statisticsManager = new StatisticsManagement();

  // Function để xử lý chuyển tab
  function switchTab(activeTab, callback) {
    document.querySelectorAll('nav a').forEach(tab => {
        tab.classList.remove('active');
    });
    activeTab.classList.add('active');
    callback();
  }

  // Tab quản lý sản phẩm
  document.getElementById('tab-products').onclick = function () {
    switchTab(this, () => {
      productManager.init(adminContent);
    });
  };

  // Tab quản lý danh mục
  document.getElementById('tab-categories').onclick = function () {
    switchTab(this, () => {
      categoryManager.init(adminContent);
    });
  };

  // Tab quản lý người dùng - sử dụng class UserManagement
  document.getElementById('tab-users').onclick = function () {
    switchTab(this, () => {
      userManager.init(adminContent);
    });
  };

  // Tab quản lý đơn hàng - sử dụng class OrderManagement
  document.getElementById('tab-orders').onclick = function () {
    switchTab(this, () => {
      orderManager.init(adminContent);
    });
  };

  document.getElementById('tab-reviews').addEventListener('click', function(e) {
    e.preventDefault();

    document.querySelectorAll('nav a').forEach(tab => {
        tab.classList.remove('active');
    });

    this.classList.add('active');

    showReviewsManagement();
});


document.addEventListener('DOMContentLoaded', function() {

    if (window.location.hash === '#reviews') {
        document.getElementById('tab-reviews').click();
    }
});
  // Tab quản lý đánh giá
  document.getElementById('tab-reviews').addEventListener('click', function(e) {
    e.preventDefault();

    document.querySelectorAll('nav a').forEach(tab => {
        tab.classList.remove('active');
    });

    this.classList.add('active');

    showReviewsManagement();
  });

  document.getElementById('tab-statistics').addEventListener('click', function(e) {
    e.preventDefault();
    
    switchTab(this, () => {
      statisticsManager.init(adminContent);
    });
  });


  // Kiểm tra URL hash khi load trang
  if (window.location.hash === '#reviews') {
    document.getElementById('tab-reviews').click();
  } else if (window.location.hash === '#categories') {
    document.getElementById('tab-categories').click();
  } else if (window.location.hash === '#users') {
    document.getElementById('tab-users').click();
  } else if (window.location.hash === '#orders') {
    document.getElementById('tab-orders').click();
  } else {
    // Mặc định vào tab sản phẩm
    document.getElementById('tab-statistics').click();
  }
});