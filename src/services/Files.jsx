 import axiosInstance from "../helpers/AxiosInstance";
import { MostrarError } from "../helpers/Utils";
 export const getFileURL = async (fileKey) => {
    try {
         const encodedKey = encodeURIComponent(fileKey);

      const { data } = await axiosInstance.get(`/files/url/${encodedKey}`);
      
  return data.url; 
    } catch (error) {
        MostrarError(error);
      console.error("Error al obtener l:", error);
      throw error;
    }
  };
