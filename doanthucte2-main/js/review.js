document.addEventListener("DOMContentLoaded", function () {
      const productId = new URLSearchParams(window.location.search).get("id");
      const userName = localStorage.getItem("username");
      const userId = localStorage.getItem("user_id")
      const API_BASE = 'http://localhost:8080/review';
      
      let currentReviews = [];

      // Utility functions
      function formatDate(dateString) {
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            
          });
        } catch (e) {
          return 'Vừa xong';
        }
      }

      function getUserAvatar(userName) {
        return `U${userName}`;
      }

      function showMessage(message, type = 'error') {
        const messagesDiv = document.getElementById('form-messages');
        messagesDiv.innerHTML = `
          <div class="${type === 'success' ? 'success-message' : 'error-message'}">
            ${message}
          </div>
        `;
        
        setTimeout(() => {
          messagesDiv.innerHTML = '';
        }, 5000);
      }

      // Fetch và hiển thị reviews
      async function loadReviews() {
        if (!productId) return;

        try {
          const response = await fetch(`${API_BASE}/get/${productId}`);
          
          if (!response.ok) {
            throw new Error('Không thể tải đánh giá');
          }

          const reviews = await response.json();
          currentReviews = Array.isArray(reviews) ? reviews : [];
          renderReviews();
          updateReviewCount();
          
        } catch (error) {
          console.error('Error loading reviews:', error);
          document.getElementById('reviews-container').innerHTML = `
            <div class="error-message">
              Không thể tải đánh giá. Vui lòng thử lại sau!
            </div>
          `;
        }
      }

      // Render danh sách reviews
      function renderReviews() {
        const container = document.getElementById('reviews-container');
        
        if (currentReviews.length === 0) {
          container.innerHTML = `
            <div class="no-reviews">
              <div style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;">💭</div>
              <p>Chưa có đánh giá nào cho sản phẩm này.</p>
              <p>Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!</p>
            </div>
          `;
          return;
        }

        const reviewsHTML = currentReviews
          .sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate))
          .map(review => `
            <div class="review-item">
              <div class="review-header-info">
                <div class="user-avatar">
                  ${getUserAvatar(review.userName)}
                </div>
                <div class="review-meta">
                  <p class="reviewer-name"> #${review.userName}</p>
                  <p class="review-date">${formatDate(review.reviewDate)}</p>
                </div>
              </div>
              <p class="review-content">${review.comment}</p>
            </div>
          `).join('');

        container.innerHTML = `<div class="reviews-list">${reviewsHTML}</div>`;
      }

      // Cập nhật số lượng reviews
      function updateReviewCount() {
        const countElement = document.getElementById('review-count');
        const count = currentReviews.length;
        countElement.textContent = count === 0 
          ? 'Chưa có đánh giá nào' 
          : `${count} đánh giá`;
      }

      // Submit review mới
      async function submitReview(reviewText) {
        if (!userName) {
          showMessage('Vui lòng đăng nhập để viết đánh giá!');
          return false;
        }

        if (!reviewText.trim()) {
          showMessage('Vui lòng nhập nội dung đánh giá!');
          return false;
        }

        try {
          const formData = new FormData();
          formData.append('productId', productId);
          formData.append('userId', userId);
          formData.append('reviewText', reviewText.trim());

          const response = await fetch(`${API_BASE}/create`, {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error('Không thể gửi đánh giá');
          }

          const result = await response.json();
          showMessage('Đánh giá của bạn đã được gửi thành công! 🎉', 'success');
          
          // Reload reviews để hiển thị review mới
          setTimeout(() => {
            loadReviews();
          }, 1000);
          
          return true;
        } catch (error) {
          console.error('Error submitting review:', error);
          showMessage('Không thể gửi đánh giá. Vui lòng thử lại!');
          return false;
        }
      }

      // Event listeners
      document.getElementById('submit-review-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const textarea = document.getElementById('review-text');
        const submitBtn = document.getElementById('submit-review-btn');
        const reviewText = textarea.value.trim();
        
        if (!reviewText) {
          showMessage('Vui lòng nhập nội dung đánh giá!');
          return;
        }

        // Disable form during submission
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span>⏳</span>
          <span>Đang gửi...</span>
        `;

        const success = await submitReview(reviewText);
        
        if (success) {
          textarea.value = '';
        }

        // Re-enable form
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>📝</span>
          <span>Gửi đánh giá</span>
        `;
      });

      // Kiểm tra trạng thái đăng nhập
      function checkLoginStatus() {
        const reviewForm = document.getElementById('review-form');
        
        if (!userName) {
          reviewForm.innerHTML = `
            <div style="background: #f8f9fa; padding: 30px; text-align: center; border-radius: 10px; border: 1px solid #e9ecef;">
              <h3 style="color: #666; margin-bottom: 15px;">🔐 Đăng nhập để viết đánh giá</h3>
              <p style="color: #888; margin-bottom: 20px;">Bạn cần đăng nhập để có thể chia sẻ đánh giá về sản phẩm này.</p>
              <a href="login.html" style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; display: inline-block; font-weight: 600;">
                Đăng nhập ngay
              </a>
            </div>
          `;
        }
      }

      // Initialize
      if (productId) {
        loadReviews();
        checkLoginStatus();
      }
    });