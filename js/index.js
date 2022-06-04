// MAINS URLS
const URL_DEV = 'http://localhost:3000';
const URL_PROD = 'https://api.todo-app-backend.herokuapp.com';
const MAIN_URL = ( 
                  window.location.hostname.includes("localhost") ||
                  window.location.hostname.includes("127.0.0.1")
                ) ? URL_DEV : "";
const MAIN_API_URL = MAIN_URL+"/api/v1";
const URL_PRODUCTS = `${MAIN_API_URL}/product`;
const URL_CATEGORIES = `${MAIN_API_URL}/category`;

// GLOBAL TOAST
const showToast = (message, type) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })  
  Toast.fire({
    icon: type || 'success',
    title: message || 'Signed in successfully'
  })
}
