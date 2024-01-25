document.addEventListener("DOMContentLoaded", function () {
    // Đường dẫn API của bạn
    var apiUrl = "http://localhost:3000";  // Cập nhật đường dẫn phù hợp với server của bạn

    // Hàm để thêm sản phẩm vào giao diện
    function addProductToUI(product) {
        var productList = document.getElementById("product");

        var productItem = document.createElement("tr");
        productItem.innerHTML = `
            <td><input class="form-check-input" type="checkbox"></td>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.cate_id}</td>
            <td>${product.price}</td>
            <td><img style="width: 100px;" src="../cake-main/img/shop/${product.image}" alt="" srcset=""></td>
            <td><a class="btn btn-sm btn-primary" href="">sửa</a>  <a class="btn btn-sm btn-primary" href="">xóa</a></td>
        `;

        productList.appendChild(productItem);
    }
    function addorderToUI(order_details) {
        var order_detailsList = document.getElementById("order_detail");

        var order_detailsItem = document.createElement("tr");
        order_detailsItem.innerHTML = `
            <td><input class="form-check-input" type="checkbox"></td>
            <td>${order_details.order_id}</td>
            <td>${order_details.product_id}</td>
            <td>${order_details.quantity}</td>
            <td>${order_details.unit_price}</td>
            
            <td><a class="btn btn-sm btn-primary" href="">sửa</a>  <a class="btn btn-sm btn-primary" href="">xóa</a></td>
        `;

        order_detailsList.appendChild(order_detailsItem);
    }
    // Hàm để thêm danh mục vào giao diện
    function addcategoriesToUI(categories) {
        var categoriesList = document.getElementById("categories"); // Correct variable name

        var categoriesItem = document.createElement("tr");
        categoriesItem.innerHTML = `
            <td><input class="form-check-input" type="checkbox"></td>
            <td>${categories.id}</td>
            <td>${categories.name}</td>
            <td><a class="btn btn-sm btn-primary" href="">sửa</a>  <a class="btn btn-sm btn-primary" href="">xóa</a></td>
        `;

        categoriesList.appendChild(categoriesItem);
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

    // Gọi API để lấy danh sách danh mục
    fetch(`${apiUrl}/categories`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(categories => {
        
        categories.forEach(categories => {
            addcategoriesToUI(categories); 
        });
    })
    .catch(error => {
        console.error("Lỗi khi tải dữ liệu từ API (categories):", error);
    });
    fetch(`${apiUrl}/order_details`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(order_details => {
        // Hiển thị từng đơn hàng lên giao diện
        order_details.forEach(order_details => {
            addorderToUI(order_details);
        });
    })
    .catch(error => {
        console.error("Lỗi khi tải dữ liệu từ API (orders):", error);
    });
});
