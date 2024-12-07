import React, { useState } from "react";
import {
  Button,
  Input,
  Select,
  Option,
  Stepper,
  Step,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { postClients } from "@/Api/controllers/Clients";
import { createPaymet } from "@/Api/controllers/Paymet";
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
  const [paymentData, setPaymentData] = useState({
    amount: "",
    currency: "",
    clientID: "",
  });

  const [faceDetected, setFaceDetected] = useState(false); // Estado para detección de rostro
  const [showFaceDetection, setShowFaceDetection] = useState(false); // Estado para mostrar el modal de detección

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handlePaymentDataChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  // Abrir o cerrar el modal de detección de rostro
  const toggleFaceDetection = () => {
    setShowFaceDetection(!showFaceDetection);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Primero, intenta crear el cliente
      const clientResponse = await postClients(formData);
      if (clientResponse.data && clientResponse.data.id) {
        toast.success("Cliente creado con éxito!");

        // Configurar el id del cliente en los datos del pago
        const updatedPaymentData = {
          ...paymentData,
          clientID: clientResponse.data.id,
        };

        // Luego, intenta crear el pago con el id del cliente
        const paymentResponse = await createPaymet(updatedPaymentData,formData.membershipType);
        if (paymentResponse) {
          toast.success("Pago realizado con éxito!");
          setTimeout(() => setOpen(false), 1500);
        } else {
          throw new Error("Error al realizar el pago");
        }
      } else {
        throw new Error("Error inesperado al crear el cliente");
      }
    } catch (error) {
      toast.error(error.message || "Error inesperado");
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
          <div className="space-y-4 text-black">
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
              onChange={(value) => setFormData({ ...formData, gender: value })}
              required
            >
              <Option className="text-black font-bold	" value="male">
                Masculino
              </Option>
              <Option className="text-black font-bold	" value="female">
                Femenino
              </Option>
            </Select>
            <Select
              label="Tipo de Membresía"
              value={formData.membershipType}
              onChange={(value) =>
                setFormData({ ...formData, membershipType: value })
              }
              required
            >
              <Option className="text-black font-bold	" value="mensual">
                Mensual
              </Option>
              <Option className="text-black font-bold	" value="semanal">
                Semanal
              </Option>
              <Option className="text-black font-bold	" value="permanente">
                Permanente
              </Option>
            </Select>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 rounded">
              <h3 className="text-lg font-semibold">Confirmación de Datos</h3>
              <p>
                <strong>Nombre:</strong> {formData.firstName}{" "}
                {formData.lastName}
              </p>
              <p>
                <strong>ID:</strong> {formData.idNumber}
              </p>
              <p>
                <strong>Edad:</strong> {formData.age}
              </p>
              <p>
                <strong>Género:</strong>{" "}
                {formData.gender === "male"
                  ? "Masculino"
                  : formData.gender === "female"
                  ? "Femenino"
                  : "Otro"}
              </p>
              <p>
                <strong>Tipo de Membresía:</strong>{" "}
                {formData.membershipType.charAt(0).toUpperCase() +
                  formData.membershipType.slice(1)}
              </p>
            </div>
            <div className="space-y-4 text-black">
              <Select
                label="Moneda de pago"
                value={paymentData.currency}
                onChange={(value) =>
                  setPaymentData({ ...paymentData, currency: value })
                }
                required
              >
                <Option className="text-black font-bold	" value="pesos">
                  pesos
                </Option>
                <Option className="text-black font-bold	" value="dolares">
                  dolares
                </Option>
              </Select>
              {/* <Input
                label="Monto"
                name="amount"
                type="number"
                value={paymentData.amount}
                onChange={handlePaymentDataChange}
                required
              /> */}
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
          <Button
            onClick={() => setActiveStep(activeStep - 1)}
            disabled={activeStep === 0}
            color="blue-gray"
          >
            Atrás
          </Button>
          {activeStep < 2 && (
            <Button onClick={() => setActiveStep(activeStep + 1)} color="blue">
              Siguiente
            </Button>
          )}
        </div>
      </form>

      {/* Modal de Detección de Rostros */}
      <Dialog open={showFaceDetection} handler={toggleFaceDetection}>
        <DialogBody>
          <FaceDetection
            firstName={formData.fingerprintData}
            setFirstName={(printData) =>
              setFormData((prevFormData) => ({
                ...prevFormData,
                fingerprintData: printData,
              }))
            }
            showFaceDetection={showFaceDetection}
            setShowFaceDetection={setShowFaceDetection}
          />
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
