let cart = []

const addToCart = (product) => {
  const cartItem = cart.find(item => item.id === product.id)
  if (cartItem) {
    cartItem.quantity += 1
    showToast('Cantidad actualizada a: ' + cartItem.quantity)
  } else {
    product.quantity = 1    
    cart.push(product)
    showToast('Agrego al carrito')  
  }
  updateCartIcon()
  saveLocalCart()
}

const deleteFromCart = (product) => {
  const cartItem = cart.find(item => item.id === product.id)
  if (cartItem.quantity === 1) {
    cart.splice(cart.indexOf(cartItem), 1)
  } else {
    cartItem.quantity -= 1
  }
  console.log("CART storage", cart)
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
    updateCartIcon()
  }
}

const initCart = () => {
  getLocalCart();
}

initCart();

