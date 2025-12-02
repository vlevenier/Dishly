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
export const getOrdersFilter = async (params) => {
  console.log("getOrdersFilter params:", params );
  const response = await axiosInstance.get("/orders/filters", { params });
  return response.data;
};

export const createOrder = async (payload) => {
  try {
    const resp = await axiosInstance.post("/orders", payload);
    return resp.data;
  } catch (error) {
    MostrarError(error);
    throw error;
  }
};


export const updateOrderPayment = async (payload) => {
  try {
    const resp = await axiosInstance.put(`/orders/${payload?.id}/pay`, {
      payment_status: payload.payment_status,
      payment_method: payload.paymentMethod,
    });
    return resp.data;
  } catch (error) {
    MostrarError(error);
    throw error;
  }
};  