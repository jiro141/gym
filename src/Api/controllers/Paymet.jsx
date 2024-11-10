import Axios from "../Api";
export const getPaymetDayPesos = async () => {
  try {
    const response = await Axios.get(`/total-payments/day?currency=pesos`);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getPaymetDayDolares = async () => {
  try {
    const response = await Axios.get(`/total-payments/day?currency=dolares`);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getPaymetWeekPesos = async () => {
  try {
    const response = await Axios.get(`/total-payments/week?currency=pesos`);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getPaymetWeekDolares = async () => {
  try {
    const response = await Axios.get(`/total-payments/week?currency=dolares`);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const getPaymetMonthPesos = async () => {
  try {
    const response = await Axios.get(`/total-payments/month?currency=pesos`);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const createPaymet = async (data) => {
  try {
    const response = await Axios.post(`/payments`, data);
    return response;
  } catch (error) {
    console.log(error);
  }
};
