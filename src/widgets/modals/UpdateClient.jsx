import {
  Button,
  Option,
  Select,
  Typography,
  Input,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { updateClient } from "@/Api/controllers/Clients";
import toast, { Toaster } from "react-hot-toast";
import { createPaymet } from "@/Api/controllers/Paymet";
export default function UpdateClient({ deleteData, setOpenDelete }) {
  const today = new Date();
  const [formData, setFormData] = useState({
    membershipType: "",
    renewalDate: today,
  });
  const [paymentData, setPaymentData] = useState({
    amount: "",
    currency: "",
  });
  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };
  const handlePaymentDataChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };
  const handleDelete = async (id) => {
    try {
      // Primero, intenta crear el pago
      const paymentResponse = await createPaymet(paymentData);
      if (paymentResponse) {
        toast.success("Pago realizado con éxito!");

        // Si el pago es exitoso, procede a actualizar o renovar el cliente
        const response = await updateClient(id, formData);

        // Verifica si la respuesta es exitosa
        if (response) {
          toast.success("Renovación con éxito!");
          // Opcionalmente, cierra el modal después de un breve retraso
          setTimeout(() => {
            setOpenDelete(false);
          }, 1500);
        } else {
          throw new Error("Error inesperado al renovar el cliente");
        }
      } else {
        throw new Error("Error al realizar el pago");
      }
    } catch (error) {
      // Manejo de errores específicos y notificaciones
      if (error.response) {
        console.error("Server error:", error.response.data);
        toast.error(
          `Error del servidor: ${
            error.response.data.message || "Renovar el cliente"
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

  return (
    <div className="max-w-md mx-auto p-8">
      <Typography className="text-blue-900 text-2xl">
        Confirma renovar a:
      </Typography>
      <Toaster />
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
        <Option value="mensual" style={{ color: "black", fontWeight: "bold" }}>
          Mensual
        </Option>
        <Option value="semanal" style={{ color: "black", fontWeight: "bold" }}>
          Semanal
        </Option>
        <Option
          value="permanente"
          style={{ color: "black", fontWeight: "bold" }}
        >
          Permanente
        </Option>
      </Select>
      <div className="space-y-4 text-black">
        <Select
          label="Moneda de pago"
          value={paymentData.currency}
          onChange={(value) =>
            setPaymentData({ ...paymentData, currency: value })
          }
          required
        >
          <Option className="text-black font-bold	" value="pesos">
            pesos
          </Option>
          <Option className="text-black font-bold	" value="dolares">
            dolares
          </Option>
        </Select>
        <Input
          label="Monto"
          name="amount"
          type="number"
          value={paymentData.amount}
          onChange={handlePaymentDataChange}
          required
        />
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
