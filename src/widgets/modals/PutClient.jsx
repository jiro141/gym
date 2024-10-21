import React, { useEffect, useState } from "react";
import { Button, Input, Select, Option, Stepper, Step } from "@material-tailwind/react";
import { getClientsDetails, putClient } from "@/Api/controllers/Clients";
import toast, { Toaster } from "react-hot-toast";

export default function PutClient({ id, setOpenPut }) {
    const [isLastStep, setIsLastStep] = React.useState(false);
    const [isFirstStep, setIsFirstStep] = React.useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [data, setData] = useState({});
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        idNumber: "",
        age: "",
        gender: "",
        membershipType: "",
    });
    const [fingerprintData, setFingerprintData] = useState(null); // Para almacenar la huella digital

    // Fetch client details when the component mounts
    const getData = async () => {
        const response = await getClientsDetails(id);
        setData(response);
        setFormData({
            firstName: response.firstName || "",
            lastName: response.lastName || "",
            idNumber: response.idNumber || "",
            age: response.age || "",
            gender: response.gender || "",
            membershipType: response.membershipType || "",
        });
    };

    useEffect(() => {
        getData();
    }, []);

    // Handling input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    // Captura de huella digital
    const captureFingerprint = async () => {
        try {
            const publicKey = {
                challenge: Uint8Array.from('random_challenge_string', c => c.charCodeAt(0)),
                rp: { name: "Ejemplo" },
                user: {
                    id: Uint8Array.from(formData.idNumber, c => c.charCodeAt(0)),
                    name: `${formData.firstName} ${formData.lastName}`,
                    displayName: formData.firstName,
                },
                pubKeyCredParams: [{ alg: -7, type: "public-key" }],
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

    // Submit updated data
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await putClient(id, { ...formData, fingerprintData });
            if (response) {
                toast.success("Cliente actualizado con éxito!");
                setTimeout(() => {
                    setOpenPut(false);
                }, 1500);
            } else {
                throw new Error("Error inesperado al actualizar el cliente");
            }
        } catch (error) {
            toast.error("Error al actualizar: " + error.message);
        }
    };

    const handleNext = () => {
        if (activeStep < 2) setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        if (activeStep > 0) setActiveStep(activeStep - 1);
    };

    return (
        <div className="max-w-md mx-auto p-8">
            <Toaster />
            <Stepper
                activeStep={activeStep}
                isLastStep={(value) => setIsLastStep(value)}
                isFirstStep={(value) => setIsFirstStep(value)}
            >
                <Step onClick={() => setActiveStep(0)} />
                <Step onClick={() => setActiveStep(1)} />
                <Step onClick={() => setActiveStep(2)} />
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
                            label="Número de Cédula"
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
                            <p><strong>Género:</strong> {formData.gender === "male" ? "Masculino" : "Femenino"}</p>
                            <p><strong>Tipo de Membresía:</strong> {formData.membershipType}</p>
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
                    <Button onClick={handleBack} disabled={activeStep === 0} color="blue-gray">
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
}
