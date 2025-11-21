import axiosInstance from "../helpers/AxiosInstance";
import { MostrarError } from "../helpers/Utils";


  export const getOrders = async () => {
    try {
      const response = await axiosInstance.get(`/orders`);
      
      return response.data.data || [];
    } catch (error) {
        MostrarError(error);
      console.error("Error al obtener l:", error);
      throw error;
    }
  };
