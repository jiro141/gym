import React, { useEffect, useState } from "react";
import {
  Typography,
  CardHeader,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { getPaymetDayPesos } from "@/Api/controllers/Paymet";
import { getPaymetDayDolares } from "@/Api/controllers/Paymet";
import { getPaymetWeekPesos } from "@/Api/controllers/Paymet";
import { getPaymetWeekDolares } from "@/Api/controllers/Paymet";
import { chartsConfig } from "@/configs";
import { createPaymet } from "@/Api/controllers/Paymet";
import toast, { Toaster } from "react-hot-toast";

export function Home() {
  const [montoDiaPesos, setMontoDiaPesos] = useState([]);
  const [diasAbreviados, setDiasAbreviados] = useState([]);
  const [montoDiaDolares, setMontoDiaDolares] = useState([]);
  const [diasAbreviadosD, setDiasAbreviadosD] = useState([]);
  const [weekPesos, setWeekPesos] = useState([]);
  const [weekDolares, setWeekDolares] = useState([]);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    currency: "",
  });
  const handlePaymentDataChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };
  const [refreshData, setRefreshData] = useState(false);

  const submitPaymentData = async () => {
    try {
      // Llamada a la función `createPayment` con `paymentData`
      const response = await createPaymet(paymentData);

      // Verifica si la respuesta es exitosa
      if (response) {
        toast.success("Pago realizado con éxito!");
        // Cambia el estado para disparar el useEffect nuevamente
        setRefreshData((prev) => !prev);
      } else {
        throw new Error("Error inesperado al procesar el pago");
      }
    } catch (error) {
      // Manejo de errores con un mensaje de notificación
      toast.error(error.message || "Error inesperado al realizar el pago");
    }
  };

  useEffect(() => {
    const fetchPaymentData = async () => {
      const paymentData = await getPaymetDayPesos();

      // Extraer los valores de totalPayments
      const totalPaymentsArray = paymentData.map(
        (payment) => payment.totalPayments
      );
      setMontoDiaPesos(totalPaymentsArray);

      // Convertir la fecha a la abreviatura del día en español
      const diasAbreviadosArray = paymentData.map((payment) => {
        const fecha = new Date(payment.date);
        const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

        // Obtener el día de la semana (0 = Domingo, 6 = Sábado)
        return diasSemana[fecha.getDay()];
      });

      // Obtener datos de dólares
      const paymentDataDolares = await getPaymetDayDolares();
      const totalPaymentsArrayDolares = paymentDataDolares.map(
        (payment) => payment.totalPayments
      );
      setMontoDiaDolares(totalPaymentsArrayDolares);

      const diasAbreviadosArrayD = paymentDataDolares.map((payment) => {
        const fecha = new Date(payment.date);
        const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

        // Obtener el día de la semana (0 = Domingo, 6 = Sábado)
        return diasSemana[fecha.getDay()];
      });

      // Guardar las abreviaturas de los días en el estado
      setDiasAbreviados(diasAbreviadosArray);
      setDiasAbreviadosD(diasAbreviadosArrayD);

      // Función para calcular la semana del año
      const getWeekNumber = (date) => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
      };

      // Obtener datos de pagos de la semana en pesos
      const paymetDataWeekPesos = await getPaymetWeekPesos();
      const paymetDataWeekDolares = await getPaymetWeekDolares();

      // Obtener la semana actual
      const currentWeek = getWeekNumber(new Date());

      // Filtrar los datos de la semana actual
      const currentWeekPayments = paymetDataWeekPesos.filter(
        (payment) => payment.week === currentWeek.toString()
      );
      const currentWeekPaymentsDolares = paymetDataWeekDolares.filter(
        (payment) => payment.week === currentWeek.toString()
      );

      // Establecer los datos filtrados
      setWeekPesos(currentWeekPayments);
      setWeekDolares(currentWeekPaymentsDolares);
    };

    // Ejecutar la función inicialmente
    fetchPaymentData();

    // Crear un intervalo que ejecute la función cada 5 minutos (300,000 milisegundos)
    const intervalId = setInterval(() => {
      fetchPaymentData();
    }, 300000); // 300,000 ms = 5 minutos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [refreshData]); // Dependencia en refreshData
  // Ejecutar solo cuando el componente se monta

  const graficoDiaDolares = {
    type: "line",
    height: 220,
    series: [
      {
        name: "Monto dolares",
        data: montoDiaDolares,
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#388e3c"],
      stroke: {
        lineCap: "round",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: diasAbreviadosD,
      },
    },
  };
  const graficoDiaPesos = {
    type: "line",
    height: 220,
    series: [
      {
        name: "Monto en pesos",
        data: montoDiaPesos,
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#0288d1"],
      stroke: {
        lineCap: "round",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: diasAbreviados,
      },
    },
  };

  const asistenciaDia = {
    type: "bar",
    height: 220,
    series: [
      {
        name: "Views",
        data: [50, 20, 10, 22, 50, 10, 40],
      },
    ],
    options: {
      ...chartsConfig,
      colors: "#388e3c",
      plotOptions: {
        bar: {
          columnWidth: "16%",
          borderRadius: 5,
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: ["M", "T", "W", "T", "F", "S", "S"],
      },
    },
  };

  const statisticsChartsData = [
    {
      color: "white",
      title: "Ingreso en pesos",
      description: `Total de ingresos esta semana ${weekPesos[0]?.totalPayments} $`,
      footer: "updated 4 min ago",
      chart: graficoDiaPesos,
    },
    {
      color: "white",
      title: "Ingreso en dolares",
      description: `Total de ingresos esta semana ${weekDolares[0]?.totalPayments} $`,
      footer: "just updated",
      chart: graficoDiaDolares,
    },
    {
      color: "white",
      title: "Website View",
      description: "Last Campaign Performance",
      footer: "campaign sent 2 days ago",
      chart: asistenciaDia,
    },
  ];
  return (
    <div className="mt-12">
      <Toaster />
      <CardHeader
        variant="gradient"
        color="gray"
        className="mb-8 p-6 flex justify-between overflow-visible" // Permite el desbordamiento
      >
        <Typography variant="h6" color="white">
          Clientes diarios
        </Typography>
        <div className="space-x-4 text-black flex relative">
          <Select
            className="bg-white z-10" // z-index para superponer
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

          <Input
            className="bg-white" // Fondo blanco
            label="Monto"
            name="amount"
            type="number"
            value={paymentData.amount}
            onChange={handlePaymentDataChange}
            required
          />
          <button
            className="p-1 m-0 w-16 flex bg-yellow-400 rounded-md "
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
