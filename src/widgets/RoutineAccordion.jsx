import React from "react";
import { MdCheckCircle, MdAccessTime, MdExpandMore } from "react-icons/md";

const steps = [
  "Información Básica",
  "Objetivo Principal",
  "Tipo de Cuerpo",
  "Disponibilidad de Tiempo",
  "Nivel de Experiencia",
  "Condiciones o Lesiones",
  "Confirmación Final",
];

export default function RoutineAccordion({ activeStep }) {
  return (
    <div id="accordion-collapse" className="w-full">
      {steps.map((title, index) => {
        let Icon;
        if (index < activeStep) {
          Icon = MdCheckCircle;
        } else if (index > activeStep) {
          Icon = MdAccessTime;
        } else {
          Icon = MdExpandMore;
        }

        const iconClasses =
          index < activeStep
            ? "bg-green-500 text-white p-1 rounded-full"
            : index > activeStep
            ? "text-black"
            : "transform transition-transform duration-200 rotate-180";

        return (
          <div key={index}>
            <h2 id={`accordion-heading-${index}`}>
              <button
                type="button"
                disabled // 🔒 desactivado el click
                className={`flex items-center justify-between w-full p-3 font-medium text-left text-gray-700 border border-b-0 ${
                  index === 0 ? "rounded-t-xl" : ""
                } ${
                  index === steps.length - 1 ? "rounded-b-xl" : ""
                } hover:bg-gray-100 gap-3 ${
                  activeStep === index ? "bg-gray-100" : "bg-white"
                }`}
                aria-expanded={activeStep === index}
                aria-controls={`accordion-body-${index}`}
              >
                <span>{title}</span>
                <Icon className={`w-5 h-5 ${iconClasses}`} />
              </button>
            </h2>
            <div
              id={`accordion-body-${index}`}
              className={`${
                activeStep === index ? "block" : "hidden"
              } p-5 border border-t-0 text-sm text-gray-600`}
              aria-labelledby={`accordion-heading-${index}`}
            >
              <p>
                Contenido para <strong>{title}</strong>.
              </p>
              <p className="text-xs text-gray-400">
                Puedes personalizar cada sección con los campos reales si deseas.
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
