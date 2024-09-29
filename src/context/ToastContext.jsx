import React, { createContext, useContext, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

// Creamos el contexto de Toast
const ToastContext = createContext();

// Proveedor del contexto de Toast para que esté disponible globalmente
export const ToastProvider = ({ children }) => {
    const [globalToastData, setGlobalToastData] = useState(null);

    // Función para disparar un toast de éxito globalmente
    const showGlobalSuccessToast = (firstName, formattedDate) => {
        const message = `¡Bienvenido ${firstName}!`;
        setGlobalToastData({ type: "success", message, date: formattedDate });

        // Mostrar el toast
        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-lg w-full bg-green-500 text-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="ml-3 flex-1">
                            <p className="text-lg font-bold">
                                ¡Bienvenido {firstName}!
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
    };

    // Función para disparar un toast de error globalmente
    const showGlobalErrorToast = (message) => {
        setGlobalToastData({ type: "error", message });

        // Mostrar el toast de error
        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-lg w-full bg-red-500 text-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
                <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                        <div className="ml-3 flex-1">
                            <p className="text-lg font-bold">
                                {message}
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
    };

    return (
        <ToastContext.Provider value={{ showGlobalSuccessToast, showGlobalErrorToast, globalToastData }}>
            <Toaster />
            {children}
        </ToastContext.Provider>
    );
};

// Hook para usar el contexto del toast en cualquier parte de la aplicación
export const useToast = () => useContext(ToastContext);
