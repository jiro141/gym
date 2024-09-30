import { Button, Option, Select, Typography } from '@material-tailwind/react'
import React, { useState } from 'react'
import { updateClient } from '@/Api/controllers/Clients'
import toast, { Toaster } from 'react-hot-toast';
export default function UpdateClient({ deleteData, setOpenDelete }) {
    const today = new Date();
    const [formData, setFormData] = useState({
        membershipType: "",
        renewalDate: today
    });
    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };
    const handleDelete = async (id) => {

        try {
            // Send form data to the `postClients` function
            const response = await updateClient(id, formData);

            // Check if the response is successful
            if (response) {
                // Success notification
                toast.success('Renovación con éxito!');
                // Optionally close the modal
                setTimeout(() => {
                    setOpenDelete(false);
                }, 1500);
            } else {
                // If the response is not successful, throw an error
                throw new Error('Error inesperado al renovar el cliente');
            }
        } catch (error) {
            // Check for different error types
            if (error.response) {
                // Server responded with a status other than 200 range
                console.error("Server error:", error.response.data);
                toast.error(`Error del servidor: ${error.response.data.message || 'Renovar el cliente'}`);
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
        <div className="max-w-md mx-auto p-8">
            <Typography className="text-blue-900 text-2xl">Confirma renovar a:</Typography>
            <Toaster />
            <Typography className="text-xl py-4">{deleteData.firstName} {deleteData.lastName}</Typography>
            <Typography className="text-xl py-4">Tipo de membresia</Typography>
            <Select
                label="Tipo de Membresía"
                value={formData.membershipType}
                onChange={(value) => handleSelectChange("membershipType", value)}
                required
            >
                <Option value="mensual">Mensual</Option>
                <Option value="semanal">Semanal</Option>
                <Option value="permanente">Permanente</Option>
            </Select>
            <Button className='my-4' color="green" onClick={() => handleDelete(deleteData.id)}>
                Confirmar
            </Button>
        </div>
    )
}
