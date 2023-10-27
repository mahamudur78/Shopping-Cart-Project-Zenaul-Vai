const productList = [];
const cartItem = [];

const allProductList = document.querySelector('.product-list');
const cartItemList = document.querySelector('.cart-item-list');
const cartTotalItem = document.querySelector('#cart-total-item');
const cartTotalPrice = document.querySelector('#cart-total-price');
const totalCartItemSection = document.querySelector('#total-cart-item-section');

function displayProduct(productList){

    allProductList.innerHTML = productList.map((value) => {
        return `
        <li class="list-group-item list-group-item-action d-inline-flex justify-content-between align-items-center">
            <div class="d-inline-flex">
                <div class="p-2 product-img">
                    <img src="/assets/photo3.jpg" alt="" srcset="">  
                </div>
                <div>
                    <h5>${value.productName} (${value.stock})</h5>
                    <p>${value.price}TK</p>
                </div>
            </div>
            <div class="d-inline-flex align-items-center">
                <button type="button" class="p-1" data-bs-toggle="modal" data-bs-target="#editProductModal" onclick="editProduct('${value._id}')">✏️</button>
                <button type="button" class="p-1 m-2" onclick="deleteProduct('${value._id}')">❌</button> 
                <button type="button" class="item-plus btn btn-success" onclick="itemOrder('${value._id}')">Add to Cart</button>
            </div>
            
        </li>`;
    }).join('');

    cartItemList.innerHTML =  cartItem.map((value, index) => {
        return `
            <div class="list-group">
                <li class="list-group-item mt-1 list-group-item-action d-inline-flex justify-content-between align-items-center">
                    <div>
                        <h6>${value.itemName}</h6>
                    </div>
                    <div>
                        <button class="cart-minus cursorPointer" onclick="cartMinus(${index}, '${value._id}')">➖</button>
                            <span class="m-2">${value.cartTotal}</span>
                        <button class="cart-plus cursorPointer" onclick="cartPlus(${index}, '${value._id}')">➕</button>
                    </div>
                </li>
            </div>
        `;
    }).join('');

    let cartTotal = 0;
    let totalPrice = 0;
    if(cartItem.length !== 0){
        totalCartItemSection.classList.add('mt-3');

        cartTotal = cartItem.reduce((total, value) => total += value.cartTotal, 0);
        totalPrice = cartItem.reduce((total, value) => total += value.price * value.cartTotal, 0);
    }else{
        totalCartItemSection.classList.remove('mt-3');
    }

    cartTotalItem.innerHTML = cartTotal;
    cartTotalPrice.innerHTML = `${totalPrice.toLocaleString()} Tk`;
}

const productSearch = document.querySelector("#product-search");
function itemOrder(productID){
    let cartItemCount = cartItem.length;

    let findItem = cartItem.find(item => item._id === productID);
    let productIndex = productList.findIndex(item => item._id === productID);
    if(cartItemCount != 0 && findItem ){
        
        const cartIndex = cartItem.findIndex(item => item._id === productID);
        checkProductStock(productIndex, () => {cartItem[cartIndex].cartTotal++});
        
        
    }else{
        const checkStock = checkProductStock(productIndex, () => {});
        if(checkStock){
            cartItem[cartItemCount] = { 
                _id: productList[productIndex]._id,
                itemName: productList[productIndex].productName,
                price: productList[productIndex].price,
                cartTotal: 1,
            };
        }
        
        
    }

    if(productSearch.value){
        itemSearch(productSearch);
    }else{
        displayProduct(productList);
    }
    
}

function cartMinus(index, productID){
    const productIndex = productList.findIndex(item => item._id === productID);

    returnProduct(productIndex, () =>{
        if(cartItem[index].cartTotal > 1){
            cartItem[index].cartTotal--;
            
        }else{
            cartItem.splice(index, 1);
        }
    });

    if(productSearch.value){
        itemSearch(productSearch);
    }else{
        displayProduct(productList);
    }
}

function cartPlus(index, productID){

    const productIndex = productList.findIndex(item => item._id === productID);
    checkProductStock(productIndex, () => cartItem[index].cartTotal++);

    if(productSearch.value){
        itemSearch(productSearch);
    }else{
        displayProduct(productList);
    }
}


function checkProductStock(index, cb){
    
    if(productList[index].stock > 0){
        productList[index].stock--;
        cb();
        return true;
    }
    alert('Out Of Stock');
    return false
}

function returnProduct(index, cb){
    productList[index].stock++;
    cb();
}

// product-search
document.querySelector('#product-search').addEventListener('keyup', searchDelay(() =>{
    const data = document.querySelector('#product-search');
    itemSearch(data);
},500));


function searchDelay(fn, delay){
    let delayTimeId;
    return function (){
        if(delayTimeId){
            clearTimeout(delayTimeId);
        }
        delayTimeId = setTimeout(fn, delay);
    }
}


