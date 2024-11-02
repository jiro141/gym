import { useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Asistencia } from "@/Api/controllers/Asistencia";
import { useState, useRef, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import * as faceapi from "face-api.js";

export function SignUp() {
  const [idNumber, setIdNumber] = useState("");
  const [faceDescriptor, setFaceDescriptor] = useState(null); // Estado para guardar el descriptor del rostro actual
  const [lastSentDescriptor, setLastSentDescriptor] = useState(null); // Estado para el último descriptor enviado
  const videoRef = useRef(null);
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const navigate = useNavigate();

  // Cargar modelos y configurar video al montar el componente
  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model";
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

  // Función para verificar si dos descriptores son diferentes
  const isNewDescriptor = (descriptor1, descriptor2) => {
    if (!descriptor1 || !descriptor2) return true;
    return !descriptor1.every((value, index) => value === descriptor2[index]);
  };

  // Función para enviar asistencia
  const asistencia = async () => {
    try {
      // Determina si se envía el idNumber o el faceDescriptor
      const dataToSend = idNumber
        ? { idNumber }
        : faceDescriptor
        ? { fingerprintData: faceDescriptor }
        : null;

      if (!dataToSend) {
        toast.error("Cédula o rostro no detectados");
        return;
      }

      const asistente = await Asistencia(dataToSend); // Enviar `idNumber` o `faceDescriptor` según corresponda

      if (asistente && asistente.expirationDate) {
        const expirationDate = new Date(asistente.expirationDate);
        if (expirationDate >= today) {
          toast.success(`¡Bienvenido ${asistente.firstName}!`);
        } else {
          toast.error("Tu membresía ha expirado.");
        }
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

  // Detección de rostros y guardado del descriptor
  const detectFace = async () => {
    if (videoRef.current) {
      const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
      if (detection) {
        const newDescriptor = Array.from(detection.descriptor); // Convertimos el descriptor a Array

        if (isNewDescriptor(newDescriptor, lastSentDescriptor)) {
          setFaceDescriptor(newDescriptor); // Guarda el descriptor del rostro actual en el estado
          setLastSentDescriptor(newDescriptor); // Actualiza el último descriptor enviado
          console.log("Nuevo descriptor detectado y enviado:", newDescriptor);

          // Llama a la función de asistencia automáticamente
          asistencia();
        }
      } else {
        console.log("No se detectó ningún rostro.");
      }
    }
  };

  // Llamamos a la detección de rostros cada segundo
  useEffect(() => {
    const interval = setInterval(detectFace, 1000); // Detectar cada segundo
    return () => clearInterval(interval); // Limpieza al desmontar el componente
  }, [lastSentDescriptor]);

  const handleNavigate = () => {
    navigate("/dashboard/tables");
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
          <Typography variant="h2" className="font-bold mb-4">Asistencia</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Ingresa tu número de cédula o espera la detección de rostro
          </Typography>
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
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
          </div>
          <Button className="mt-6" fullWidth onClick={asistencia}>
            Asistencia
          </Button>
        </form>
        <Button className="mt-6" onClick={handleNavigate}>Regresar</Button>
      </div>
    </section>
  );
}

export default SignUp;
