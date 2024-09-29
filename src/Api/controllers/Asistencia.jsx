import Axios from "../Api";

// Asistencia
export const Asistencia = async (data) => {
    try {
        const response = await Axios.put(`/attendance/${data}`);
        return response.data.client;  // Retorna los datos del cliente si la solicitud es exitosa
    } catch (error) {
        // En lugar de retornar el error completo, retornamos un mensaje o manejamos el error
        if (error.response) {
            // Si el servidor responde con un error
            return {
                success: false,
                status: error.response.status,
                message: error.response.data.error || "Error en la solicitud"
            };
        } else if (error.request) {
            // Si no hubo respuesta del servidor
            return {
                success: false,
                message: "No se recibió respuesta del servidor. Verifica tu conexión."
            };
        } else {
            // Otro tipo de error (ejemplo: error al configurar la solicitud)
            return {
                success: false,
                message: "Error al configurar la solicitud: " + error.message
            };
        }
    }
};
