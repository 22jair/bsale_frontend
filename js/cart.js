let cart = []
let productFromStorage = [];
let isCartPage = false;
let totalAmount = 0;
let topProductDiscount = [];
let btn_checkout = "";

const addToCart = (product) => {
  console.log("PRODUCT", product)
  const cartItem = cart.find(item => item.id === product.id)
  if (cartItem) {
    cartItem.quantity += 1
    showToast('Cantidad actualizada a: ' + cartItem.quantity)
  } else {
    product.quantity = 1    
    cart.push(product)
    showToast('Agrego al carrito')  
  }
  if (isCartPage) drawTableCart(); 
  updateCartIcon();
  saveLocalCart();
}

const deleteFromCart = (product) => {
  const cartItem = cart.find(item => item.id === product.id)
  if (cartItem.quantity === 1) {
    cart.splice(cart.indexOf(cartItem), 1)
  } else {
    cartItem.quantity -= 1
  }
  showToast('Cantidad actualizada')
  if (isCartPage) drawTableCart(); 
  updateCartIcon();
  saveLocalCart();
}

const updateCartIcon = () => {
  const cartIcon = document.querySelector('#cart_count')
  const cartItems = cart.length
  cartIcon.innerHTML = cartItems
}

const saveLocalCart = () => {
  localStorage.setItem('cart', JSON.stringify(cart))
}

const getLocalCart = () => {
  if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'))
    productFromStorage = cart;
    updateCartIcon()
    console.log("CART storage", cart)
  }
}

const drawTableCart = () => {

  let html = ''
  totalAmount = 0;
  cart.forEach((product) => {

    const currentPrice = product.isDiscount ? product.priceWithDiscount : product.price;    
    totalAmount += currentPrice * product.quantity;
    html += `
    <tr>
      <th scope="row">${product.id}</th>
      <td>${product.name}</td>      
      <td>${ currentPrice }</td>
      <td>${product.quantity}</td>
      <td>${product.discount}</td>
      <td>${currentPrice * product.quantity}</td>
      <td>
        <button onClick=(validateAddToCart(${product.id})) class="btn btn-outline-success btn-sm">+</button>
        <button onClick=(validateDeleteToCart(${product.id})) class="btn btn-outline-danger btn-sm">-</button>
      </td>
    </tr>
    `    
  })
  
  const total_cart = document.querySelector('#total_cart')
  total_cart.innerHTML = "s/. " + totalAmount
  const table = document.querySelector('#main_table_body_cart')
  table.innerHTML = html

}

const validateAddToCart = (id) => {
  const product = productFromStorage.find(item => item.id === id)
  addToCart(product)
}

const validateDeleteToCart = (id) => {
  const product = productFromStorage.find(item => item.id === id)
  deleteFromCart(product)
}

const checkoutOrder = () => {
  if( cart.length > 0 ){
    Swal.fire({
      title: '¿Está seguro de realizar el pedido?',
      text: "Monto total: " + totalAmount,
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, realizar pedido!'
    }).then((result) => {
      
      if (result.value) {
        Swal.fire(
          'Pedido realizado!',
          'Se ha realizado el pedido satisfactoriamente.',
          'success'
        )
        cart = [];
        saveLocalCart();
        updateCartIcon();
        drawTableCart();
      }    
    });
  } else {
    Swal.fire(
      'No hay productos en el carrito!',
      'Por favor agregue productos al carrito.',
      'warning'
    )
  }
}

const verifyIfPageIsCart = () => {
  if (window.location.href.indexOf('cart') > -1) {
    isCartPage = true;
    drawTableCart();   
     btn_checkout = document.querySelector('#btn_checkout');
      btn_checkout.addEventListener('click', checkoutOrder);
  }
}

const initCart = () => {
  getLocalCart();  
  verifyIfPageIsCart();
}

initCart();

