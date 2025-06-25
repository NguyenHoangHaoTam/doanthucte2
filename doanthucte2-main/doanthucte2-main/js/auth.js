// Đăng nhập
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:8080/login/sign_in?username=' + username + '&password=' + password, {
    method: 'POST'
  });

  const result = await response.json();
   if (result.success) {
    localStorage.setItem("token", result.data.token);
    localStorage.setItem("username", result.data.username);

    window.location.href = "index.html";
  } else {
    alert("Đăng nhập thất bại: " + result.data);
  }
});

// Đăng ký
document.getElementById('registerForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const data = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    role_id: 1,
    fullname: "Test name", 
    address: "Test address",
    gender: "Nam"
  };

  const response = await fetch('http://localhost:8080/login/Sign_up', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  if (result.success) {
    window.location.href = "login.html";
  } else {
    alert("Đăng ký thất bại: " + result.data);
  }
});

// Hàm kiểm tra đăng nhập
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
    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
      logoutLink.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "login.html";
      });
    }
  } else {
    userInfo.innerHTML = `
      <a href="login.html" id="login-link">Đăng nhập</a> /
      <a href="register.html" id="register-link">Đăng ký</a>
    `;
  }
}
window.onload = checkLoginStatus;