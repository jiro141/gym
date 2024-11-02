import Axios from "../Api";

// Función para convertir el objeto faceDescriptor a un array si es necesario
const convertDescriptorToArray = (descriptor) => {
    if (typeof descriptor === "object" && descriptor !== null) {
        return Object.values(descriptor).map((value) => parseFloat(value));
    }
    return descriptor; // Devuelve el descriptor tal cual si ya es un array
};

// Asistencia
export const Asistencia = async (data) => {
    try {
        // Si fingerprintData está presente en data, conviértelo a array
        const processedData = data.fingerprintData 
            ? { ...data, fingerprintData: convertDescriptorToArray(data.fingerprintData) } 
            : data;

        // Envía `processedData` en el cuerpo de la solicitud con el método PUT
        const response = await Axios.put("/attendance", processedData); // Cambia `data` de la URL al cuerpo
        return response.data.client;  // Retorna los datos del cliente si la solicitud es exitosa
    } catch (error) {
        // Manejador de errores
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
            // Otro tipo de error
            return {
                success: false,
                message: "Error al configurar la solicitud: " + error.message
            };
        }
    }
};
