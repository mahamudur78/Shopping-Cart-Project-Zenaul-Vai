const productList = [];
// [
//     {
//         id: 1,
//         productName: 'Dell Vostro 14 3400',
//         Price: 4000,
//         stock: 20
//     },
//     {
//         id: 2,
//         productName: 'Lenovo IdeaPad 3 15ALC6',
//         Price: 30000,
//         stock: 3
//     },
//     {
//         id: 3,
//         productName: 'ASUS VivoBook 15 X515EA',
//         Price: 50000,
//         stock: 23
//     },
//     {
//         id: 4,
//         productName: 'DOEL Freedom A9 AMD A9-9425',
//         Price: 69000,
//         stock: 22
//     },
//     {
//         id: 5,
//         productName: 'Lenovo IdeaPad Slim 3i Intel',
//         Price: 45072,
//         stock: 11
//     },
// ];

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
            <div>
                <h5>${value.productName} (${value.stock})</h5>
                <p>${value.price}TK</p>
            </div>
            <div class="d-inline-flex align-items-center">
                <button type="button" class="p-1">✏️</button>
                <button type="button" class="p-1 m-2">❌</button> 
                <button type="button" class="item-plus btn btn-success" onclick="itemOrder(${value.id})">Add to Cart</button>
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
                        <button class="cart-minus cursorPointer" onclick="cartMinus(${index}, ${value.id})">➖</button>
                            <span class="m-2">${value.cartTotal}</span>
                        <button class="cart-plus cursorPointer" onclick="cartPlus(${index}, ${value.id})">➕</button>
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

    let findItem = cartItem.find(item => item.id === productID);
    let productIndex = productList.findIndex(item => item.id === productID);
    if(cartItemCount != 0 && findItem ){
        
        const cartIndex = cartItem.findIndex(item => item.id === productID);
        checkProductStock(productIndex, () => {cartItem[cartIndex].cartTotal++});
        
        
    }else{
        checkProductStock(productIndex, () => {});
        cartItem[cartItemCount] = { 
            id: productList[productIndex].id,
            itemName: productList[productIndex].productName,
            price: productList[productIndex].price,
            cartTotal: 1,
        };
        
    }

    if(productSearch.value){
        itemSearch(productSearch);
    }else{
        displayProduct(productList);
    }
    
}

function cartMinus(index, productID){
    const productIndex = productList.findIndex(item => item.id === productID);

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

    const productIndex = productList.findIndex(item => item.id === productID);
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
    }else{
        alert('Out Of Stock');
    }
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
}



async function getProduct(){
    const productListGet = await fetch("http://localhost:3000/products", {
        method: "GET",
    });

    let result = await productListGet.json();
    displayProduct(result);
    [].splice.apply(productList, [0, productList.length].concat(result));
    
};

window.onload = getProduct();
