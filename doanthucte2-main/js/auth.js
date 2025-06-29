// ====================== ĐĂNG NHẬP ======================
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`http://localhost:8080/login/sign_in?username=${username}&password=${password}`, {
      method: 'POST'
    });

    const result = await response.json();
    
    


    if (result.success) {
      const token = result.data.token;
      const username = result.data.username;
      const userId = result.data.userId;
      const is_deleted = result.data.is_deleted;
    if(is_deleted==true){
      Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại',
        text: 'Tài Khoản của bạn đã vô hiệu.'
      });
      return;
    }

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("user_id", userId);
      


      // 🔄 Lấy cart_id trước khi chuyển trang
      try {
        const cartRes = await fetch(`http://localhost:8080/cart/user/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (cartRes.ok) {
          const cartData = await cartRes.json();
          if (cartData.data?.id) {
            localStorage.setItem("cart_id", cartData.data.id);
            updateCartTotal?.();
          }
        }
      } catch (cartErr) {
        console.warn("Không thể lấy cart_id sau đăng nhập:", cartErr);
      }

      // ✅ Hiển thị thông báo trước khi chuyển
      Swal.fire({
        icon: 'success',
        title: 'Đăng nhập thành công!',
        text: 'Chào mừng bạn quay lại!',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "index.html";
      });

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Đăng nhập thất bại',
        text: result.data || 'Sai tài khoản hoặc mật khẩu.'
      });
    }
  } catch (err) {
    console.error("Lỗi khi gửi yêu cầu đăng nhập:", err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi máy chủ',
      text: 'Vui lòng thử lại sau.'
    });
  }
});

// ====================== ĐĂNG KÝ ======================
document.getElementById('registerForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (username.length < 6 || /\s/.test(username)) {
    Swal.fire('Lỗi!', 'Username phải từ 6 ký tự và không chứa khoảng trắng.', 'warning');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Swal.fire('Lỗi!', 'Email không hợp lệ.', 'warning');
    return;
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/;
  if (!passwordRegex.test(password)) {
    Swal.fire('Lỗi!', 'Mật khẩu phải 8–16 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt.', 'warning');
    return;
  }

  if (password !== confirmPassword) {
    Swal.fire('Lỗi!', 'Mật khẩu xác nhận không khớp.', 'warning');
    return;
  }

  const data = {
    username,
    email,
    password,
    role_id: 1,
    fullname: "Test name",
    address: "Test address",
    gender: "Nam"
  };

  try {
    const response = await fetch('http://localhost:8080/login/Sign_up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Đăng ký thành công!',
        text: 'Bạn sẽ được chuyển sang trang đăng nhập.',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "login.html";
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Đăng ký thất bại!',
        text: result.data || 'Vui lòng thử lại sau.'
      });
    }
  } catch (err) {
    console.error("Lỗi khi gửi yêu cầu đăng ký:", err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi máy chủ',
      text: 'Vui lòng thử lại sau.'
    });
  }
});

// ====================== CHECK LOGIN + LOGOUT ======================
function checkLoginStatus() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  const userInfo = document.getElementById("user-info");
  if (!userInfo) return;

  if (token && username) {
    userInfo.innerHTML = `
      <span>👋 Xin chào, <strong>${username}</strong></span>
      | <a href="#" id="logout-link">Đăng xuất</a>
    `;

    document.getElementById("logout-link")?.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.clear();
      window.location.replace("login.html");
    });
  } else {
    userInfo.innerHTML = `
      <a href="login.html" id="login-link">Đăng nhập</a> /
      <a href="register.html" id="register-link">Đăng ký</a>
    `;
  }
}

// ====================== TỰ LẤY LẠI CART_ID NẾU CÓ ======================
document.addEventListener("DOMContentLoaded", async function () {
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const cartId = localStorage.getItem("cart_id");

  if (userId && token && !cartId) {
    try {
      const res = await fetch(`http://localhost:8080/cart/user/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        const result = await res.json();
        if (result.data?.id) {
          localStorage.setItem("cart_id", result.data.id);
          updateCartTotal?.();
        }
      }
    } catch (e) {
      console.warn("Không thể lấy lại cart_id:", e);
    }
  }
});

// ====================== WINDOW ONLOAD ======================
window.onload = checkLoginStatus;
