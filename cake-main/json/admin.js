document.addEventListener("DOMContentLoaded", function () {
    // Đường dẫn API của bạn
    var apiUrl = "http://localhost:3000";  // Cập nhật đường dẫn phù hợp với server của bạn



    // Hàm để thêm sản phẩm vào giao diện
    function addProductToUI(product) {
        let productList = document.getElementById("product");

        let productItem = document.createElement("tr");
        productItem.innerHTML = `
            <td><input class="form-check-input" type="checkbox"></td>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.cate_id}</td>
            <td>$${product.price}</td>
            <td><img style="width: 100px;" src="/ASM/cake-main/img/shop/${product.image}" alt="" srcset=""></td>
            <td>${product.detail}</td>
            <td>
                <a class="btn btn-sm btn-primary editProductButton" data-id="${product.id}" href="#">Sửa</a>  
                <button data-id="${product.id}" class="btn btn-sm btn-danger deleteProductButton">Xóa</button>
            </td>
        `;

        productList.appendChild(productItem);

        // Attach event listener to the edit button
        let editButton = productItem.querySelector('.editProductButton');
        editButton.addEventListener('click', function (event) {
            event.preventDefault();
            editProduct(product.id);
        });

        // Attach event listener to the delete button
        let deleteButton = productItem.querySelector('.deleteProductButton');
        deleteButton.addEventListener('click', function (event) {
            event.preventDefault();
            deleteProduct(product.id);
        });
    }

    axios.get(`${apiUrl}/products`)
        .then(response => {
            // Hiển thị từng sản phẩm lên giao diện
            response.data.forEach(product => {
                addProductToUI(product);
            });
        })
        .catch(error => {
            console.error("Lỗi khi tải dữ liệu từ API (products):", error);
        });

    function addProduct() {
        const productName = document.getElementById("productName").value;
        const categoryId = document.getElementById("categoryId").value;
        const productPrice = parseFloat(document.getElementById("productPrice").value); // Chuyển giá thành số
        const productImage = document.getElementById("productImage");
        const nameFile = productImage.files[0].name;

        const productDescription = document.getElementById("productDescription").value;

        // Create a new product object
        const newProduct = {
            name: productName,
            cate_id: categoryId,
            price: productPrice,
            image: nameFile,
            detail: productDescription // Add the description property
            // Add other properties as needed
        };

        // Send a POST request to add the new product to the server
        axios.post(`${apiUrl}/products`, newProduct)
            .then(response => {
                // Assuming the response contains the added product details
                const addedProduct = response.data;

                // Add the newly created product to the user interface
                addProductToUI(addedProduct);

                // Log a success message
                console.log("Product added successfully:", addedProduct);
            })
            .catch(error => {
                // Log an error message if the addition of the product fails
                console.error("Error while adding the product:", error);

                // Display an error message to the user (you can implement this part as needed)
                alert("Error while adding the product. Please try again.");
            });
    }

    // Attach the addProduct function to a button or form submit event
    const addProductButton = document.getElementById("addProductButton");
    addProductButton.addEventListener("click", addProduct);

    function editProduct(id) {
        // Gửi yêu cầu GET đến API để lấy thông tin sản phẩm cần sửa
        axios.get(`${apiUrl}/products/${id}`)
            .then(response => {
                // Xử lý thông tin sản phẩm và chuyển hướng đến trang sửa sản phẩm
                let editedProduct = response.data;
                window.location.href = `./edit_SP.html?id=${editedProduct.id}`;
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Đã xảy ra lỗi khi lấy thông tin sản phẩm. Vui lòng thử lại!");
            });
    }

    let urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');

    // Kiểm tra xem có ID trong đường dẫn không
    if (productId) {
        // Nếu có ID, thực hiện hàm để lấy thông tin sản phẩm
        showProductInfo(productId);
    }

    // Hàm để lấy thông tin sản phẩm từ API và hiển thị ra form
    function showProductInfo(id) {
        axios.get(`${apiUrl}/products/${id}`)
            .then(response => {
                let product = response.data;
                // Hiển thị thông tin sản phẩm ra form
                populateForm(product);
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Đã xảy ra lỗi khi lấy thông tin sản phẩm. Vui lòng thử lại!");
            });
    };

    // Hàm để điền thông tin sản phẩm vào form
    function populateForm(product) {
        let idInput = document.getElementById('productId');
        let nameInput = document.getElementById('productName');
        let categoryIdInput = document.getElementById('productCategoryId');
        let priceInput = document.getElementById('productPrice');
        let imageInput = document.getElementById('productImage');
        let previewImage = document.getElementById('previewImage'); // Thêm thẻ img để hiển thị hình ảnh
        let imageNameDisplay = document.getElementById('imageNameDisplay'); // Thêm thẻ để hiển thị tên hình ảnh
        let detailsInput = document.getElementById('ProductDescription');
        // Điền thông tin sản phẩm vào các trường trong form
        idInput.value = product.id;
        nameInput.value = product.name;
        categoryIdInput.value = product.cate_id;
        priceInput.value = product.price;
        detailsInput.value = product.detail;

        // Hiển thị hình ảnh từ đường dẫn
        if (product.image) {
            previewImage.src = `/ASM/cake-main/img/shop/${product.image}`;
        }

        // Hiển thị tên hình ảnh nếu có
        if (product.image) {
            imageNameDisplay.textContent = `Selected Image: ${product.image}`;
        } else {
            imageNameDisplay.textContent = 'No image selected';
        }

        // Tuỳ chọn: cập nhật thuộc tính action của form nếu cần thiết
        // document.getElementById('editProductForm').action = `${apiUrl}/products/${product.id}`;

        // Tạo sự kiện change cho trường input file
        imageInput.addEventListener('change', function () {
            let file = imageInput.files[0];

            // Hiển thị hình ảnh được chọn trong thẻ img
            previewImage.src = URL.createObjectURL(file);

            // Hiển thị tên hình ảnh
            imageNameDisplay.textContent = `Selected Image: ${file.name}`;
        });
    }

    function updateProduct(id, updatedProduct) {
        axios.put(`${apiUrl}/products/${id}`, updatedProduct)
            .then(response => {
                alert("Thông tin sản phẩm đã được cập nhật thành công!");
                // (Tùy chọn) Chuyển hướng về trang danh sách sản phẩm sau khi cập nhật
                window.location.href = "./listSP.html";
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Đã xảy ra lỗi khi cập nhật thông tin sản phẩm. Vui lòng thử lại!");
            });
    }

    // Sự kiện click cho nút "Update Product"
    const updateProductButton = document.getElementById('updateProductButton');
    updateProductButton.addEventListener('click', function () {
        // Lấy thông tin mới từ form
        const updatedProduct = {
            name: document.getElementById('productName').value,
            cate_id: document.getElementById('productCategoryId').value,
            price: document.getElementById('productPrice').value,
            image: document.getElementById('productImage').files[0].name, // Lấy tên hình ảnh
            detail: document.getElementById('ProductDescription').value,
        };

        // Lấy ID sản phẩm từ form
        const productId = document.getElementById('productId').value;

        updateProduct(productId, updatedProduct);
    });

    function deleteProduct(id) {
        // Xác nhận việc xóa sản phẩm
        let confirmDelete = confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");

        // Nếu người dùng đồng ý xóa
        if (confirmDelete) {
            // Gửi yêu cầu DELETE đến API để xóa sản phẩm với id tương ứng
            axios.delete(`${apiUrl}/products/${id}`)
                .then(response => {
                    // Kiểm tra xem yêu cầu xóa thành công hay không
                    if (response.status === 200) {
                        // Xóa sản phẩm khỏi giao diện
                        let productItem = document.querySelector(`[data-id="${id}"]`).closest('tr');
                        productItem.remove();
                        alert("Xóa sản phẩm thành công!");
                    } else {
                        // Xử lý lỗi nếu có
                        alert("Xóa sản phẩm không thành công. Vui lòng thử lại!");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("Đã xảy ra lỗi khi xóa sản phẩm. Vui lòng kiểm tra lại kết nối!");
                });
        }
    }



function addCategoryToUI(category) {
        var categoriesList = document.getElementById("categories");

        var categoryItem = document.createElement("tr");
        categoryItem.innerHTML = `
            <td><input class="form-check-input" type="checkbox"></td>
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td><a class="btn btn-sm btn-primary" href="">sửa</a>  
            <a class="btn btn-sm btn-primary deleteCateButton" data-id="${category.id} href="">xóa</a></td>
        `;

        categoriesList.appendChild(categoryItem);
    }

    axios.get(`${apiUrl}/categories`)
        .then(response => {
            // Hiển thị từng danh mục lên giao diện
            response.data.forEach(category => {
                addCategoryToUI(category);
            });
        })
        .catch(error => {
            console.error("Lỗi khi tải dữ liệu từ API (categories):", error);
        });


    

    function addorderToUI(order_details) {
        var order_detailsList = document.getElementById("order_detail");

        var order_detailsItem = document.createElement("tr");
        order_detailsItem.innerHTML = `
            <td><input class="form-check-input" type="checkbox"></td>
            <td>${order_details.order_id}</td>
            <td>${order_details.product_id}</td>
            <td>${order_details.quantity}</td>
            <td>${order_details.unit_price}</td>
            
            <td><a class="btn btn-sm btn-primary" href="">sửa</a>  <a class="btn btn-sm btn-primary"  href="">xóa</a></td>
        `;

        order_detailsList.appendChild(order_detailsItem);
    }

    // Hàm để thêm danh mục vào giao diện





    // Gọi API để lấy danh sách danh mục






    axios.get(`${apiUrl}/order_details`)
        .then(response => {
            // Hiển thị từng đơn hàng lên giao diện
            response.data.forEach(order_details => {
                addorderToUI(order_details);
            });
        })
        .catch(error => {
            console.error("Lỗi khi tải dữ liệu từ API (order_details):", error);
        });


    //Chức năng thêm sản phẩm


    // Chức năng xóa sản phẩm


});





