
/* shopping cart */

//show cart when clicked

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDom = document.querySelector(".cart");
const cartOverlay =  document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDom = document.querySelector(".products-center");


// cart
let cart = [];

//buttons
let buttonsDOM = [];


// Responsible for getting the products
class Products {
  async getProjects(){
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
      products  = products.map(item => {
        const {title,price} = item.fields;
        const {id} = item.sys;
        const image = item.fields.image.fields.file.url;
        return {title, price, id, image};
      })
      return products;
    } catch (error){
      console.log(error);
      
    }
  }
}

// display products (ui) getting the items that are returned from the project and displaying them

class UI {
  displayProducts(products){
    let result = "";
    products.forEach(product => {
      result += `
        <article class="product">
          <div class="img-container">
            <img
              src=${product.image}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              add to bag
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>${product.price}</h4>
        </article> 
      `
    ;
    });
    productsDom.innerHTML = result; 
  }
  getBagButtons(){
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if(inCart){
        button.innerText = "In Cart";
        button.disabled = true;
      } 
        button.addEventListener("click", (event)=>{
          console.log(event);
         event.target.innerText = "In Cart";
         event.target.disabled = true;
         // get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1};
         // add product to the cart
          cart = [...cart, cartItem];
         // save cart in local storage
          Storage.saveCart(cart)
         // update values in cart total

         // display cart item

         // show the cart

        });
    });
  }
}

// local storage

class Storage {
  static saveProducts(products){
    localStorage.setItem("products", JSON.stringify(products))
  }
  static getProduct(id){
    let products = JSON.parse(localStorage.getItem("products"))
    return products.find(product => product.id === id)
  }
  static saveCart(cart){
    localStorage.setItem("cart", JSON.stringify(cart))
  }
}

document.addEventListener("DOMContentLoaded", ()=> {
   const ui = new UI()
   const products = new Products()
   // get all products
   products.getProjects().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
   }).then(()=> {
    ui.getBagButtons();





   });
});

