import React, { useState } from "react";
import {
    Button, Input, Select, Option, Stepper, Step, Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { postClients } from "@/Api/controllers/Clients";
import toast, { Toaster } from "react-hot-toast";
import FaceDetection from "./FaceDetection"; // Importar el componente de detección de rostro

const CreateClient = ({ handleOpen, open, setOpen }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        idNumber: "",
        age: "",
        gender: "",
        membershipType: "",
        fingerprintData: "",
    });
    const [faceDetected, setFaceDetected] = useState(false); // Estado para detección de rostro
    const [showFaceDetection, setShowFaceDetection] = useState(false); // Estado para mostrar el modal de detección

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Abrir o cerrar el modal de detección de rostro
    const toggleFaceDetection = () => {
        setShowFaceDetection(!showFaceDetection);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await postClients(formData);
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

                        {/* Botón para detectar rostro */}
                        <div className=" mt-8 flex  justify-between	">
                            <Button onClick={toggleFaceDetection} color="blue">
                                Detectar Rostro
                            </Button>

                            <Button type="submit" color="green">
                                Confirmar y Enviar
                            </Button>
                        </div>
                    </div>
                )}

                <div className="mt-8 flex justify-between">
                    <Button onClick={() => setActiveStep(activeStep - 1)} disabled={activeStep === 0} color="blue-gray">Atrás</Button>
                    {activeStep < 2 && (
                        <Button onClick={() => setActiveStep(activeStep + 1)} color="blue">Siguiente</Button>
                    )}
                </div>
            </form>

            {/* Modal de Detección de Rostros */}
            <Dialog open={showFaceDetection} handler={toggleFaceDetection}>
                <DialogBody>
                    <FaceDetection
                        firstName={formData.fingerprintData}
                        setFirstName={(printData) => setFormData(prevFormData => ({
                            ...prevFormData,
                            fingerprintData: printData
                        }))}
                        showFaceDetection={showFaceDetection}
                        setShowFaceDetection={setShowFaceDetection} />
                </DialogBody>
                <DialogFooter>
                    <Button color="red" onClick={toggleFaceDetection}>
                        Cerrar
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default CreateClient;
