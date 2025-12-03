import axiosInstance from "../helpers/AxiosInstance";
import { MostrarError } from "../helpers/Utils";
import toast from 'react-hot-toast';


  export const createProductRecipe = async (id,payload) => {
  try {
    const resp = await axiosInstance.post(`/product-recipe/${id}`, payload);
    return resp.data;
  } catch (error) {
    MostrarError(error);
    throw error;
  }
};


export const updateProductRecipe = async (id, payload) => {
  try {
    const resp = await axiosInstance.put(`/product-recipe/${id}`, payload);
    return resp.data;
  } catch (error) {
    MostrarError(error);
    throw error;
  } 
};


export const deleteRecipeItem = async (productId, recipeId) => {
  try {
    const resp = await axiosInstance.delete(`/product-recipe/${productId}/${recipeId}`);
    return resp.data;
  } catch (error) {
    MostrarError(error);
    throw error;
  }   
};