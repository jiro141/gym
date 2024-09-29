import Axios from "../Api";


export const getClients = async () => {
    try {
        const response = await Axios.get(`/clients`)
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const postClients = async (data) => {
    try {
        const response = await Axios.post(`/clients`, data)
        return response;
    } catch (error) {
        console.log(error);
    }
}
export const fetchSearchClient = async (data) => {
    console.log(data);
    try {
        const response = await Axios.get(`/clients/search?search=${data}`)
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const deleteClient = async(data)=>{
    try {
        const response = await Axios.delete(`/clients/${data}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}