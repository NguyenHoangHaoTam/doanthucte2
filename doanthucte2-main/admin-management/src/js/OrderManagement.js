
class OrderManagement {
  constructor() {
    this.allOrders = [];
  }

  init(container) {
    container.innerHTML = `
      <div class="container">
        <div class="header">
            <h2>Quản lý đơn hàng</h2>
        </div>
        <div class="content">
            <div class="search-section">
                <div class="search-controls">
                    <input type="text" id="search-order-input" placeholder="Tìm theo tên người dùng hoặc ID đơn hàng..." />
                    <button id="search-order-btn" class="btn">Tìm kiếm</button>
                    <button id="reset-order-btn" class="btn">Làm mới</button>
                </div>
            </div>
            <div id='order-table-wrap' class="table-container">
                <div class="loading">Đang tải đơn hàng...</div>
            </div>
        </div>
    </div>
    `;

    this.loadOrders();
    this.bindEvents();
  }

  loadOrders() {
    fetch("http://localhost:8080/order/get")
      .then(res => res.json())
      .then(data => {
        this.allOrders = Array.isArray(data) ? data : data.data;
        this.renderOrders(this.allOrders);
      })
      .catch(error => {
        console.error('Error loading orders:', error);
        document.getElementById('order-table-wrap').innerHTML = "<p style='color:red'>Không thể tải đơn hàng!</p>";
      });
  }

  renderOrders(orders) {
    const html = `
        <table border="1" cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;">
          <thead style="background-color: #343a40; color: white;">
            <tr><th>ID Đơn</th><th>ID Người dùng</th><th>Ngày đặt</th><th>Tổng tiền</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td>${o.orderId}</td>
                <td>${o.username}</td>
                <td>${o.orderTime || ""}</td>
                <td>${o.totalAmount?.toLocaleString("vi-VN")}đ</td>
                <td>${o.status}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
      document.getElementById('order-table-wrap').innerHTML = html;
    
    this.bindOrderEvents();
  }

  bindOrderEvents() {
    // Bind status change events
    document.querySelectorAll('.status-select').forEach(select => {
      select.onchange = (e) => {
        const orderId = e.target.getAttribute('data-order-id');
        const newStatus = e.target.value;
        this.updateOrderStatus(orderId, newStatus);
      };
    });

    // Bind view order events
    document.querySelectorAll('.btn-view-order').forEach(btn => {
      btn.onclick = (e) => {
        const orderId = e.target.getAttribute('data-id');
        this.viewOrderDetails(orderId);
      };
    });

    // Bind delete order events
    document.querySelectorAll('.btn-delete-order').forEach(btn => {
      btn.onclick = (e) => {
        const orderId = e.target.getAttribute('data-id');
        this.deleteOrder(orderId);
      };
    });
  }

  viewOrderDetails(orderId) {
    fetch(`http://localhost:8080/order/${orderId}/details`)
      .then(res => res.json())
      .then(data => {
        this.showOrderDetailsModal(data);
      })
      .catch(error => {
        console.error('Error loading order details:', error);
        alert('Không thể tải chi tiết đơn hàng!');
      });
  }

  searchOrders() {
    const keyword = document.getElementById('search-order-input').value.trim().toLowerCase();

    
    let filtered = this.allOrders;
    
    // Filter by keyword
    if (keyword) {
      filtered = filtered.filter(o =>
        o.username?.toLowerCase().includes(keyword) ||
        String(o.orderId).includes(keyword)
      );
    }
    
    // Filter by status
   
    
    this.renderOrders(filtered);
  }

  resetSearch() {
    document.getElementById('search-order-input').value = "";
    this.renderOrders(this.allOrders);
  }

  bindEvents() {
    // Search button event
    document.getElementById('search-order-btn').onclick = () => {
      this.searchOrders();
    };

    // Reset button event
    document.getElementById('reset-order-btn').onclick = () => {
      this.resetSearch();
    };


    // Enter key search
    document.getElementById('search-order-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.searchOrders();
      }
    });
  }
}
