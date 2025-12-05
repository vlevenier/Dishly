import axiosInstance from "../helpers/AxiosInstance";
import { MostrarError } from "../helpers/Utils";

export const getCombos = async () => {
  try {
        const response = await axiosInstance.get(`/combos`);
        
        return response.data.data || [];
      } catch (error) {
          MostrarError(error);
        console.error("Error al obtener l:", error);
        throw error;
      }
};

export const createCombo = async (payload) => {
  try {
    const resp = await axiosInstance.post("/combos", payload);
    return resp.data;
  } catch (error) {
    MostrarError(error);
    throw error;
  }
};




export const updateCombo = async (id, payload) => {
  try {
    const resp = await axiosInstance.put(`/combos/${id}`, payload);
    return resp.data;
  } catch (error) {
    MostrarError(error);
    throw error;
  }
};
