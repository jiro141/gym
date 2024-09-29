// createClient.jsx
import React, { useState } from "react";
import { Button, Input, Select, Option, Stepper, Step, StepLabel, Typography } from "@material-tailwind/react";
import { postClients } from "@/Api/controllers/Clients";
import toast, { Toaster } from "react-hot-toast";
const CreateClient = ({ handleOpen, open, setOpen }) => {

    const [isLastStep, setIsLastStep] = React.useState(false);
    const [isFirstStep, setIsFirstStep] = React.useState(false);

    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        idNumber: "",
        age: "",
        gender: "",
        membershipType: "",
    });

    const handleNext = () => {
        if (activeStep < 2) setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        if (activeStep > 0) setActiveStep(activeStep - 1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the form from reloading the page

        try {
            // Send form data to the `postClients` function
            const response = await postClients(formData);

            // Check if the response is successful
            if (response) {
                // Success notification
                toast.success('Cliente creado con éxito!');
                // Optionally close the modal
                setTimeout(() => {
                    setOpen(false);
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
                toast.error(`Error del servidor: ${error.response.data.message || 'No se pudo crear el cliente'}`);
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
            <Toaster />
            <Stepper
                activeStep={activeStep}
                isLastStep={(value) => setIsLastStep(value)}
                isFirstStep={(value) => setIsFirstStep(value)}
            >
                <Step onClick={() => setActiveStep(0)}>
                    {/* <UserIcon className="h-5 w-5" /> */}
                    <div className="absolute -bottom-[4.5rem] w-max text-center">

                    </div>
                </Step>
                <Step onClick={() => setActiveStep(1)}>
                    {/* <CogIcon className="h-5 w-5" /> */}
                    <div className="absolute -bottom-[4.5rem] w-max text-center">

                    </div>
                </Step>
                <Step onClick={() => setActiveStep(2)}>
                    {/* <BuildingLibraryIcon className="h-5 w-5" /> */}
                    <div className="absolute -bottom-[4.5rem] w-max text-center">

                    </div>
                </Step>
            </Stepper>

            <form onSubmit={handleSubmit} className="mt-8">
                {activeStep === 0 && (
                    <div className="space-y-4">
                        <Input
                            label="Nombre completo"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                        />
                        <Input
                            label="Apellido"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                        />
                        <Input
                            label="Número de Cedula"
                            name="idNumber"
                            value={formData.idNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                )}

                {activeStep === 1 && (
                    <div className="space-y-4">
                        <Input
                            label="Edad"
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleInputChange}
                            required
                        />
                        <Select
                            label="Género"
                            value={formData.gender}
                            onChange={(value) => handleSelectChange("gender", value)}
                            required
                        >
                            <Option value="male">Masculino</Option>
                            <Option value="female">Femenino</Option>
                        </Select>
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
                    </div>
                )}

                {activeStep === 2 && (
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-100 rounded">
                            <h3 className="text-lg font-semibold">Confirmación de Datos</h3>
                            <p><strong>Nombre:</strong> {formData.firstName} {formData.lastName}</p>
                            <p><strong>ID:</strong> {formData.idNumber}</p>
                            <p><strong>Edad:</strong> {formData.age}</p>
                            <p><strong>Género:</strong> {formData.gender === "male" ? "Masculino" : formData.gender === "female" ? "Femenino" : "Otro"}</p>
                            <p><strong>Tipo de Membresía:</strong> {formData.membershipType.charAt(0).toUpperCase() + formData.membershipType.slice(1)}</p>
                        </div>
                        <Button type="submit" color="green">
                            Confirmar y Enviar
                        </Button>
                    </div>
                )}

                <div className="mt-8 flex justify-between">
                    <Button
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        color="blue-gray"
                    >
                        Atrás
                    </Button>
                    {activeStep < 2 && (
                        <Button onClick={handleNext} color="blue">
                            Siguiente
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CreateClient;
