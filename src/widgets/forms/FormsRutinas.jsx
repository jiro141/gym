import React, { useState } from "react";
import {
  Button,
  Input,
  Select,
  Option,
  Stepper,
  Step,
  Dialog,
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
import FaceDetection from "../modals/FaceDetection";

export default function FormRutinas({
  activeStep,
  setActiveStep,
  formData,
  setFormData,
}) {
  const [showFaceDetection, setShowFaceDetection] = useState(false);
  

  const toggleFaceDetection = () => setShowFaceDetection(!showFaceDetection);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Rutina generada con éxito!");
    console.log("Datos enviados:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-white rounded shadow-md min-h-[500px]">
      <Toaster />
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

      <form onSubmit={handleSubmit} className="space-y-8">
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
            onChange={(val) => setFormData((prev) => ({ ...prev, goal: val }))}
            required
          >
            <Option value="Perder grasa">Perder grasa</Option>
            <Option value="Ganar masa muscular">Ganar masa muscular</Option>
            <Option value="Mantenerse saludable">Mantenerse saludable</Option>
            <Option value="Mejorar rendimiento">Mejorar rendimiento</Option>
          </Select>
        )}

        {activeStep === 2 && (
          <Select
            label="Tipo de Cuerpo"
            value={formData.bodyType}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, bodyType: val }))
            }
            required
          >
            <Option value="Ectomorfo">
              Ectomorfo (delgado por naturaleza)
            </Option>
            <Option value="Mesomorfo">Mesomorfo (atlético)</Option>
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
              <Option value="15 min">15 min</Option>
              <Option value="30 min">30 min</Option>
              <Option value="1 h">1 h</Option>
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
            required
          >
            <Option value="Principiante">Principiante</Option>
            <Option value="Intermedio">Intermedio</Option>
            <Option value="Avanzado">Avanzado</Option>
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

        {/* Botones navegación */}
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
              onClick={() => setActiveStep((prev) => prev + 1)}
              color="blue"
            >
              Siguiente
            </Button>
          ) : (
            <Button type="submit" color="green">
              Confirmar y Generar Rutina
            </Button>
          )}
        </div>
      </form>

      {/* Modal de detección facial (si lo quieres usar aquí también) */}
      <Dialog open={showFaceDetection} handler={toggleFaceDetection}>
        <DialogBody>
          <FaceDetection
            showFaceDetection={showFaceDetection}
            setShowFaceDetection={setShowFaceDetection}
          />
        </DialogBody>
        <DialogFooter>
          <Button onClick={toggleFaceDetection} color="red">
            Cerrar
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