function itemSearch(data){    
    var search = new RegExp(data.value , 'i');
    let resultArray = productList.filter(item => {
        return search.test(item.productName);
    });

    if(resultArray.length != 0){
        displayProduct(resultArray);
    }else{
        allProductList.innerHTML = `<li class="list-group-item list-group-item-action d-inline-flex justify-content-between align-items-center"><h6>Product Not Found</h6></li>`;
    }
}

// // product-rande-search
// document.querySelector('#product-rande-search').addEventListener('input', searchDelay(() =>{
//     const data = document.querySelector('#product-rande-search');
//     console.log(data.value);
//     itemRandeSearch(data);
    
// },500));


// function itemRandeSearch(data){    
//     var search = new RegExp(data.value , 'i');
//     let resultArray = productList.filter(item => {
//         return search.test(item.Price);
//     });

//     if(resultArray.length != 0){
//         displayProduct(resultArray);
//     }else{
//         allProductList.innerHTML = `<li class="list-group-item list-group-item-action d-inline-flex justify-content-between align-items-center"><h6>Product Not Found</h6></li>`;
//     }
// }

// Add Product
const addProduct = document.querySelector('#add-product');

addProduct.onsubmit = async function(event){
    event.preventDefault();
    
    // prepare the form data
    const formData = new FormData(addProduct);

    const productFormData = {};
    formData.forEach((value, key) => {
        productFormData[key] = value;
    });

    // send the request to server
    let response = await fetch("http://localhost:3000/products", {
        method: "POST",
        body: JSON.stringify(productFormData),
        headers: {
            "Content-Type": "application/json",
        },
    });

    // get response
    let result = await response.json();
    console.log(result);
    getProduct();
    // closeModal();
    // window.location.assign("http://127.0.0.1:5501/")
    
    // clear Input Filed
    document.querySelector('#productName').value = '';
    document.querySelector('#productName').value = '';
    document.querySelector('#productName').value = '';

}



async function getProduct(){
    const productListGet = await fetch(`http://localhost:3000/products`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    let result = await productListGet.json();
    [].splice.apply(productList, [0, productList.length].concat(result));  
    displayProduct(productList);  
};

window.onload = getProduct();


async function deleteProduct(productID){
    console.log(productID);
    const productListGet = await fetch(`http://localhost:3000/products/${productID}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    let result = await productListGet.json();
    
    getProduct();
};


async function editProduct(productID){
    const productListGet = await fetch(`http://localhost:3000/products/${productID}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    let result = await productListGet.json();
    // Get Data
    const editProductID = document.querySelector('#editProductID');
    editProductID.value = result._id;

    const productName = document.querySelector('#editProductName');
    productName.value = result.productName;

    const productPrice = document.querySelector('#editProductPrice');
    productPrice.value = result.price;

    const productStock = document.querySelector('#editProductStock');
    productStock.value = result.stock;


    //Update Data
    const UpdateProduct = await fetch(`http://localhost:3000/products/${productID}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    let updateResult = await UpdateProduct.json();
    console.log(updateResult);
    // getProduct();
};

const updateProduct = document.querySelector('#update-product');

updateProduct.onsubmit = async function(event){
    event.preventDefault();
    
    // prepare the form data
    const formData = new FormData(updateProduct);

    const productFormData = {};
    formData.forEach((value, key) => {
        productFormData[key] = value;
    });

    //Product Id
    const editProductID = document.querySelector('#editProductID').value;
    console.log(editProductID);
    // send the request to server
    let response = await fetch(`http://localhost:3000/products/${editProductID}`, {
        method: "PUT",
        body: JSON.stringify(productFormData),
        headers: {
            "Content-Type": "application/json",
        },
    });

    // get response
    let result = await response.json();
    console.log(result);
    getProduct();
    // closeModal();
    // window.location.assign("http://127.0.0.1:5501/")
}


const bouNowBtn = document.querySelector('#buy-now-btn');
bouNowBtn.addEventListener('click', searchDelay(() =>{
    buyProduct();
}, 500));

async function buyProduct(){
    if(cartItem.length != 0){

        bouNowBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Loading...`;
        let response = await fetch(`http://localhost:3000/buyproducts`, {
            method: "PUT",
            body: JSON.stringify(cartItem),
            headers: {
                "Content-Type": "application/json",
            },
        });
        let result = await response.json();
       
        if(result.length != 0){
            cartItem.length = 0; 
            setTimeout(() => {    
                console.log('getProduct Call');
                bouNowBtn.innerHTML = `Complete`;
                setTimeout(() => {
                    
                    getProduct();
                    bouNowBtn.innerHTML = `Buy Now`;
                }, 1000);   
            }, 5000);
            // location.reload();
        }
    }
}