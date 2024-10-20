import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { getPaymetDayPesos } from "@/Api/controllers/Paymet";
import { getPaymetDayDolares } from "@/Api/controllers/Paymet";
import { getPaymetWeekPesos } from "@/Api/controllers/Paymet";
import { getPaymetWeekDolares } from "@/Api/controllers/Paymet";
import { chartsConfig } from "@/configs";

export function Home() {
  const [montoDiaPesos, setMontoDiaPesos] = useState([]);
  const [diasAbreviados, setDiasAbreviados] = useState([]);
  const [montoDiaDolares, setMontoDiaDolares] = useState([]);
  const [diasAbreviadosD, setDiasAbreviadosD] = useState([]);
  const [weekPesos, setWeekPesos] = useState([])
  const [weekDolares, setWeekDolares] = useState([])
  useEffect(() => {
    const fetchPaymentData = async () => {
      const paymentData = await getPaymetDayPesos();

      // Extraer los valores de totalPayments
      const totalPaymentsArray = paymentData.map(payment => payment.totalPayments);
      setMontoDiaPesos(totalPaymentsArray);

      // Convertir la fecha a la abreviatura del día en español
      const diasAbreviadosArray = paymentData.map(payment => {
        const fecha = new Date(payment.date);
        const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

        // Obtener el día de la semana (0 = Domingo, 6 = Sábado)
        return diasSemana[fecha.getDay()];
      });

      // Obtener datos de dólares
      const paymentDataDolares = await getPaymetDayDolares();
      const totalPaymentsArrayDolares = paymentDataDolares.map(payment => payment.totalPayments);
      setMontoDiaDolares(totalPaymentsArrayDolares);

      const diasAbreviadosArrayD = paymentDataDolares.map(payment => {
        const fecha = new Date(payment.date);
        const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

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
      const currentWeekPayments = paymetDataWeekPesos.filter(payment => payment.week === currentWeek.toString());
      const currentWeekPaymentsDolares = paymetDataWeekDolares.filter(payment => payment.week === currentWeek.toString());
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
  }, []); // Ejecutar solo cuando el componente se monta




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
      <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex  justify-between">
        <Typography variant="h6" color="white">
          Clientes
        </Typography>
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
                <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
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
