import React, { useEffect, useState } from "react";
import {
  Typography,
  CardHeader,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { ClockIcon } from "@heroicons/react/24/solid";
import {
  getPaymetDayPesos,
  getPaymetDayDolares,
  getPaymetWeekPesos,
  getPaymetWeekDolares,
  createPaymet,
} from "@/Api/controllers/Paymet";
import toast, { Toaster } from "react-hot-toast";
import { chartsConfig } from "@/configs";
import { StatisticsChart } from "@/widgets/charts";

export function Home() {
  // Estados para almacenar datos diarios y semanales de pesos y dólares
  const [montoDiaPesos, setMontoDiaPesos] = useState([]);
  const [diasAbreviados, setDiasAbreviados] = useState([]);
  const [montoDiaDolares, setMontoDiaDolares] = useState([]);
  const [diasAbreviadosD, setDiasAbreviadosD] = useState([]);
  const [weekPesos, setWeekPesos] = useState([]);
  const [weekDolares, setWeekDolares] = useState([]);

  // Estado para los datos de pago actuales
  const [paymentData, setPaymentData] = useState({
    amount: "",
    currency: "",
  });

  // Función para manejar cambios en los campos de pago
  const handlePaymentDataChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  // Estado para refrescar datos después de una actualización de pago
  const [refreshData, setRefreshData] = useState(false);

  // Función para enviar datos de pago
  const submitPaymentData = async () => {
    try {
      const response = await createPaymet(paymentData);
      if (response) {
        toast.success("Pago realizado con éxito!");
        setRefreshData((prev) => !prev); // Refresca los datos
        setPaymentData({ amount: "", currency: "" }); // Limpia los campos de pago
      } else {
        throw new Error("Error inesperado al procesar el pago");
      }
    } catch (error) {
      toast.error(error.message || "Error inesperado al realizar el pago");
    }
  };

  // Hook para obtener datos iniciales y cada vez que se refrescan
  useEffect(() => {
    const fetchPaymentData = async () => {
      // Obtener datos diarios en pesos
      const paymentData = await getPaymetDayPesos();
      setMontoDiaPesos(paymentData.map((payment) => payment.totalPayments));

      // Obtener abreviatura de días
      const diasAbreviadosArray = paymentData.map((payment) => {
        const fecha = new Date(payment.date);
        const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
        return diasSemana[fecha.getDay()];
      });
      setDiasAbreviados(diasAbreviadosArray);

      // Obtener datos diarios en dólares
      const paymentDataDolares = await getPaymetDayDolares();
      setMontoDiaDolares(
        paymentDataDolares.map((payment) => payment.totalPayments)
      );

      const diasAbreviadosArrayD = paymentDataDolares.map((payment) => {
        const fecha = new Date(payment.date);
        const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
        return diasSemana[fecha.getDay()];
      });
      setDiasAbreviadosD(diasAbreviadosArrayD);

      // Obtener datos semanales en pesos y dólares
      const paymetDataWeekPesos = await getPaymetWeekPesos();
      const paymetDataWeekDolares = await getPaymetWeekDolares();

      setWeekPesos(paymetDataWeekPesos);
      setWeekDolares(paymetDataWeekDolares);
    };

    fetchPaymentData();

    const intervalId = setInterval(fetchPaymentData, 300000); // Refresca cada 5 minutos
    return () => clearInterval(intervalId);
  }, [refreshData]);

  // Función para obtener el último valor de `totalPayments`
  const getLastTotalPayment = (array) =>
    array.length > 0 ? array[array.length - 1].totalPayments : 0;

  // Variables para el último pago semanal en pesos y dólares

  const lastTotalPayment = getLastTotalPayment(weekPesos);
  const lastTotalPaymentDolares = getLastTotalPayment(weekDolares);

  // Configuración de gráficos
  const graficoDiaPesos = {
    type: "line",
    height: 220,
    series: [{ name: "Monto en pesos", data: montoDiaPesos }],
    options: {
      ...chartsConfig,
      colors: ["#0288d1"],
      stroke: { lineCap: "round" },
      markers: { size: 5 },
      xaxis: { ...chartsConfig.xaxis, categories: diasAbreviados },
    },
  };

  const graficoDiaDolares = {
    type: "line",
    height: 220,
    series: [{ name: "Monto en dólares", data: montoDiaDolares }],
    options: {
      ...chartsConfig,
      colors: ["#388e3c"],
      stroke: { lineCap: "round" },
      markers: { size: 5 },
      xaxis: { ...chartsConfig.xaxis, categories: diasAbreviadosD },
    },
  };

  // Datos para las tarjetas de estadísticas
  const statisticsChartsData = [
    {
      color: "white",
      title: "Ingreso en pesos",
      description: `Total de ingresos esta semana: ${lastTotalPayment} $`,
      footer: "Actualizado hace 4 minutos",
      chart: graficoDiaPesos,
    },
    {
      color: "white",
      title: "Ingreso en dólares",
      description: `Total de ingresos esta semana: ${lastTotalPaymentDolares} $`,
      footer: "Actualizado recientemente",
      chart: graficoDiaDolares,
    },
  ];

  return (
    <div className="mt-12">
      <Toaster />
      <CardHeader
        variant="gradient"
        color="gray"
        className="mb-8 p-6 flex justify-between overflow-visible"
      >
        <Typography variant="h6" color="white">
          Clientes diarios
        </Typography>
        <div className="space-x-4 text-black flex relative">
          <Select
            className="bg-white z-10"
            label="Moneda de pago"
            value={paymentData.currency}
            onChange={(value) =>
              setPaymentData({ ...paymentData, currency: value })
            }
            required
          >
            <Option value="pesos">pesos</Option>
            <Option value="dolares">dolares</Option>
          </Select>
          <Input
            className="bg-white"
            label="Monto"
            name="amount"
            type="number"
            value={paymentData.amount}
            onChange={handlePaymentDataChange}
            required
          />
          <button
            className="p-1 m-0 w-16 flex bg-yellow-400 rounded-md"
            onClick={submitPaymentData}
          >
            <Typography variant="h6" color="black">
              Pagar
            </Typography>
          </button>
        </div>
      </CardHeader>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon
                  strokeWidth={2}
                  className="h-4 w-4 text-blue-gray-400"
                />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
