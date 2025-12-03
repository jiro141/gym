import { useNavigate } from "react-router-dom";
import { Input, Button, Typography } from "@material-tailwind/react";
import { Asistencia } from "@/Api/controllers/Asistencia";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { CSSTransition } from "react-transition-group";
import { useFingerprintSocket } from "@/hooks/useFingerprintSocket"; // 👈 Importamos el hook

export function SignUp() {
  const [idNumber, setIdNumber] = useState("");
  const [asistenciaInfo, setAsistenciaInfo] = useState(null);
  const [mostrarCard, setMostrarcard] = useState(false);

  const today = new Date();
  const navigate = useNavigate();

  // ✅ Conexión automática al lector de huellas (ESP32)
  const { connected, data: fingerprint } = useFingerprintSocket("ws://localhost:8080");

  // ✅ Procesar automáticamente cuando llegue una huella
  useEffect(() => {
    if (fingerprint && fingerprint.id) {
      console.log("🖐️ Huella detectada:", fingerprint);
      handleAsistenciaAuto(fingerprint.id);
    }
  }, [fingerprint]);

  // ✅ Buscar y registrar asistencia automáticamente
  const handleAsistenciaAuto = async (idNum) => {
    try {
      const asistente = await Asistencia({ idNumber: idNum });

      if (asistente && asistente.expirationDate) {
        const expirationDate = new Date(asistente.expirationDate);
        const isVigente = expirationDate >= today;

        setAsistenciaInfo({
          name: `${asistente.firstName} ${asistente.lastName}`,
          formattedExpiration: expirationDate.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          isVigente,
        });

        setMostrarcard(true);
      } else {
        toast.error("No se encontró el cliente.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Cliente no existe.");
      } else {
        toast.error("Error procesando la huella.");
      }
      console.error("❌ Error en asistencia automática:", error);
    }
  };

  // ✅ También mantener el formulario manual (por si el lector falla)
  const asistenciaManual = async (e) => {
    e.preventDefault();

    if (!idNumber) {
      toast.error("Por favor, ingrese su número de cédula.");
      return;
    }

    try {
      const asistente = await Asistencia({ idNumber });

      if (asistente && asistente.expirationDate) {
        const expirationDate = new Date(asistente.expirationDate);
        const isVigente = expirationDate >= today;

        setAsistenciaInfo({
          name: `${asistente.firstName} ${asistente.lastName}`,
          formattedExpiration: expirationDate.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          isVigente,
        });

        setMostrarcard(true);
      } else {
        toast.error("No se encontró el cliente.");
      }
    } catch (error) {
      toast.error("Ocurrió un error al buscar el cliente.");
    }
  };

  // ✅ Ocultar automáticamente el card después de 4 segundos
  useEffect(() => {
    let timer;
    if (mostrarCard) {
      timer = setTimeout(() => setMostrarcard(false), 4000);
    }
    return () => clearTimeout(timer);
  }, [mostrarCard]);

  return (
    <section className="m-8 flex">
      <Toaster />

      <div className="w-full flex flex-col items-center justify-center">
        <div className="text-center mb-4">
          <Typography variant="h2" className="font-bold mb-2">
            Control de Asistencia
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Escanea tu huella o ingresa tu número de cédula para registrar asistencia.
          </Typography>

          {/* Estado del lector */}
          <p className="text-sm text-gray-500 mt-3">
            Estado del lector:{" "}
            <span
              className={
                connected ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
              }
            >
              {connected ? "Conectado ✅" : "Desconectado ❌"}
            </span>
          </p>
        </div>

        {/* Formulario manual (opcional) */}
        <form
          className="mt-4 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
          onSubmit={(e) => {
            e.preventDefault();
            asistenciaManual(e);
            setIdNumber("");
          }}
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Cédula
            </Typography>
            <Input
              size="lg"
              placeholder="Cédula"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
          </div>
          <Button className="mt-6" fullWidth type="submit">
            Registrar Asistencia
          </Button>
        </form>

        <Button className="mt-6" onClick={() => navigate("/dashboard/tables")}>
          Regresar
        </Button>
      </div>

      {/* Card de resultado */}
      <CSSTransition
        in={mostrarCard}
        timeout={300}
        classNames="my-node"
        unmountOnExit
      >
        <div
          className={`fixed top-[80%] lg:left-[25%] lg:top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 shadow-lg rounded-lg p-6 w-96 z-50 ${
            asistenciaInfo?.isVigente ? "bg-green-50" : "bg-red-50"
          } border`}
        >
          <h3
            className={`text-xl font-semibold mb-2 ${
              asistenciaInfo?.isVigente ? "text-green-800" : "text-red-800"
            }`}
          >
            {asistenciaInfo?.isVigente
              ? `Bienvenido, ${asistenciaInfo?.name}!`
              : `Atención, ${asistenciaInfo?.name}!`}
          </h3>
          <p
            className={`text-gray-600 ${
              asistenciaInfo?.isVigente ? "" : "text-red-600"
            }`}
          >
            {asistenciaInfo?.isVigente
              ? `Su membresía está vigente hasta el ${asistenciaInfo?.formattedExpiration}.`
              : `Su membresía venció el ${asistenciaInfo?.formattedExpiration}. Por favor, renueve.`}
          </p>
          <Button
            className={`mt-4 w-full ${
              asistenciaInfo?.isVigente ? "bg-green-500" : "bg-red-500"
            } text-white`}
            onClick={() => setMostrarcard(false)}
          >
            Cerrar
          </Button>
        </div>
      </CSSTransition>
    </section>
  );
}

export default SignUp;
