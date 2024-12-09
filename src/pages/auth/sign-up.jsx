import { useNavigate } from "react-router-dom";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { Asistencia } from "@/Api/controllers/Asistencia";
import { useState, useRef, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as faceapi from "face-api.js";

export function SignUp() {
  const [idNumber, setIdNumber] = useState("");
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [lastSentDescriptor, setLastSentDescriptor] = useState(null);
  const [asistenciaInfo, setAsistenciaInfo] = useState(null); // Estado para la información de asistencia
  const videoRef = useRef(null);
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      const MODEL_URL =
        "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error al acceder a la cámara:", error);
      }
    };

    loadModelsAndStartVideo();
  }, []);

  const asistencia = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    try {
      const dataToSend = idNumber
        ? { idNumber }
        : faceDescriptor
        ? { fingerprintData: faceDescriptor }
        : null;

      if (!dataToSend) {
        toast.error("Cédula o rostro no detectados");
        return;
      }

      const asistente = await Asistencia(dataToSend);

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
      } else {
        toast.error("No se encontró el cliente.");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Cliente no existe.");
      } else {
        toast.error("Ocurrió un error inesperado.");
      }
    }
  };

  return (
    <section className="m-8 flex">
      <Toaster />
      {/* Video para detección facial */}
      <div className="w-2/5 h-full hidden lg:block">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="h-[80vh] w-full object-cover rounded-3xl"
        />
      </div>

      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Asistencia
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Ingresa tu número de cédula o espera la detección de rostro
          </Typography>
        </div>
        <form
          className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
          onSubmit={(e) => {
            e.preventDefault();
            asistencia(e);
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
            Asistencia
          </Button>
        </form>

        <Button className="mt-6" onClick={() => navigate("/dashboard/tables")}>
          Regresar
        </Button>
      </div>

      {asistenciaInfo && (
        <div
          className={`fixed top-[80%] lg:left-[25%] lg:top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 shadow-lg rounded-lg p-6 w-96 z-50 ${
            asistenciaInfo.isVigente ? "bg-green-50" : "bg-red-50"
          } border`}
        >
          <h3
            className={`text-xl font-semibold mb-2 ${
              asistenciaInfo.isVigente ? "text-green-800" : "text-red-800"
            }`}
          >
            {asistenciaInfo.isVigente
              ? `Bienvenido, ${asistenciaInfo.name}!`
              : `Atención, ${asistenciaInfo.name}!`}
          </h3>
          <p
            className={`text-gray-600 ${
              asistenciaInfo.isVigente ? "" : "text-red-600"
            }`}
          >
            {asistenciaInfo.isVigente
              ? `Su membresía está vigente hasta el ${asistenciaInfo.formattedExpiration}.`
              : `Su membresía venció el ${asistenciaInfo.formattedExpiration}. Por favor, renueve.`}
          </p>
          <Button
            className={`mt-4 w-full ${
              asistenciaInfo.isVigente ? "bg-green-500" : "bg-red-500"
            } text-white`}
            onClick={() => setAsistenciaInfo(null)}
          >
            Cerrar
          </Button>
        </div>
      )}
    </section>
  );
}

export default SignUp;
