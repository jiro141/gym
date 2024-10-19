import React, { useState } from "react";
import { Button, Input, Select, Option, Stepper, Step } from "@material-tailwind/react";
import { postClients } from "@/Api/controllers/Clients";
import toast, { Toaster } from "react-hot-toast";

const CreateClient = ({ handleOpen, open, setOpen }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        idNumber: "",
        age: "",
        gender: "",
        membershipType: "",
    });
    const [fingerprintData, setFingerprintData] = useState(null); // Para almacenar la huella digital

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Función para capturar la huella digital
    const captureFingerprint = async () => {
        try {
            const publicKey = {
                challenge: Uint8Array.from('random_challenge_string', c => c.charCodeAt(0)),
                rp: { name: "Ejemplo" },
                user: {
                    id: Uint8Array.from(formData.idNumber, c => c.charCodeAt(0)),  // Usa el ID del formulario
                    name: `${formData.firstName} ${formData.lastName}`,
                    displayName: formData.firstName
                },
                pubKeyCredParams: [{ alg: -7, type: "public-key" }]
            };

            const credential = await navigator.credentials.create({ publicKey });
            if (credential) {
                setFingerprintData(credential); // Almacena la huella digital capturada
                toast.success("Huella capturada con éxito!");
            }
        } catch (error) {
            console.error("Error al capturar la huella:", error);
            toast.error("Error al capturar la huella");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await postClients({ ...formData, fingerprintData });
            if (response) {
                toast.success('Cliente creado con éxito!');
                setTimeout(() => setOpen(false), 1500);
            } else {
                throw new Error('Error inesperado al crear el cliente');
            }
        } catch (error) {
            toast.error(error.message || 'Error inesperado');
        }
    };

    return (
        <div className="max-w-md mx-auto p-8">
            <Toaster />
            <Stepper activeStep={activeStep}>
                <Step onClick={() => setActiveStep(0)}></Step>
                <Step onClick={() => setActiveStep(1)}></Step>
                <Step onClick={() => setActiveStep(2)}></Step>
            </Stepper>

            <form onSubmit={handleSubmit} className="mt-8">
                {activeStep === 0 && (
                    <div className="space-y-4">
                        <Input label="Nombre completo" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                        <Input label="Apellido" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                        <Input label="Número de Cedula" name="idNumber" value={formData.idNumber} onChange={handleInputChange} required />
                    </div>
                )}

                {activeStep === 1 && (
                    <div className="space-y-4">
                        <Input label="Edad" name="age" type="number" value={formData.age} onChange={handleInputChange} required />
                        <Select label="Género" value={formData.gender} onChange={(value) => setFormData({ ...formData, gender: value })} required>
                            <Option value="male">Masculino</Option>
                            <Option value="female">Femenino</Option>
                        </Select>
                        <Select label="Tipo de Membresía" value={formData.membershipType} onChange={(value) => setFormData({ ...formData, membershipType: value })} required>
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

                        {/* Botón para capturar la huella dactilar */}
                        <Button onClick={captureFingerprint} color="blue-gray">
                            Capturar Huella Dactilar
                        </Button>

                        <Button type="submit" color="green">
                            Confirmar y Enviar
                        </Button>
                    </div>
                )}

                <div className="mt-8 flex justify-between">
                    <Button onClick={() => setActiveStep(activeStep - 1)} disabled={activeStep === 0} color="blue-gray">Atrás</Button>
                    {activeStep < 2 && (
                        <Button onClick={() => setActiveStep(activeStep + 1)} color="blue">Siguiente</Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CreateClient;
