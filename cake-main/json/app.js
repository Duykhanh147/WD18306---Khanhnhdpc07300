document.addEventListener("DOMContentLoaded", function () {
    // Đường dẫn API của bạn
    var apiUrl = "http://localhost:3000";  // Cập nhật đường dẫn phù hợp với server của bạn

    
    // Hàm để thêm sản phẩm vào giao diện
    function addProductToUI(product) {
        var productList = document.getElementById("product");
    
        var productItem = document.createElement("div");
        productItem.className = "col-lg-3 col-md-6 col-sm-6";
        productItem.innerHTML = `
            <div class="product__item">
                <div class="product__item__pic set-bg">
                    <img src="./img/shop/${product.image}" alt="">
                    <div class="product__label">
                        <span>${product.cate_id}</span>
                    </div>
                </div>
                <div class="product__item__text">
                    <h6><a href="#">${product.name}</a></h6>
                    <div class="product__item__price">$${product.price}</div>
                    <div class="cart_add">
                        <button class="addToCartButton" data-product-id="${product.id}">Thêm vào giỏ hàng</button>
                    </div>
                </div>
            </div>
        `;
    
        productList.appendChild(productItem);
        
        let addToCartButtons = document.querySelectorAll(".addToCartButton");
        
        addToCartButtons.forEach(button => {
            button.addEventListener("click", function() {
                let productId = parseInt(button.getAttribute("data-product-id"));
                addToCart(productId);
            });
        });
    }
    
    
        
    
    

    function addToCart(id) {
        // Kiểm tra giỏ hàng trong Local Storage
        var cart = localStorage.getItem('cart');
        var cartItems = cart ? JSON.parse(cart) : [];
        
        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        var existingItemIndex = cartItems.findIndex(item => item.id === id);
        
        if (existingItemIndex !== -1) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng lên 1
            cartItems[existingItemIndex].quantity;
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
            cartItems.push({ id: id, quantity: 1 });
        }
        
        // Lưu giỏ hàng vào Local Storage
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        // Thêm thông báo hoặc hành động khác sau khi thêm sản phẩm vào giỏ hàng
        // alert('Sản phẩm đã được thêm vào giỏ hàng!');
    }
    function displayCartItems() {
        // Lấy dữ liệu giỏ hàng từ Local Storage
        var cart = localStorage.getItem('cart');
        var cartItems = cart ? JSON.parse(cart) : [];
    
        // Lấy thẻ tbody của bảng
        var tbody = document.querySelector('#cartTable tbody');
    
        // Xóa dữ liệu hiện tại trong tbody
        tbody.innerHTML = '';
    
        // Điền dữ liệu vào bảng
        cartItems.forEach(item => {
            var row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.quantity}</td>
            `;
            tbody.appendChild(row);
        });
        
    }
    
        

 
   Promise.all([
    axios.get(`${apiUrl}/products`),
    axios.get(`${apiUrl}/categories`)
])
.then(responses => {
    // responses là một mảng chứa kết quả của từng yêu cầu
    const productsResponse = responses[0];
    const categoriesResponse = responses[1];

    // Lấy dữ liệu từ các yêu cầu và gán vào biến
    const products = productsResponse.data;
    const categories = categoriesResponse.data;

    // Nối dữ liệu sản phẩm với danh mục
    products.forEach(product => {
        const category = categories.find(category => category.id === product.categoryId);
        product.category = category; // Thêm trường category vào mỗi sản phẩm
    });

    // Hiển thị dữ liệu đã nối lên giao diện
    products.forEach(product => {
        addProductToUI(product);
    });
})
.catch(error => {
    console.error("Lỗi khi tải dữ liệu từ API:", error);
});


// Lọc sản Phẩm theo danh mục

        
    
        // Lấy phần tử form và select từ DOM
        const categoryForm = document.getElementById('categoryForm');
        const categorySelect = document.getElementById('categorySelect');

        categorySelect.style.display = 'inline-block';

    
        // Gửi yêu cầu GET để lấy danh sách các danh mục
        axios.get(`${apiUrl}/categories`)
            .then(response => {
                // Hiển thị danh sách các danh mục trong select
                response.data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error("Lỗi khi tải dữ liệu danh mục:", error);
            });
    
// Lọc theo Giá
        
categoryForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của form

    const categoryId = categorySelect.value; // Lấy ID của danh mục được chọn từ select
    const minPrice = document.getElementById('minPrice').value; 
    const maxPrice = document.getElementById('maxPrice').value; 

    if (minPrice === "" || maxPrice === "") {
        // Nếu không nhập giá, chỉ gửi yêu cầu để lấy sản phẩm theo ID danh mục
        axios.get(`${apiUrl}/products?cate_id=${categoryId}`)
            .then(response => {
                const productsInCategory = response.data;
                console.log(`Sản phẩm trong danh mục có ID "${categoryId}":`, productsInCategory);

                // Xóa tất cả sản phẩm hiện có trước khi hiển thị sản phẩm mới
                document.getElementById("product").innerHTML = "";

                // Hiển thị dữ liệu sản phẩm lấy được lên giao diện
                productsInCategory.forEach(product => {
                    addProductToUI(product);
                });
            })
            .catch(error => {
                console.error(`Lỗi khi tải dữ liệu sản phẩm cho danh mục có ID "${categoryId}":`, error);
            });
    } else {
        // Nếu nhập giá, gửi yêu cầu để lấy sản phẩm theo ID danh mục và giá sản phẩm
        axios.get(`${apiUrl}/products?cate_id=${categoryId}&price_gte=${minPrice}&price_lte=${maxPrice}`)
            .then(response => {
                const productsInCategory = response.data;
                console.log(`Sản phẩm trong danh mục có ID "${categoryId}" và giá từ ${minPrice} đến ${maxPrice}:`, productsInCategory);

               
                document.getElementById("product").innerHTML = "";

                
                productsInCategory.forEach(product => {
                    addProductToUI(product);
                });
            })
            .catch(error => {
                console.error(`Lỗi khi tải dữ liệu sản phẩm cho danh mục có ID "${categoryId}" và giá từ ${minPrice} đến ${maxPrice}:`, error);
            });
    }
    
});




function addorderToUI(order) {
    var orderList = document.getElementById("order");

    var orderItem = document.createElement("tr");
    orderItem.innerHTML = `
        <td><input class="form-check-input" type="checkbox"></td>
        <td>${order.created_date}</td>
        <td>${order.id}</td>
        <td>${order.cus_name}</td>
        <td>${order.phone_number}</td>
        <td>${order.status}</td>
        <td><a class="btn btn-sm btn-primary" href="">xóa</a></td>
    `;

    orderList.appendChild(orderItem);
}


// Gọi API để lấy danh sách sản phẩm bằng Fetch API

axios.get(`${apiUrl}/orders`)
  .then(response => {
    // Kiểm tra trạng thái của response
    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Xử lý dữ liệu JSON được trả về
    return response.data;
  })
  .then(orders => {
    // Hiển thị từng đơn hàng lên giao diện
    orders.forEach(order => {
      addorderToUI(order);
    });
  })
  .catch(error => {
    console.error("Lỗi khi tải dữ liệu từ API (orders):", error);
  });

});



