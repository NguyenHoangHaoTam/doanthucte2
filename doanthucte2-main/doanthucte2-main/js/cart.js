document.addEventListener("DOMContentLoaded", function () {
  const cartId = localStorage.getItem('cart_id');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartTotalElem = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!cartItemsContainer || !cartTotalElem || !checkoutBtn) return;

  if (!cartId) {
    cartItemsContainer.innerHTML = '<p>Bạn chưa có sản phẩm nào trong giỏ!</p>';
    cartTotalElem.textContent = '0đ';
    return;
  }

  fetch(`http://localhost:8080/cart/get/${cartId}/my-cart`)
    .then(res => {
      console.log('Response status:', res.status);
      return res.json();
    })
    .then(data => {
      console.log('API Response:', data);

      if (!data || !data.data) {
        cartItemsContainer.innerHTML = '<p>Bạn chưa có sản phẩm nào trong giỏ!</p>';
        cartTotalElem.textContent = '0đ';
        return;
      }

      const cart = data.data || {};
      const cartItems = cart.cartItems || [];

      if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Bạn chưa có sản phẩm nào trong giỏ!</p>';
        cartTotalElem.textContent = '0đ';
        return;
      }

      renderCartItems(cartItems);
      cartTotalElem.textContent = Number(cart.totalAmount || 0).toLocaleString() + 'đ';
    })
    .catch(error => {
      console.error('Error:', error);
      cartItemsContainer.innerHTML = '<p>Lỗi khi tải giỏ hàng!</p>';
    });

  checkoutBtn.addEventListener('click', function () {
    alert("Tính năng thanh toán sẽ được bổ sung!");
    // Tại đây có thể gọi API tạo đơn hàng hoặc điều hướng sang trang thanh toán
  });

  function renderCartItems(cartItems) {
    cartItemsContainer.innerHTML = '';

    cartItems.forEach(item => {
      const product = item.products || {};
      const quantity = item.quantity || 0;
      const unitPrice = item.unitPrice ? Number(item.unitPrice) : 0;
      const totalPrice = item.totalPrice ? Number(item.totalPrice) : 0;

      const div = document.createElement('div');
      div.className = "cart-item";
      div.innerHTML = `
        <img src="http://localhost:8080/product/file/${product.product_image}" 
             alt="${product.product_name || 'Sản phẩm'}" width="80">
        <div>
          <h3>${product.product_name || 'Không có tên'}</h3>
          <p>Giá: ${unitPrice.toLocaleString()}đ</p>
          <label>
              Số lượng: 
              <input type="number" value="${quantity}" min="1" style="width:50px" data-product-id="${product.product_id}">
          </label>
          <span>Thành tiền: <b>${totalPrice.toLocaleString()}đ</b></span>
          <button class="remove-btn" data-product-id="${product.product_id}">Xóa</button>
        </div>
      `;
      cartItemsContainer.appendChild(div);
    });

    // Sự kiện cập nhật số lượng
    cartItemsContainer.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('change', function () {
        const productId = this.getAttribute('data-product-id');
        const quantity = Number(this.value);
        const cartId = localStorage.getItem('cart_id');
        fetch(`http://localhost:8080/cartItem/cart/${cartId}/${productId}/update?quantity=${quantity}`, {
          method: 'PUT'
        })
          .then(() => location.reload());
      });
    });

    // Sự kiện xóa sản phẩm
    cartItemsContainer.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const productId = this.getAttribute('data-product-id');
        const cartId = localStorage.getItem('cart_id');
        fetch(`http://localhost:8080/cartItem/${cartId}/remove/${productId}`, {
          method: 'DELETE'
        })
          .then(() => location.reload());
      });
    });
  }
});
