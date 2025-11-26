import axiosInstance from "../helpers/AxiosInstance";
import { MostrarError } from "../helpers/Utils";
import toast from 'react-hot-toast';

  export const getInvoices = async () => {
    try {
        alert("here");
      const response = await axiosInstance.get(`/invoices`);
      
      return response.data || [];
    } catch (error) {
        MostrarError(error);
      console.error("Error al obtener l:", error);
      throw error;
    }
  };


  export const createInvoice = async (payload) => {
  try {
    const resp = await axiosInstance.post("/invoices", payload, {
  headers: { "Content-Type": "multipart/form-data" }
});
    return resp.data;
  } catch (error) {
    MostrarError(error);
    throw error;
  }
};

export const updateInvoice = async (id, payload) => {
 try {
    const resp = await axiosInstance.put("/invoices/"+id, payload, {
  headers: { "Content-Type": "multipart/form-data" }
});
    return resp.data;
  } catch (error) {
    MostrarError(error);
    throw error;
  }
};

