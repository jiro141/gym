import { Button, Option, Select, Typography } from "@material-tailwind/react";
import React, { useState } from "react";
import { updateClient } from "@/Api/controllers/Clients";
import toast, { Toaster } from "react-hot-toast";
import { createPaymet } from "@/Api/controllers/Paymet";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Asegúrate de importar el estilo de Calendar
import styles from "./calendar.css";

export default function UpdateClient({ deleteData, setOpenDelete }) {
  const today = new Date();
  const [formData, setFormData] = useState({
    membershipType: "",
    renewalDate: today, // Fecha de renovación por defecto a la fecha actual
  });
  const [paymentData, setPaymentData] = useState({
    amount: "",
    currency: "",
    clientID: "",
  });
  const [showCalendar, setShowCalendar] = useState(false); // Estado para manejar la visibilidad del calendario

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentDataChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  const handleDelete = async (id) => {
    try {
      // Primero, intenta actualizar o renovar el cliente
      const clientResponse = await updateClient(id, formData);

      // Verifica si la respuesta incluye un id válido
      if (id) {
        toast.success("Cliente actualizado con éxito!");

        // Configurar el id del cliente en los datos del pago
        const updatedPaymentData = {
          ...paymentData,
          clientID: id, // Asignar el id del cliente al pago
        };

        // Luego, intenta crear el pago con el id del cliente
        const paymentResponse = await createPaymet(updatedPaymentData,formData.membershipType);
        if (paymentResponse) {
          toast.success("Pago realizado con éxito!");

          // Opcionalmente, cierra el modal después de un breve retraso
          setTimeout(() => {
            setOpenDelete(false);
          }, 1500);
        } else {
          throw new Error("Error al realizar el pago");
        }
      } else {
        throw new Error("Error inesperado al renovar el cliente");
      }
    } catch (error) {
      // Manejo de errores específicos y notificaciones
      if (error.response) {
        console.error("Server error:", error.response.data);
        toast.error(
          `Error del servidor: ${
            error.response.data.message || "No se pudo renovar el cliente"
          }`
        );
      } else if (error.request) {
        console.error("Network error:", error.request);
        toast.error("Error de red: No se pudo contactar al servidor");
      } else {
        console.error("Unexpected error:", error.message);
        toast.error("Error inesperado: " + error.message);
      }
    }
  };

  // Función para manejar la selección de fecha en el calendario
  const handleCalendarChange = (date) => {
    setFormData({
      ...formData,
      renewalDate: date, // Establece la fecha seleccionada en el estado
    });
    setShowCalendar(false); // Cierra el calendario después de seleccionar la fecha
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <Typography className="text-blue-900 text-2xl">
        Confirma renovar a:
      </Typography>
      <Toaster />
      <div className="space-y-4 text-black">
        <Typography className="text-xl py-4">
          {deleteData.firstName} {deleteData.lastName}
        </Typography>
        <Typography className="text-xl py-4">Tipo de membresia</Typography>
        <Select
          label="Tipo de Membresía"
          value={formData.membershipType}
          onChange={(value) => handleSelectChange("membershipType", value)}
          required
        >
          <Option
            value="mensual"
            style={{ color: "black", fontWeight: "bold" }}
          >
            Mensual
          </Option>
          <Option
            value="semanal"
            style={{ color: "black", fontWeight: "bold" }}
          >
            Semanal
          </Option>
          <Option
            value="permanente"
            style={{ color: "black", fontWeight: "bold" }}
          >
            Permanente
          </Option>
        </Select>

        {/* Botón para mostrar el calendario */}
        <div>
          <Button
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full py-2"
          >
            Seleccionar fecha de renovación
          </Button>
          {/* El calendario se superpone aquí */}
          {showCalendar && (
            <div className="absolute bg-white p-2 rounded-lg shadow-md mt-1 z-10">
              <Calendar
                onChange={handleCalendarChange}
                value={formData.renewalDate}
                className={styles["custom-calendar"]} // Aplica el estilo del calendario
              />
            </div>
          )}
        </div>

        <Select
          label="Moneda de pago"
          value={paymentData.currency}
          onChange={(value) =>
            setPaymentData({ ...paymentData, currency: value })
          }
          required
        >
          <Option className="text-black font-bold" value="pesos">
            pesos
          </Option>
          <Option className="text-black font-bold" value="dolares">
            dolares
          </Option>
        </Select>
      </div>
      <Button
        className="my-4"
        color="green"
        onClick={() => handleDelete(deleteData.id)}
      >
        Confirmar
      </Button>
    </div>
  );
}
