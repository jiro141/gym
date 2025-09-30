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
import {
  MdPerson,
  MdFitnessCenter,
  MdAccessibility,
  MdAccessTime,
  MdBarChart,
  MdHealing,
  MdCheckCircle,
} from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function FormRutinas({
  activeStep,
  setActiveStep,
  formData,
  setFormData,
}) {
  const [showFaceDetection, setShowFaceDetection] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [fileName, setFileName] = useState("rutina.pdf");

  // 🔔 Estado para advertencias
  const [warningModal, setWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  // 🎉 Estado para despedida
  const [showFarewell, setShowFarewell] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔍 Validación por paso
  const validateStep = () => {
    if (activeStep === 0) {
      return (
        formData.name &&
        formData.age &&
        formData.gender &&
        formData.height &&
        formData.weight
      );
    }
    if (activeStep === 1) {
      return formData.goal;
    }
    if (activeStep === 2) {
      return formData.bodyType;
    }
    if (activeStep === 3) {
      return formData.trainingDays && formData.sessionTime;
    }
    if (activeStep === 4) {
      return formData.experience;
    }
    if (activeStep === 5) {
      if (formData.hasCondition === "Sí") {
        return formData.conditionDetails;
      }
      return formData.hasCondition;
    }
    return true;
  };

  // 🔥 Fetch con control de advertencias
  const fetchRoutine = async (force = false) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/rutinas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, force }),
        }
      );

      if (res.status === 400) {
        const data = await res.json();
        if (data.warning) {
          setWarningMessage(data.message);
          setWarningModal(true);
          return;
        }
      }

      const contentType = res.headers.get("Content-Type");
      if (!res.ok || !contentType.includes("application/pdf")) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");

      let name = "rutina.pdf";
      if (disposition && disposition.includes("filename=")) {
        name = disposition.split("filename=")[1].replace(/['"]/g, "");
      }

      setPdfBlob(blob);
      setFileName(name);
      toast.success("¡Rutina generada! Ahora puedes descargar el PDF.");
    } catch (err) {
      toast.error("Error generando rutina: " + err.message);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    fetchRoutine(false);
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    setActiveStep(7);
    setTimeout(() => {
      setActiveStep(0);
      setPdfBlob(null);
    }, 4000);
  };

  // 🔔 Forzar descarga ignorando advertencias
  const continueAnyway = () => {
    setWarningModal(false);
    fetchRoutine(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-white rounded shadow-md min-h-[500px] relative overflow-hidden">
      <Toaster />
      {/* 🎉 Pantalla de despedida */}
      {showFarewell && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-600 text-white text-2xl font-bold animate-fadeIn">
          ¡Gracias por usar el generador de rutinas! 💪
        </div>
      )}

      {!showFarewell && (
        <>
          <Stepper activeStep={activeStep} className="mb-6">
            {[
              MdPerson,
              MdFitnessCenter,
              MdAccessibility,
              MdAccessTime,
              MdBarChart,
              MdHealing,
              MdCheckCircle,
            ].map((IconComponent, index) => (
              <Step key={index} onClick={() => setActiveStep(index)}>
                <IconComponent className="w-6 h-6" />
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleGenerate} className="space-y-8">
            {activeStep === 0 && (
              <div className="grid grid-cols-2 gap-6 py-8">
                <Input
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <Input
                  label="Edad"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  label="Sexo"
                  value={formData.gender}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, gender: val }))
                  }
                  required
                >
                  <Option value="Masculino">Masculino</Option>
                  <Option value="Femenino">Femenino</Option>
                </Select>
                <Input
                  label="Altura (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Peso (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            {activeStep === 1 && (
              <Select
                label="Objetivo Principal"
                value={formData.goal}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, goal: val }))
                }
              >
                <Option value="Perder grasa">Perder grasa</Option>
                <Option value="Ganar masa muscular">Ganar masa muscular</Option>
              </Select>
            )}

            {activeStep === 2 && (
              <Select
                label="Tipo de Cuerpo"
                value={formData.bodyType}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, bodyType: val }))
                }
              >
                <Option value="Ectomorfo">
                  Ectomorfo (delgado por naturaleza)
                </Option>
                <Option value="Endomorfo">
                  Endomorfo (acumula grasa fácilmente)
                </Option>
              </Select>
            )}

            {activeStep === 3 && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Días de entrenamiento por semana"
                  name="trainingDays"
                  type="number"
                  min="1"
                  max="7"
                  value={formData.trainingDays}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  label="Duración por sesión"
                  value={formData.sessionTime}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, sessionTime: val }))
                  }
                  required
                >
                  <Option value="30 Min">30 Min</Option>
                  <Option value="1 H">1 H</Option>
                  <Option value="1:30 H">1:30 H</Option>
                  <Option value="2 H">2 H</Option>
                </Select>
              </div>
            )}

            {activeStep === 4 && (
              <Select
                label="Nivel de Experiencia"
                value={formData.experience}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, experience: val }))
                }
              >
                <Option value="Principiante">Principiante</Option>
                <Option value="Intermedio">Intermedio o más</Option>
              </Select>
            )}

            {activeStep === 5 && (
              <div className="space-y-4">
                <Select
                  label="¿Tienes alguna condición o lesión?"
                  value={formData.hasCondition}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, hasCondition: val }))
                  }
                  required
                >
                  <Option value="No">No</Option>
                  <Option value="Sí">Sí</Option>
                </Select>

                {formData.hasCondition === "Sí" && (
                  <Input
                    label="Explica tu condición"
                    name="conditionDetails"
                    value={formData.conditionDetails}
                    onChange={handleInputChange}
                    required
                  />
                )}
              </div>
            )}

            {activeStep === 6 && (
              <div className="space-y-2 text-sm text-gray-800">
                <p>
                  <strong>Nombre:</strong> {formData.name}
                </p>
                <p>
                  <strong>Edad:</strong> {formData.age}
                </p>
                <p>
                  <strong>Sexo:</strong> {formData.gender}
                </p>
                <p>
                  <strong>Altura:</strong> {formData.height} cm
                </p>
                <p>
                  <strong>Peso:</strong> {formData.weight} kg
                </p>
                <p>
                  <strong>Objetivo:</strong> {formData.goal}
                </p>
                <p>
                  <strong>Tipo de cuerpo:</strong> {formData.bodyType}
                </p>
                <p>
                  <strong>Días por semana:</strong> {formData.trainingDays}
                </p>
                <p>
                  <strong>Tiempo por sesión:</strong> {formData.sessionTime}
                </p>
                <p>
                  <strong>Experiencia:</strong> {formData.experience}
                </p>
                <p>
                  <strong>Condición médica:</strong> {formData.hasCondition}
                </p>
                {formData.hasCondition === "Sí" && (
                  <p>
                    <strong>Detalle:</strong> {formData.conditionDetails}
                  </p>
                )}
              </div>
            )}
            {activeStep === 7 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
                className="text-center py-12"
              >
                <video
                  autoPlay
                  playsInline
                  muted
                  className="mx-auto w-full max-w-lg rounded-lg shadow-lg"
                >
                  {/* WebM optimizado */}
                  <source
                    src="/videos/perro-animacion.webm"
                    type="video/webm"
                  />
                  {/* MP4 fallback */}
                  <source src="/videos/perro-animacion.mp4" type="video/mp4" />
                  Tu navegador no soporta el formato de video.
                </video>

                <p className="mt-4 text-xl font-bold text-green-600">
                  ✅ ¡Gracias por usar el generador de rutinas!
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Te estamos redirigiendo al inicio...
                </p>
              </motion.div>
            )}

            {/* Botones navegación */}
            {activeStep !== 7 && (
              <div className="flex justify-between pt-4">
                <Button
                  onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                  disabled={activeStep === 0}
                  color="blue-gray"
                >
                  Atrás
                </Button>
                {activeStep < 6 ? (
                  <Button
                    onClick={() => {
                      if (validateStep()) {
                        setActiveStep((prev) => prev + 1);
                      } else {
                        toast.error(
                          "Por favor completa todos los campos obligatorios."
                        );
                      }
                    }}
                    color="blue"
                  >
                    Siguiente
                  </Button>
                ) : (
                  <>
                    {!pdfBlob ? (
                      <Button type="submit" color="green">
                        Confirmar y Generar Rutina
                      </Button>
                    ) : (
                      <Button onClick={handleDownload} color="orange">
                        Descargar PDF
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </form>
        </>
      )}

      {/* 🔔 Modal de advertencia */}
      <Dialog open={warningModal} handler={() => setWarningModal(false)}>
        <DialogHeader>⚠️ Advertencia de Seguridad</DialogHeader>
        <DialogBody divider>{warningMessage}</DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setWarningModal(false)}
            className="mr-2"
          >
            Cancelar
          </Button>
          <Button color="orange" onClick={continueAnyway}>
            Continuar bajo mi responsabilidad
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
