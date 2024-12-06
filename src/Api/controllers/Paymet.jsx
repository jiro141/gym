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
  if (!data || !data.currency) {
    throw new Error("Currency is required to create a payment.");
  }

  // Valores predeterminados por moneda
  const defaultAmountsByCurrency = {
    pesos: 40000,
    dolares: 10,
  };

  // Asignar monto predeterminado si está vacío
  if (!data.amount) {
    data.amount = defaultAmountsByCurrency[data.currency];
  }

  // Validar que la moneda sea soportada
  if (!defaultAmountsByCurrency[data.currency]) {
    throw new Error(`Unsupported currency: ${data.currency}`);
  }

  try {
    const response = await Axios.post(`/payments`, data);
    return response;
  } catch (error) {
    console.error("Error creating payment:", error.message);
    throw error; // Lanzar el error para que pueda manejarse fuera de la función
  }
};
export const getGroudPaymet = async () => {
  try {
    const response = await Axios.get(`/payments/grouped`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
