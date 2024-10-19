import Axios from "../Api";
export const getPaymetDayPesos = async () => {
    try {
        const response = await Axios.get(`/total-payments/day?currency=pesos`);
        console.log(response);

        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const getPaymetDayDolares = async () => {
    try {
        const response = await Axios.get(`/total-payments/day?currency=dolares`);
        console.log(response);

        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const getPaymetWeekPesos = async () => {
    try {
        const response = await Axios.get(`/total-payments/week?currency=pesos`);
        console.log(response);

        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const getPaymetWeekDolares = async () => {
    try {
        const response = await Axios.get(`/total-payments/week?currency=dolares`);
        console.log(response);

        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const getPaymetMonthPesos = async () => {
    try {
        const response = await Axios.get(`/total-payments/month?currency=pesos`);
        console.log(response);

        return response.data;
    } catch (error) {
        console.log(error);
    }
}