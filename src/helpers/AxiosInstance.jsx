import axios from "axios";


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptores para añadir el token
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.Token) {
      config.headers["Authorization"] = `Bearer ${user.Token}`;
    }

    return config;
  },
  (error) => {
   /// alert(JSON.stringify(error));
    return Promise.reject(error);
  }
);




axiosInstance.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la retornamos
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si el status es 401 (Unauthorized)
      // Limpiar sessionStorage y localStorage
      localStorage.removeItem('user'); 
      sessionStorage.removeItem('userData'); 
      //const history = useHistory();
      //history.push('/login'); 
      //navigate('/');
      // Aquí puedes redirigir al login si es necesario
      //const history = useHistory();
      //history.push('/login'); // O la ruta de login que tengas configurada
    }

    // Relanzar el error para que pueda ser manejado en otro lugar si es necesario
    return Promise.reject(error);
  }
);

export default axiosInstance;