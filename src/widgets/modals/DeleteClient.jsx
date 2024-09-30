import { Button, Typography } from '@material-tailwind/react'
import React from 'react'
import { deleteClient } from '@/Api/controllers/Clients'
import toast, { Toaster } from 'react-hot-toast';
export default function DeleteClient({ deleteData, setOpenDelete }) {
    const handleDelete = async (id) => {

        try {
            // Send form data to the `postClients` function
            const response = await deleteClient(id);

            // Check if the response is successful
            if (response) {
                // Success notification
                toast.success('Cliente Eliminado con éxito!');
                // Optionally close the modal
                setTimeout(() => {
                    setOpenDelete(false);
                }, 1500);
            } else {
                // If the response is not successful, throw an error
                throw new Error('Error inesperado al crear el cliente');
            }
        } catch (error) {
            // Check for different error types
            if (error.response) {
                // Server responded with a status other than 200 range
                console.error("Server error:", error.response.data);
                toast.error(`Error del servidor: ${error.response.data.message || 'No se pudo Eliminar el cliente'}`);
            } else if (error.request) {
                // Request was made but no response was received
                console.error("Network error:", error.request);
                toast.error('Error de red: No se pudo contactar al servidor');
            } else {
                // Something else happened while making the request
                console.error("Unexpected error:", error.message);
                toast.error('Error inesperado: ' + error.message);
            }
        }
    };
    return (
        <div className="max-w-md mx-auto p-8"><Typography className="text-blue-900 text-2xl">Confirma eliminar a:</Typography>
            <Toaster />
            <Typography className="text-xl py-4">{deleteData.firstName} {deleteData.lastName}</Typography>
            <Button color="red" onClick={() => handleDelete(deleteData.id)}>
                Confirmar
            </Button>
        </div>
    )
}
