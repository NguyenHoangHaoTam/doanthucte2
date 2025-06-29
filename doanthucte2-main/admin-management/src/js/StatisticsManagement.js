class StatisticsManagement {
  constructor() {
    this.data = {
      users: [],
      orders: [],
      reviews: [],
      categories: []
    };
  }

  async init(container) {
    container.innerHTML = `
      <div class="statistics-container">
        <h2>Thống kê tổng quan</h2>
        
        <!-- Loading indicator -->
        <div id="stats-loading" class="loading-indicator">
          <p>Đang tải dữ liệu thống kê...</p>
        </div>

        <!-- Statistics content -->
        <div id="stats-content" style="display: none;">
          <!-- Overview Cards -->
          <div class="stats-overview">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <h3>Tổng người dùng</h3>
                <span class="stat-number" id="total-users">0</span>
                <span class="stat-change" id="users-change">+0 tuần này</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🛒</div>
              <div class="stat-info">
                <h3>Tổng đơn hàng</h3>
                <span class="stat-number" id="total-orders">0</span>
                <span class="stat-change" id="orders-change">+0 tuần này</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-info">
                <h3>Doanh thu</h3>
                <span class="stat-number" id="total-revenue">0đ</span>
                <span class="stat-change" id="revenue-change">+0đ tuần này</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-info">
                <h3>Đánh giá</h3>
                <span class="stat-number" id="total-reviews">0</span>
                <span class="stat-change" id="reviews-change">+0 tuần này</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">📂</div>
              <div class="stat-info">
                <h3>Danh mục</h3>
                <span class="stat-number" id="total-categories">0</span>
                <span class="stat-change" id="categories-change">Tổng danh mục</span>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="charts-section">
            <div class="chart-container">
              <h3>Biểu đồ doanh thu theo thời gian</h3>
              <div id="revenue-chart" class="chart-placeholder">
                <canvas id="revenueCanvas" width="400" height="200"></canvas>
              </div>
            </div>
            
            <div class="chart-container">
              <h3>Biểu đồ đơn hàng theo thời gian</h3>
              <div id="orders-chart" class="chart-placeholder">
                <canvas id="ordersCanvas" width="400" height="200"></canvas>
              </div>
            </div>
          </div>

          <!-- Detailed Statistics -->
          <div class="detailed-stats">
            <h3>Thống kê chi tiết</h3>
            
            <div class="stats-grid">
              <div class="stats-section">
                <h4>Người dùng</h4>
                <div class="stats-list">
                  <div class="stats-item">
                    <span>Người dùng thường:</span>
                    <span id="regular-users">0</span>
                  </div>
                  <div class="stats-item">
                    <span>Quản trị viên:</span>
                    <span id="admin-users">0</span>
                  </div>
                  <div class="stats-item">
                    <span>Đăng ký trong tháng:</span>
                    <span id="monthly-registrations">0</span>
                  </div>
                </div>
              </div>
              
              <div class="stats-section">
                <h4>Đơn hàng</h4>
                <div class="stats-list">
                  <div class="stats-item">
                    <span>Đơn hàng hôm nay:</span>
                    <span id="today-orders">0</span>
                  </div>
                  <div class="stats-item">
                    <span>Đơn hàng trong tuần:</span>
                    <span id="week-orders">0</span>
                  </div>
                  <div class="stats-item">
                    <span>Đơn hàng trong tháng:</span>
                    <span id="month-orders">0</span>
                  </div>
                  <div class="stats-item">
                    <span>Giá trị đơn hàng TB:</span>
                    <span id="avg-order-value">0đ</span>
                  </div>
                </div>
              </div>
              
              <div class="stats-section">
                <h4>Đánh giá</h4>
                <div class="stats-list">
                  <div class="stats-item">
                    <span>Đánh giá hôm nay:</span>
                    <span id="today-reviews">0</span>
                  </div>
                  <div class="stats-item">
                    <span>Đánh giá trong tuần:</span>
                    <span id="week-reviews">0</span>
                  </div>
                  <div class="stats-item">
                    <span>Đánh giá trong tháng:</span>
                    <span id="month-reviews">0</span>
                  </div>
                </div>
              </div>
              
              <div class="stats-section">
                <h4>Top khách hàng</h4>
                <div class="stats-list" id="top-customers">
                  <div class="stats-item">Đang tải...</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Refresh Button -->
          <div class="refresh-section">
            <button id="refresh-stats" class="btn-refresh">🔄 Làm mới thống kê</button>
            <span class="last-updated">Cập nhật lần cuối: <span id="last-updated-time">-</span></span>
          </div>
        </div>

        <!-- Error message -->
        <div id="stats-error" style="display: none;" class="error-message">
          <p>Có lỗi xảy ra khi tải dữ liệu thống kê. Vui lòng thử lại sau.</p>
          <button onclick="this.parentElement.parentElement.querySelector('.statistics-container h2 + *').click()">Thử lại</button>
        </div>
      </div>

      <style>
        .statistics-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .loading-indicator {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        /* CSS cho Statistics Header - Thống kê tổng quan */

.statistics-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.statistics-container h2 {
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

.statistics-container h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
}

.statistics-container h2::before {
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
    .statistics-container {
        padding: 10px;
        margin: 10px;
    }

    .statistics-container h2 {
        font-size: 2rem;
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 16px;
    }
}

@media (max-width: 480px) {
    .statistics-container {
        padding: 5px;
        margin: 5px;
    }

    .statistics-container h2 {
        font-size: 1.8rem;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 12px;
    }
}
        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          font-size: 2.5em;
          margin-right: 15px;
        }

        .stat-info h3 {
          margin: 0 0 5px 0;
          font-size: 0.9em;
          opacity: 0.9;
        }

        .stat-number {
          font-size: 1.8em;
          font-weight: bold;
          display: block;
          margin-bottom: 5px;
        }

        .stat-change {
          font-size: 0.8em;
          opacity: 0.8;
        }

        .charts-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }

        .chart-container {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .chart-container h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #333;
        }

        .chart-placeholder {
          min-height: 200px;
          border: 2px dashed #ddd;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }

        .detailed-stats {
          background: white;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }

        .detailed-stats h3 {
          margin-top: 0;
          margin-bottom: 20px;
          color: #333;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
        }

        .stats-section h4 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #555;
          border-bottom: 2px solid #eee;
          padding-bottom: 8px;
        }

        .stats-list {
          space-y: 8px;
        }

        .stats-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .stats-item:last-child {
          border-bottom: none;
        }

        .stats-item span:first-child {
          color: #666;
        }

        .stats-item span:last-child {
          font-weight: bold;
          color: #333;
        }

        .refresh-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .btn-refresh {
          background: #28a745;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-refresh:hover {
          background: #218838;
        }

        .last-updated {
          color: #666;
          font-size: 0.9em;
        }

        .error-message {
          text-align: center;
          padding: 40px;
          color: #dc3545;
          background: #f8d7da;
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .charts-section {
            grid-template-columns: 1fr;
          }
          
          .stats-overview {
            grid-template-columns: 1fr;
          }
          
          .refresh-section {
            flex-direction: column;
            gap: 10px;
          }
        }
      </style>
    `;

    await this.loadAllData();
    this.bindEvents();
  }
  async loadAllData() {
    try {
      document.getElementById('stats-loading').style.display = 'block';
      document.getElementById('stats-content').style.display = 'none';
      document.getElementById('stats-error').style.display = 'none';

      const [usersData, ordersData, reviewsData, categoriesData] = await Promise.allSettled([
        this.fetchUsers(),
        this.fetchOrders(),
        this.fetchReviews(),
        this.fetchCategories()
      ]);
      this.data.users = usersData.status === 'fulfilled' ? usersData.value : [];
      this.data.orders = ordersData.status === 'fulfilled' ? ordersData.value : [];
      this.data.reviews = reviewsData.status === 'fulfilled' ? reviewsData.value : [];
      this.data.categories = categoriesData.status === 'fulfilled' ? categoriesData.value : [];
      this.calculateAndDisplayStats();
      this.drawCharts();
      document.getElementById('stats-loading').style.display = 'none';
      document.getElementById('stats-content').style.display = 'block';
      document.getElementById('last-updated-time').textContent = new Date().toLocaleString('vi-VN');
    } catch (error) {
      console.error('Error loading statistics data:', error);
      document.getElementById('stats-loading').style.display = 'none';
      document.getElementById('stats-error').style.display = 'block';
    }
  }
  async fetchUsers() {
    const response = await fetch("http://localhost:8080/user/get", {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
      }
    });
    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  }
  async fetchOrders() {
    const response = await fetch("http://localhost:8080/order/get");
    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  }
  async fetchReviews() {
    const response = await fetch("http://localhost:8080/review/get/all");
    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  }
  async fetchCategories() {
    const response = await fetch("http://localhost:8080/category/get");
    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  }
  calculateAndDisplayStats() {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalUsers = this.data.users.length;
    const regularUsers = this.data.users.filter(u => u.role_id === 1).length;
    const adminUsers = this.data.users.filter(u => u.role_id === 2).length;
    const monthlyRegistrations = this.data.users.filter(u => {
      const created = new Date(u.created_Dated);
      return created >= monthAgo;
    }).length;
    const weeklyUsers = this.data.users.filter(u => {
      const created = new Date(u.created_Dated);
      return created >= weekAgo;
    }).length;

    const totalOrders = this.data.orders.length;
    const totalRevenue = this.data.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const todayOrders = this.data.orders.filter(o => {
      const orderDate = new Date(o.orderTime);
      return orderDate >= today;
    }).length;
    
    const weekOrders = this.data.orders.filter(o => {
      const orderDate = new Date(o.orderTime);
      return orderDate >= weekAgo;
    }).length;
    
    const monthOrders = this.data.orders.filter(o => {
      const orderDate = new Date(o.orderTime);
      return orderDate >= monthAgo;
    }).length;

    const weeklyRevenue = this.data.orders.filter(o => {
      const orderDate = new Date(o.orderTime);
      return orderDate >= weekAgo;
    }).reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const totalReviews = this.data.reviews.length;
    const todayReviews = this.data.reviews.filter(r => {
      const reviewDate = new Date(r.reviewDate);
      return reviewDate >= today;
    }).length;
    
    const weekReviews = this.data.reviews.filter(r => {
      const reviewDate = new Date(r.reviewDate);
      return reviewDate >= weekAgo;
    }).length;
    
    const monthReviews = this.data.reviews.filter(r => {
      const reviewDate = new Date(r.reviewDate);
      return reviewDate >= monthAgo;
    }).length;

    const totalCategories = this.data.categories.length;

    document.getElementById('total-users').textContent = totalUsers.toLocaleString('vi-VN');
    document.getElementById('users-change').textContent = `+${weeklyUsers} tuần này`;
    document.getElementById('total-orders').textContent = totalOrders.toLocaleString('vi-VN');
    document.getElementById('orders-change').textContent = `+${weekOrders} tuần này`;
    document.getElementById('total-revenue').textContent = totalRevenue.toLocaleString('vi-VN') + 'đ';
    document.getElementById('revenue-change').textContent = `+${weeklyRevenue.toLocaleString('vi-VN')}đ tuần này`;
    document.getElementById('total-reviews').textContent = totalReviews.toLocaleString('vi-VN');
    document.getElementById('reviews-change').textContent = `+${weekReviews} tuần này`;
    document.getElementById('total-categories').textContent = totalCategories.toLocaleString('vi-VN');
    document.getElementById('regular-users').textContent = regularUsers.toLocaleString('vi-VN');
    document.getElementById('admin-users').textContent = adminUsers.toLocaleString('vi-VN');
    document.getElementById('monthly-registrations').textContent = monthlyRegistrations.toLocaleString('vi-VN');
    document.getElementById('today-orders').textContent = todayOrders.toLocaleString('vi-VN');
    document.getElementById('week-orders').textContent = weekOrders.toLocaleString('vi-VN');
    document.getElementById('month-orders').textContent = monthOrders.toLocaleString('vi-VN');
    document.getElementById('avg-order-value').textContent = avgOrderValue.toLocaleString('vi-VN') + 'đ';
    document.getElementById('today-reviews').textContent = todayReviews.toLocaleString('vi-VN');
    document.getElementById('week-reviews').textContent = weekReviews.toLocaleString('vi-VN');
    document.getElementById('month-reviews').textContent = monthReviews.toLocaleString('vi-VN');

    this.updateTopCustomers();
  }

  updateTopCustomers() {
    const customerStats = {};
    this.data.orders.forEach(order => {
      if (!customerStats[order.username]) {
        customerStats[order.username] = {
          totalSpent: 0,
          orderCount: 0
        };
      }
      customerStats[order.username].totalSpent += order.totalAmount || 0;
      customerStats[order.username].orderCount += 1;
    });

    const topCustomers = Object.entries(customerStats)
      .sort(([,a], [,b]) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    const topCustomersHtml = topCustomers.length > 0 ? 
      topCustomers.map(([username, stats]) => `
        <div class="stats-item">
          <span>${username}</span>
          <span>${stats.totalSpent.toLocaleString('vi-VN')}đ</span>
        </div>
      `).join('') : 
      '<div class="stats-item"><span>Chưa có dữ liệu</span><span>-</span></div>';

    document.getElementById('top-customers').innerHTML = topCustomersHtml;
  }

  drawCharts() {
    this.drawRevenueChart();
    this.drawOrdersChart();
  }

  drawRevenueChart() {
    const canvas = document.getElementById('revenueCanvas');
    const ctx = canvas.getContext('2d');
    
    const data = this.prepareChartData(this.data.orders, 'totalAmount', 7);
    
    this.drawLineChart(ctx, data, '#28a745', 'Doanh thu (VNĐ)');
  }

  drawOrdersChart() {
    const canvas = document.getElementById('ordersCanvas');
    const ctx = canvas.getContext('2d');
    
    const data = this.prepareChartData(this.data.orders, 'count', 7);
    
    this.drawLineChart(ctx, data, '#007bff', 'Số đơn hàng');
  }

  prepareChartData(orders, type, days) {
    const now = new Date();
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.orderTime);
        return orderDate.toDateString() === date.toDateString();
      });
      
      let value;
      if (type === 'totalAmount') {
        value = dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      } else {
        value = dayOrders.length;
      }
      
      data.push({
        label: date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
        value: value
      });
    }
    
    return data;
  }

  drawLineChart(ctx, data, color, yAxisLabel) {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    ctx.clearRect(0, 0, width, height);
    
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.font = '12px Arial';
    
    if (data.length === 0) {
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      ctx.fillText('Không có dữ liệu', width / 2, height / 2);
      return;
    }
    
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const valueRange = maxValue - minValue || 1;
    
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = padding + (chartWidth * index) / (data.length - 1);
      const y = height - padding - ((point.value - minValue) / valueRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      ctx.fillText(point.label, x, height - padding + 15);
      
      ctx.fillText(point.value.toLocaleString('vi-VN'), x, y - 10);
    });
    
    ctx.stroke();
  }

  bindEvents() {
    document.getElementById('refresh-stats').addEventListener('click', () => {
      this.loadAllData();
    });
  }
}