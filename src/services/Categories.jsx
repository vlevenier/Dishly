import { MostrarError } from "../helpers/Utils";
import toast from 'react-hot-toast';

  export const getCategories = async () => {
    try {
      const response = await axiosInstance.get(`/categories`);
      
      return response.data.data || [];
    } catch (error) {
        MostrarError(error);
      console.error("Error al obtener l:", error);
      throw error;
    }
  };


  export const createCategory = async (payload) => {
  try {
    const resp = await axiosInstance.post("/categories", payload);
    return resp.data;
  } catch (error) {
    MostrarError(error);
    throw error;
  }
};

export const updateCategory = async (id, payload) => {
  try {
    const resp = await axiosInstance.put(`/categories/${id}`, payload);
    return resp.data;
  } catch (error) {
    MostrarError(error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    await axiosInstance.delete(`/categories/${id}`);
    return true;
  } catch (error) {
    MostrarError(error);
    throw error;
  }
};
