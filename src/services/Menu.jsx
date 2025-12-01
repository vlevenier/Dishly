import axiosInstance from "../helpers/AxiosInstance";
import { MostrarError } from "../helpers/Utils";
import toast from 'react-hot-toast';

  export const getMenu = async () => {
    try {
       
      const response = await axiosInstance.get(`/menu`);
      
      return response.data.data || [];
    } catch (error) {
        MostrarError(error);
      console.error("Error al obtener l:", error);
      throw error;
    }
  };

