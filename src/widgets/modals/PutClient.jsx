import React, { useEffect, useState } from "react";
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
import { getClientsDetails, putClient } from "@/Api/controllers/Clients";
import toast, { Toaster } from "react-hot-toast";
import FaceDetection from "./FaceDetection";
import { useFingerprintSocket } from "@/hooks/useFingerprintSocket";

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
    fingerprintData: "",
  });
  const [showFaceDetection, setShowFaceDetection] = useState(false);
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
  const toggleFaceDetection = () => {
    setShowFaceDetection(!showFaceDetection);
  };
  // ✅ NUEVO: Conexión WebSocket
  const { connected, data: fingerprint } = useFingerprintSocket(
    "ws://localhost:8080"
  );

  // ✅ Si llega una huella, la guardamos automáticamente
  useEffect(() => {
    if (fingerprint && fingerprint.template) {
      setFormData((prev) => ({
        ...prev,
        fingerprintData: fingerprint.template,
      }));
      toast.success("Huella actualizada correctamente 🖐️");
    }
  }, [fingerprint]);

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await putClient(id, { ...formData });
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
              onChange={(value) => handleSelectChange("membershipType", value)}
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
                {formData.gender === "male" ? "Masculino" : "Femenino"}
              </p>
              <p>
                <strong>Tipo de Membresía:</strong> {formData.membershipType}
              </p>
            </div>

            {/* 🔥 Nueva sección de huella */}
            <div className="p-4 bg-gray-100 rounded border border-gray-300 mt-4">
              <h3 className="text-lg font-semibold mb-2">Lectura de Huella</h3>
              <p>
                Estado del lector:{" "}
                <span
                  className={
                    connected
                      ? "text-green-600 font-bold"
                      : "text-red-600 font-bold"
                  }
                >
                  {connected ? "Conectado" : "Desconectado"}
                </span>
              </p>

              {fingerprint ? (
                <div className="mt-2">
                  <p>
                    <b>ID del sensor:</b> {fingerprint.id}
                  </p>
                  <p>
                    <b>Confianza:</b> {fingerprint.confidence}
                  </p>
                  <p className="text-xs text-gray-500 break-words mt-2">
                    <b>Template:</b>
                    <br />
                    {fingerprint.template.substring(0, 60)}...
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 mt-2">
                  Esperando lectura de huella...
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <Button onClick={toggleFaceDetection} color="blue">
                Detectar Rostro
              </Button>
              <Button type="submit" color="green">
                Confirmar y Guardar
              </Button>
            </div>
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
}
