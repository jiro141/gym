import React, { useState } from "react";
import FormRutinas from "@/widgets/forms/FormsRutinas";
import RoutineAccordion from "@/widgets/RoutineAccordion";
export default function Rutinas() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    bodyType: "",
    trainingDays: "",
    sessionTime: "",
    experience: "",
    hasCondition: "",
    conditionDetails: "",
  });
  return (
    <div>
      <h1 className="text-2xl font-bold">Rutinas</h1>
      <div className="flex flex-row w-full p-4 gap-4">
        {/* Columna 1: Formulario - 70% */}
        <div className="w-[70%]">
          <FormRutinas
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
        {/* Columna 2: Título - 30% */}
        <div className="w-[30%]">
          <RoutineAccordion
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        </div>
      </div>
    </div>
  );
}
