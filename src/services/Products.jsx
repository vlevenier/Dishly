import axiosInstance from "../helpers/AxiosInstance";
import { MostrarError } from "../helpers/Utils";
import toast from 'react-hot-toast';

  export const getProducts = async () => {
    try {
      const response = await axiosInstance.get(`/products`);
      
      return response.data.data || [];
    } catch (error) {
        MostrarError(error);
      console.error("Error al obtener l:", error);
      throw error;
    }
  };


  export const createProduct = async (payload) => {
  try {
    const resp = await axiosInstance.post("/products", payload);
    return resp.data;
  } catch (error) {
    MostrarError(error);
    throw error;
  }
};

export const updateProduct = async (id, payload) => {
  try {
    const resp = await axiosInstance.put(`/products/${id}`, payload);
    return resp.data;
  } catch (error) {
    MostrarError(error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    await axiosInstance.delete(`/products/${id}`);
    return true;
  } catch (error) {
    MostrarError(error);
    throw error;
  }
};
