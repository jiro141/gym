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
import { Sidenav } from "@/widgets/layout";
export function SignUp() {
  const [idNumber, setIdNumber] = useState("");
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const asistencia = async (e) => {
    e.preventDefault()
    if (idNumber) {
      try {
        const asistente = await Asistencia(idNumber);

        if (asistente && asistente.expirationDate) {
          const expirationDate = new Date(asistente.expirationDate);

          if (expirationDate >= today) {
            toast.custom((t) => (
              <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-lg w-full bg-green-500 text-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="ml-3 flex-1">
                      <p className="text-lg font-bold">
                        ¡Bienvenido {asistente.firstName}!
                      </p>
                      <p className="mt-1 text-md">
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ));
          } else {
            // Disparar el toast de error global
            toast.custom((t) => (
              <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-lg w-full bg-red-500 text-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="ml-3 flex-1">
                      <p className="text-lg font-bold">
                        Tu membresía ha expirado.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ));
          }
        } else {
          toast.custom((t) => (
            <div
              className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-lg w-full bg-red-500 text-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="ml-3 flex-1">
                    <p className="text-lg font-bold">
                      Cédula Invalida.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ));
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.custom((t) => (
            <div
              className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-lg w-full bg-red-500 text-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="ml-3 flex-1">
                    <p className="text-lg font-bold">
                      Cédula no existe.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ));
        } else {
          toast.custom((t) => (
            <div
              className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-lg w-full bg-red-500 text-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="ml-3 flex-1">
                    <p className="text-lg font-bold">
                      Ocurrió un error inesperado.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ));

        }
      }
    } else {
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-lg w-full bg-red-500 text-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="ml-3 flex-1">
                <p className="text-lg font-bold">
                  Cédula Vacia.
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cerrar
            </button>
          </div>
        </div>
      ));
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
          <Button type="submit" className="mt-6" fullWidth onClick={asistencia}>
            Asistencia
          </Button>

        </form>
        <Button className="mt-6"  onClick={handleNavigate}>Regresar</Button>
      </div>
    </section>
  );
}

export default SignUp;
