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


export const createPaymet = async (data, type) => {
  if (!data || !data.currency) {
    throw new Error("Currency and payment type are required.");
  }

  // Asignación del monto predeterminado según la moneda y tipo
  if (!data.amount) {
    if (data.currency === "pesos") {
      // Si es "pesos", asignamos según el tipo de pago
      data.amount = (type === "mensual") ? 40000 : 20000; // Mensual: 40,000, Semanal: 20,000
    } else if (data.currency === "dolares") {
      // Si es "dólares", asignamos según el tipo de pago
      data.amount = (type === "mensual") ? 10 : 5; // Mensual: 10, Semanal: 5
    } else {
      throw new Error("Unsupported currency.");
    }
  }

  try {
    const response = await Axios.post("/payments", data);
    return response;
  } catch (error) {
    console.error("Error creating payment:", error.message);
    throw error;
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
