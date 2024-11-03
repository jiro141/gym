import React, { useState, useRef, useEffect } from "react";
import { Button, Typography } from "@material-tailwind/react";
import * as faceapi from "face-api.js";
import toast, { Toaster } from "react-hot-toast";
export function FaceDetection({ firstName, setFirstName, showFaceDetection, setShowFaceDetection }) {
    const [previewImage, setPreviewImage] = useState(null); // Estado para la vista previa de la imagen capturada
    const [faceDetected, setFaceDetected] = useState(false); // Estado para indicar si se detectó un rostro
    const [faceDescriptor, setFaceDescriptor] = useState(null); // Estado para guardar el descriptor del rostro
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Cargar modelos de detección y configurar el video
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

    // Detectar rostro, capturar imagen y descriptor de vista previa
    const detectFace = async () => {
        if (videoRef.current) {
            const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();
            if (detection) {
                captureImage();
                setFaceDescriptor(detection.descriptor); // Guarda el descriptor del rostro
                setFaceDetected(true);
            }
        }
    };

    // Capturar imagen de vista previa
    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext("2d");
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            setPreviewImage(canvas.toDataURL("image/png"));
        }
    };

    // Reiniciar la detección para intentar nuevamente
    const handleRetry = () => {
        setFaceDetected(false);
        setPreviewImage(null);
        setFaceDescriptor(null);
        detectFace(); // Llama a detectFace inmediatamente para reanudar la detección
    };

    // Guardar la imagen y descriptor capturado
    const handleSave = () => {
        if (faceDescriptor) {
            setFirstName(faceDescriptor)
            toast.success("Rostro captado con éxito!");
            setTimeout(() => {
                setShowFaceDetection(false);
            }, 1500);
        } else {
            toast.error("Error al captar rostro!");
        }
    };

    // Iniciar detección continua
    useEffect(() => {
        const interval = setInterval(() => {
            if (!faceDetected) detectFace();
        }, 1000); // Detección cada segundo
        return () => clearInterval(interval);
    }, [faceDetected]);

    return (
        <section className="m-8">
            <Toaster />
            <div className="w-5/5 hidden lg:block">
                {previewImage ? (
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="h-[40vh] w-full object-cover rounded-3xl"
                    />
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="h-[40vh] w-full object-cover rounded-3xl"
                    />
                )}
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <div className="w-full lg:w-5/5 flex flex-col items-center justify-center">
                    <div className="text-center">
                        <Typography variant="h2" className="font-bold mb-4">Detección de Rostros</Typography>
                        <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
                            {faceDetected ? "¿Es esta la imagen correcta?" : "Detectando rostro..."}
                        </Typography>
                    </div>
                    {faceDetected && (
                        <div className="flex gap-4 mt-4">
                            <Button className="bg-green-500" onClick={handleSave}>Guardar</Button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default FaceDetection;
