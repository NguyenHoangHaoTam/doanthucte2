document.addEventListener("DOMContentLoaded", function () {
  const cartId = localStorage.getItem('cart_id');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartTotalElem = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const token = localStorage.getItem("token");

  let latestCartItems = [];

  if (!cartItemsContainer || !cartTotalElem || !checkoutBtn) return;

  if (!cartId) {
    cartItemsContainer.innerHTML = '<p>Bạn chưa có sản phẩm nào trong giỏ!</p>';
    cartTotalElem.textContent = '0đ';
    return;
  }

  refreshCartUI();

  async function refreshCartUI() {
    try {
      const res = await fetch(`http://localhost:8080/cart/get/${cartId}/my-cart`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        localStorage.removeItem('cart_id');
        cartItemsContainer.innerHTML = '<p>Giỏ hàng không tồn tại hoặc đã bị xóa!</p>';
        cartTotalElem.textContent = '0đ';
        latestCartItems = [];
        return;
      }

      const data = await res.json();
      const cart = data.data || {};
      const cartItems = (cart.cartItems || []).sort((a, b) => a.id - b.id);
      latestCartItems = cartItems;

      if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Bạn chưa có sản phẩm nào trong giỏ!</p>';
        cartTotalElem.textContent = '0đ';
        return;
      }

      renderCartItems(cartItems);
      cartTotalElem.textContent = Number(cart.totalAmount || 0).toLocaleString() + 'đ';

    } catch (error) {
      console.error('Lỗi khi làm mới giỏ hàng:', error);
    }
  }

  function renderCartItems(cartItems) {
    cartItemsContainer.innerHTML = '';

    cartItems.forEach(item => {
      const product = item.products || {};
      const quantity = item.quantity || 0;
      const unitPrice = item.unitPrice ? Number(item.unitPrice) : 0;
      const totalPrice = item.totalPrice ? Number(item.totalPrice) : 0;

      const div = document.createElement('div');
      div.className = "styled-cart-item";

      div.innerHTML = `
        <div class="cart-product-thumbnail">
          <img src="http://localhost:8080/product/file/${product.product_image}" alt="${product.product_name || 'Sản phẩm'}">
        </div>
        <div class="cart-product-info">
          <h3 class="cart-product-name">${product.product_name || 'Không có tên'}</h3>
          <div class="cart-product-promotions">
            <ul>
              <li>✔️ Tặng phần mềm bản quyền</li>
              <li>✔️ Bảo hành 24 tháng</li>
            </ul>
          </div>
          <div class="cart-product-bundles">
            <h4>Mua kèm tiết kiệm hơn</h4>
            <ul class="addon-products">
  <li class="addon-item">
    <img src="https://cdn2.cellphones.com.vn/x/media/catalog/product/b/a/balo-laptop-divoom-pixoo-led-backpack-2022-2.jpg" alt="Balo, túi xách">
    <div class="addon-info">
      <span>Mua kèm balo, túi xách</span>
      <span class="discount-tag">Giảm thêm 10%</span>
    </div>
  </li>
  <li class="addon-item">
    <img src="https://cdn2.cellphones.com.vn/x/media/catalog/product/t/e/text_ng_n_5__9_78.png" alt="Màn hình">
    <div class="addon-info">
      <span>Mua kèm màn hình</span>
      <span class="discount-tag">Giảm thêm 5%</span>
    </div>
  </li>
  <li class="addon-item">
    <img src="https://cdn2.cellphones.com.vn/x/media/wysiwyg/Text_ng_n_27_.png" alt="Chuột - bàn phím">
    <div class="addon-info">
      <span>Mua kèm chuột - bàn phím</span>
      <span class="discount-tag">Giảm thêm 5%</span>
    </div>
  </li>
</ul>
          </div>
          <div class="cart-product-actions">
            <label>
              Số lượng:
              <input type="number" value="${quantity}" min="1" style="width:50px" data-product-id="${product.productId}">
            </label>
            <p>Giá: ${unitPrice.toLocaleString()}đ</p>
            <p><b>Thành tiền: ${totalPrice.toLocaleString()}đ</b></p>
            <button class="remove-btn" data-product-id="${product.productId}">🗑 Xóa</button>
          </div>
        </div>
      `;

      cartItemsContainer.appendChild(div);
    });

    cartItemsContainer.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('change', function () {
        const productId = this.getAttribute('data-product-id');
        const quantity = Number(this.value);
        fetch(`http://localhost:8080/cartItem/cart/${cartId}/${productId}/update?quantity=${quantity}`, {
          method: 'PUT'
        }).then(() => refreshCartUI());
      });
    });

    cartItemsContainer.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const productId = this.getAttribute('data-product-id');
        fetch(`http://localhost:8080/cartItem/${cartId}/remove/${productId}`, {
          method: 'DELETE'
        }).then(() => refreshCartUI());
      });
    });
  }

  checkoutBtn.addEventListener('click', async function () {
    const userId = localStorage.getItem('user_id');

    if (!userId || !token) {
      return Swal.fire("Lỗi", "Bạn cần đăng nhập để thanh toán!", "error");
    }

    const validItems = latestCartItems.filter(item => item.quantity > 0);

    if (!validItems || validItems.length === 0) {
      return Swal.fire("Lỗi", "Không có sản phẩm hợp lệ để thanh toán!", "warning");
    }

    const confirm = await Swal.fire({
      title: 'Xác nhận thanh toán',
      text: 'Bạn có chắc chắn muốn thanh toán giỏ hàng này không?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Thanh toán',
      cancelButtonText: 'Hủy'
    });

    if (!confirm.isConfirmed) return;

    try {
      const orderRes = await fetch(`http://localhost:8080/order/create?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.data?.orderId) {
        return Swal.fire("Lỗi", "Không thể tạo đơn hàng!", "error");
      }

      const orderId = orderData.data.orderId;

      const paymentRes = await fetch('http://localhost:8080/payment/fake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ order_id: orderId })
      });

      const paymentData = await paymentRes.json();

      if (paymentRes.ok) {
        Swal.fire("Thành công", "Thanh toán thành công!", "success")
          .then(() => {
            localStorage.removeItem('cart_id');
            updateCartTotal();
            window.location.href = "order-success.html";
          });
      } else {
        Swal.fire("Lỗi", "Thanh toán thất bại!", "error");
      }

    } catch (err) {
      console.error("Lỗi thanh toán:", err);
      Swal.fire("Lỗi", "Có lỗi xảy ra khi thanh toán.", "error");
    }
  });
});
