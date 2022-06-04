const dropdown_categories = document.getElementById('dropdown_categories');
const dropdown_orderby = document.getElementById('dropdown_orderby');
const product_container = document.getElementById('product-container');
const select_limit = document.getElementById('select_limit');
const input_search = document.getElementById('input_search');
const btn_search = document.getElementById('btn_search');
const show_category = document.getElementById('show_category');
const show_orderby = document.getElementById('show_orderby');
const loading_container = document.getElementById('loading_container');

let products = [];
let sort = "id";
let order = "ASC";
let limit = 10;
let page = 1;
let category = undefined;
let total = 0;
let totalPages = 0;
let search = '';
let isFeching = false;

/*
* Get products from API 
*/
const getProducts = async () => {
  
  try {
    isFeching = true;
    showLoading(isFeching);
    const response = await fetch(`${URL_PRODUCTS}?sort=${sort}&order=${order}&limit=${limit}&page=${page}&category=${category}&search=${search}`);
    const { data, total: totalProducts } = await response.json(); 
    products = data;
    totalPages = Math.ceil(totalProducts/limit);
    total = totalProducts;
    drawProducts(data);
    drawPagination();
    isFeching = false;
    showLoading(false);
  } catch (error) {
    isFeching = false;
    showLoading(false);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message,      
    })
  }
      
}

/*
* Get categories from API
*/
const getCategories = async () => {
    
    try {
      isFeching = true;
      showLoading(isFeching);
      const response = await fetch(`${URL_CATEGORIES}`);
      const { data } = await response.json();
      drawCategories(data);
      isFeching = false;
      showLoading(false);
    } catch (error) {
      isFeching = false;
      showLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,      
      })
    }
        
}

/* Init draw HTML */
const drawCategories = (categories) => {
  let html = '<li><a class="dropdown-item" value="" class="active">--</a></li>';
  categories.forEach(category => {    
    html += `<li><a class="dropdown-item" value="${category.id}" href="#">${category.name}</a></li>`;    
  });
  dropdown_categories.innerHTML = html;
}

const drawProducts = (products) => { 
  let html = '';
  products.forEach(product => {
    
    if(!product.url_image || product.url_image == "url_image"){
      product.url_image = MAIN_URL + '/assets/img/not-found.jpg';
    }
        
    html += `
    <div class="product-item">
      <div class="product-image">
        <img src="${product.url_image}" alt="">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        ${ product.isDiscount ? "<p class='m-0'>Antes: <span class='card-price-old'>"+product.price+"</span></p>" : "" }
        <p>$${product.isDiscount ? product.priceWithDiscount : product.price}</p>
        <p>
          <button onClick="eventAddCart(${product.id})" class="product-btn">Agregar  <i class="bi bi-cart-plus"></i></button>
        </p>
        ${ product.isDiscount ? `<div class="discount-badget">20%</div>` : '' }
      </div>
    </div>
    `;
  });
  product_container.innerHTML = html;
}

const drawPagination = () => {3
  let html = '';
  html +=`
      <li onClick="goPaginate(1)" class="page-item ${page == 1 ? 'active' : ''}">
        <a class="page-link">Inicio</a>
      </li>
      `
  for (let i = 1; i <= totalPages; i++) {
    html += `<li onClick="goPaginate(${i})" class="page-item ${page == i ? 'active' : ''}"><a class="page-link" href="#">${i}</a></li>`;
  }

  html +=`   
        <li onClick="goPaginate(${totalPages})" class="page-item ${page == totalPages ? 'active' : ''}">
            <a class="page-link" href="#">Final</a>
        </li>
        `;
  main_pagination.innerHTML = html;  
}
/* Finish draw HTML */

/* Init Events */
const selectCategory = (e) => {
  const id = e.target.getAttribute('value');
  category = id.length > 0 ? id : undefined ;  
  page = 1;
  show_category.innerHTML = e.target.innerHTML.toUpperCase();
  getProducts();
}

const selectOrderBy = (e) => {
  const value = e.target.getAttribute('value');
  const byOrder = e.target.getAttribute('order');  
  sort = value;
  order = byOrder;
  page = 1;  
  show_orderby.innerHTML = e.target.innerHTML.toUpperCase();
  getProducts();
}

const searchProduct = (e) => {
  e.preventDefault();
  search = input_search.value;
  page = 1;
  getProducts();
}

const limitProducts = (e) => {  
  const value = e.target.value;
  limit = value;
  page = 1;
  getProducts();
}

const goPaginate = (numberPage) => {  
  if(numberPage > 0 && numberPage <= totalPages){
    page = parseInt(numberPage);
    getProducts();
  }
}

const eventAddCart = (id) => {
  const product = products.find(product => product.id == id);
  if(product){
    addToCart(product);
  }
}


/* Finish Events */

const showLoading = (bool = true) => {
  loading_container.style.display = bool ? 'flex' : 'none';
}

dropdown_categories.addEventListener('click',selectCategory)
dropdown_orderby.addEventListener('click',selectOrderBy)
btn_search.addEventListener('click',searchProduct)
select_limit.addEventListener('change',limitProducts)
getProducts();
getCategories();
