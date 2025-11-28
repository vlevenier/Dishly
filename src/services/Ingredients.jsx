import axiosInstance from "../helpers/AxiosInstance";
import { MostrarError } from "../helpers/Utils";
import toast from 'react-hot-toast';

  export const getIngredients = async () => {
    try {
       
      const response = await axiosInstance.get(`/ingredients`);
      
      return response.data.data || [];
    } catch (error) {
        MostrarError(error);
      console.error("Error al obtener l:", error);
      throw error;
    }
  };


  export const createIngredient = async (payload) => {
  try {
    const resp = await axiosInstance.post("/ingredients", payload);
    return resp.data;
  } catch (error) {
    MostrarError(error);
    throw error;
  }
};

  export const updateIngredient = async (id,payload) => {
  try {
    const resp = await axiosInstance.put("/ingredients/"+id, payload);
    return resp.data;
  } catch (error) {
    MostrarError(error);
    throw error;
  }
};

