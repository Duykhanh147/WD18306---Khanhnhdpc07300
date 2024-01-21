document.addEventListener("DOMContentLoaded", function () {
    // Đường dẫn API của bạn
    var apiUrl = "http://localhost:3000";  // Cập nhật đường dẫn phù hợp với server của bạn

    // Hàm để thêm sản phẩm vào giao diện
    function addProductToUI(product,categories) {
        var productList = document.getElementById("product");

        var productItem = document.createElement("div");
        productItem.className = "col-lg-3 col-md-6 col-sm-6";
        productItem.innerHTML = `
            <div class="product__item">
                <div class="product__item__pic set-bg" >
                <img src="./img/shop/${product.image}" alt="">
                    <div class="product__label">
                        <span>${product.cate_id}</span>
                    </div>
                </div>
                <div class="product__item__text">
                    <h6><a href="#">${product.name}</a></h6>
                    <div class="product__item__price">$${product.price}</div>
                    <div class="cart_add">
                        <a href="#">Add to cart</a>
                    </div>
                </div>
            </div>
        `;

        productList.appendChild(productItem);
    }
    
    // Gọi API để lấy danh sách sản phẩm bằng Fetch API
    fetch(`${apiUrl}/products`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            // Hiển thị từng sản phẩm lên giao diện
            products.forEach(product => {
                addProductToUI(product);
            });
        })
        .catch(error => {
            console.error("Lỗi khi tải dữ liệu từ API (products):", error);
        });
        axios.get(`${apiUrl}/categories`)
        .then(response => {
            var categories = response.data;

            // Hiển thị danh sách danh mục lên giao diện và thêm vào slider
            categories.forEach(category => {
                addCategoryToSlider(category);
            });
        })
        .catch(error => {
            console.error("Lỗi khi tải dữ liệu từ API (categories):", error);
        });
});
