import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { Asistencia } from "@/Api/controllers/Asistencia";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useToast } from "@/context/ToastContext";
import { Sidenav } from "@/widgets/layout";
export function SignUp() {
  const [idNumber, setIdNumber] = useState(""); // Inicializa el estado con una cadena vacía
  const { showGlobalSuccessToast, showGlobalErrorToast } = useToast();
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const asistencia = async () => {
    if (idNumber) {
      try {
        const asistente = await Asistencia(idNumber);

        if (asistente && asistente.expirationDate) {
          const expirationDate = new Date(asistente.expirationDate);

          if (expirationDate >= today) {
            // Disparar el toast de éxito global
            showGlobalSuccessToast(asistente.firstName, formattedDate);
            setTimeout(() => {
            }, 1500);
          } else {
            // Disparar el toast de error global
            showGlobalErrorToast("Tu membresía ha expirado.");
          }
        } else {
          showGlobalErrorToast("Cédula inválida.");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          showGlobalErrorToast("La cédula no existe.");
        } else {
          showGlobalErrorToast("Ocurrió un error inesperado.");
        }
      }
    } else {
      showGlobalErrorToast("El número de cédula está vacío.");
    }
  };

  // Function to handle the navigation to /dashboard/tables
  const handleNavigate = () => {
    navigate("/dashboard/tables"); // Navigate to dashboard/tables
  };

  return (
    <section className="m-8 flex">
      <Toaster />
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-[80vh] w-full object-cover rounded-3xl"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        {/* Button that navigates */}
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Asistencia</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Ingresa tu número de cédula</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Cédula
            </Typography>
            <Input
              size="lg"
              placeholder="Cédula"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={idNumber} // Vinculamos el valor del input al estado
              onChange={(e) => setIdNumber(e.target.value)} // Actualizamos el estado con el valor ingresado
            />
          </div>
          <Button className="mt-6" fullWidth onClick={asistencia}>
            Asistencia
          </Button>
          <Button className="mt-6" fullWidth onClick={handleNavigate}>Regresar</Button>
        </form>
      </div>
    </section>
  );
}

export default SignUp;
