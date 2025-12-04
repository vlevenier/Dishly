import axiosInstance from "../helpers/AxiosInstance";
import { MostrarError } from "../helpers/Utils";


export const createOrder = async (payload) => {

    console.log("createOrder payload:", payload );
  try {
    const resp = await axiosInstance.post("/payment/smartpoint", payload);
    return resp.data;
  } catch (error) {
    MostrarError(error);
    throw error;
  }
};

