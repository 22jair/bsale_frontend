const dropdown_categories = document.getElementById('dropdown_categories');
const dropdown_orderby = document.getElementById('dropdown_orderby');
const product_container = document.getElementById('product-container');
const select_limit = document.getElementById('select_limit');
const input_search = document.getElementById('input_search');
const btn_search = document.getElementById('btn_search');
const show_category = document.getElementById('show_category');
const show_orderby = document.getElementById('show_orderby');
const search_icon_clear = document.getElementById('search-icon-clear');
const btn_clear_all = document.getElementById('btn-clear-all');
const data_notfound_container = document.getElementById('data-notfound-container');

let products = [];
let sort = "id";
let order = "ASC";
let limit = 10;
let page = 1;
let category = undefined;
let total = 0;
let totalPages = 0;
let search = '';

/*
* Get products from API 
*/
const getProducts = async () => {
  
  try {
    IS_FEATCHING = true;
    showLoading(IS_FEATCHING);
    const response = await fetch(`${URL_PRODUCTS}?sort=${sort}&order=${order}&limit=${limit}&page=${page}&category=${category}&search=${search}`);
    const { data, total: totalProducts } = await response.json(); 
    products = data;
    totalPages = Math.ceil(totalProducts/limit);
    total = totalProducts;
    if(data.length > 0){
      drawProducts(data);      
      drawPagination();
    }else{
      drowDataNotFound();
    }    
    IS_FEATCHING = false;
    showLoading(false);
  } catch (error) {
    IS_FEATCHING = false;
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
      IS_FEATCHING = true;
      showLoading(IS_FEATCHING);
      const response = await fetch(`${URL_CATEGORIES}`);
      const { data } = await response.json();
      drawCategories(data);
      IS_FEATCHING = false;
      showLoading(false);
    } catch (error) {
      IS_FEATCHING = false;
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
  data_notfound_container.style.display = 'none';
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
        <div class="category-badget" title="${product.category.name}">${product.category.name}</div>
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

const drowDataNotFound = () => {
  main_pagination.innerHTML = '';  
  product_container.innerHTML = '';
  data_notfound_container.style.display = 'flex';
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

const searchProduct = () => {
  search = input_search.value;

  if(search.length <= 0){
    return showToast("Ingrese al menos un caracter", "error");
  }

  page = 1;
  search_icon_clear.style.display = 'block';
  getProducts();
}

const eventEnterInputSearch = (e) => {
  if(e.keyCode == 13){
    searchProduct();    
  }
}

const clearSearch = () => {
  search = '';
  input_search.value = '';
  search_icon_clear.style.display = 'none';
  page = 1;  
  getProducts();
}

const clearAll = () => {
  category = undefined;
  sort = "id";
  order = "ASC";
  limit = 10;
  page = 1;
  search = '';
  show_category.innerHTML = '--';
  show_orderby.innerHTML = '--';
  search_icon_clear.style.display = 'none';
  input_search.value = '';
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

dropdown_categories.addEventListener('click',selectCategory)
dropdown_orderby.addEventListener('click',selectOrderBy)
btn_search.addEventListener('click',searchProduct)
select_limit.addEventListener('change',limitProducts)
input_search.addEventListener('keyup',eventEnterInputSearch)
search_icon_clear.addEventListener('click',clearSearch)
btn_clear_all.addEventListener('click',clearAll)
getProducts();
getCategories();
