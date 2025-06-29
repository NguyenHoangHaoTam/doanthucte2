const API_BASE_URL = 'http://localhost:8080';

// Hiển thị trang quản lý đánh giá
function showReviewsManagement() {
    const content = `
        <div class="reviews-management">
            <div class="page-header">
                <h2>Quản lý đánh giá</h2>
                <div class="header-actions">
                    <div class="search-box">
                        <input type="text" id="review-search" placeholder="Tìm kiếm theo tên sản phẩm, khách hàng...">
                        <button onclick="searchReviews()">Tìm kiếm</button>
                    </div>
                    <button onclick="refreshReviews()" class="btn-refresh">Làm mới</button>
                </div>
            </div>

            <div class="reviews-stats">
                <div class="stat-card">
                    <h3>Tổng đánh giá</h3>
                    <span id="total-reviews">0</span>
                </div>
                <div class="stat-card">
                    <h3>Đánh giá mới</h3>
                    <span id="new-reviews">0</span>
                </div>
                <div class="stat-card">
                    <h3>Trung bình rating</h3>
                    <span id="avg-rating">0</span>
                </div>
            </div>

            <div class="reviews-table-container">
                <table class="reviews-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Sản phẩm</th>
                            <th>Khách hàng</th>
                            <th>Nội dung</th>
                            <th>Ngày đánh giá</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="reviews-table-body">
                        <!-- Dữ liệu sẽ được load ở đây -->
                    </tbody>
                </table>
            </div>

            <div class="loading" id="reviews-loading" style="display: none;">
                <p>Đang tải dữ liệu...</p>
            </div>
        </div>

        <!-- Modal xem chi tiết đánh giá -->
        <div id="review-detail-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Chi tiết đánh giá</h3>
                    <span class="close" onclick="closeReviewDetailModal()">&times;</span>
                </div>
                <div class="modal-body" id="review-detail-content">
                    <!-- Nội dung chi tiết sẽ được load ở đây -->
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('admin-content').innerHTML = content;
    loadAllReviews();
}

// Hàm helper để tạo fetch request với CORS headers
function createFetchRequest(url, options = {}) {
    const defaultOptions = {
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        }
    };
    
    return fetch(url, { ...defaultOptions, ...options });
}

// Load tất cả đánh giá
async function loadAllReviews() {
    try {
        showLoading(true);
        const response = await createFetchRequest(`${API_BASE_URL}/review/get/all`);
        
        if (!response.ok) {
            throw new Error('Không thể tải dữ liệu đánh giá');
        }
        
        const reviews = await response.json();
        console.log('Reviews data:', reviews);
        
        displayReviews(reviews);
        updateReviewsStats(reviews);
        
    } catch (error) {
        console.error('Lỗi khi tải đánh giá:', error);
        showError('Không thể tải danh sách đánh giá: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Hiển thị danh sách đánh giá
function displayReviews(reviews) {
    const tbody = document.getElementById('reviews-table-body');
    
    if (!reviews || reviews.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">Không có đánh giá nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = reviews.map(review => `
        <tr>
            <td>${review.id}</td>
            <td>
                <div class="product-info">
                    <strong>ID: ${review.productId}</strong>
                </div>
            </td>
            <td>
                <div class="customer-info">
                    <strong>ID: ${review.userName}</strong>
                </div>
            </td>
            <td>
                <div class="review-comment">
                    ${review.comment.length > 100 ? 
                        review.comment.substring(0, 100) + '...' : 
                        review.comment}
                </div>
            </td>
            <td>${formatDate(review.reviewDate)}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="viewReviewDetail(${review.id})" class="btn-view">
                        Xem chi tiết
                    </button>
                    
                </div>
            </td>
        </tr>
    `).join('');
}
// Cập nhật thống kê đánh giá
function updateReviewsStats(reviews) {
    const totalReviews = reviews.length;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const newReviews = reviews.filter(review => {
        const reviewDate = new Date(review.reviewDate);
        return reviewDate >= sevenDaysAgo;
    }).length;
    document.getElementById('total-reviews').textContent = totalReviews;
    document.getElementById('new-reviews').textContent = newReviews;
}

// Xem chi tiết đánh giá
async function viewReviewDetail(reviewId) {
    try {
        const response = await createFetchRequest(`${API_BASE_URL}/review/get/all`);
        const reviews = await response.json();
        const review = reviews.find(r => r.id === reviewId);
        if (!review) {
            showError('Không tìm thấy đánh giá');
            return;
        }
        let productName = `Sản phẩm ID: ${review.productId}`;
        let userName = `User ID: ${review.userName}`;
        
        try {
            const productResponse = await createFetchRequest(`${API_BASE_URL}/product/get/${review.productId}`);
            if (productResponse.ok) {
                const productData = await productResponse.json();
                productName = productData.productName || productName;
            }
        } catch (error) {
            console.log('Không thể lấy thông tin sản phẩm:', error);
        }
        
        try {
            const userResponse = await createFetchRequest(`${API_BASE_URL}/user/get/${review.userName}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                }
            });
            if (userResponse.ok) {
                const userData = await userResponse.json();
                userName = userData.fullName || userData.username || userName;
            }
        } catch (error) {
            console.log('Không thể lấy thông tin user:', error);
        }
        
        const detailContent = `
            <div class="review-detail">
                <div class="review-info">
                    <h4>Thông tin đánh giá</h4>
                    <p><strong>ID:</strong> ${review.id}</p>
                    <p><strong>Ngày đánh giá:</strong> ${formatDate(review.reviewDate)}</p>
                </div>
                
                <div class="product-info">
                    <h4>Sản phẩm</h4>
                    <p><strong>ID:</strong> ${review.productId}</p>
                    <p><strong>Tên:</strong> ${productName}</p>
                </div>
                
                <div class="customer-info">
                    <h4>Khách hàng</h4>
                    <p><strong>ID:</strong> ${review.userName}</p>
                    <p><strong>Tên:</strong> ${userName}</p>
                </div>
                
                <div class="review-content">
                    <h4>Nội dung đánh giá</h4>
                    <div class="comment-box">
                        ${review.comment}
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button onclick="closeReviewDetailModal()" class="btn-secondary">Đóng</button>
                </div>
            </div>
        `;
        
        document.getElementById('review-detail-content').innerHTML = detailContent;
        document.getElementById('review-detail-modal').style.display = 'block';
        
    } catch (error) {
        console.error('Lỗi khi xem chi tiết:', error);
        showError('Không thể tải chi tiết đánh giá');
    }
}
// Tìm kiếm đánh giá
function searchReviews() {
    const searchTerm = document.getElementById('review-search').value.toLowerCase();
    const rows = document.querySelectorAll('#reviews-table-body tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}
// Hiệu ứng
function refreshReviews() {
    document.getElementById('review-search').value = '';
    loadAllReviews();
}
function closeReviewDetailModal() {
    document.getElementById('review-detail-modal').style.display = 'none';
}

function showLoading(show) {
    const loading = document.getElementById('reviews-loading');
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
}

function showError(message) {
    alert('Lỗi: ' + message);
}

function showSuccess(message) {
    alert('Thành công: ' + message);
}

window.onclick = function(event) {
    const modal = document.getElementById('review-detail-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}