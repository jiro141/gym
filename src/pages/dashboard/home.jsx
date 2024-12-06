import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  CardHeader,
  CardBody,
  Input,
  Select,
  Option,
  Progress,
} from "@material-tailwind/react";
import { ClockIcon } from "@heroicons/react/24/solid";
import {
  getPaymetDayPesos,
  getPaymetDayDolares,
  getPaymetWeekPesos,
  getPaymetWeekDolares,
  createPaymet,
  getGroudPaymet,
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
  const [pagos, setPagos] = useState();
  const [pagosFiltrados, setPagosFiltrados] = useState([]);
  // Estado para los datos de pago actuales
  const [paymentData, setPaymentData] = useState({
    amount: "",
    currency: "",
  });

  // Actualiza el monto automáticamente al cambiar la moneda
  useEffect(() => {
    if (paymentData.currency) {
      const amountsByCurrency = {
        pesos: 4000,
        dolares: 1,
      };

      const amount = amountsByCurrency[paymentData.currency] || "";
      setPaymentData((prevData) => ({ ...prevData, amount }));
    }
  }, [paymentData.currency]);

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
  const pagosx = async () => {
    const res = await getGroudPaymet();
    return res; // Traemos los datos de pagos
  };

  useEffect(() => {
    const loadPagos = async () => {
      try {
        const res = await pagosx(); // Esperamos que los pagos se carguen
        setPagos(res); // Actualizamos el estado de los pagos

        // Organizar los pagos
        const pagosOrganizados = res.map((grupo) => {
          const { client, payments } = grupo;

          if (client === "visitante") {
            // Si el cliente es "visitante", mostramos todos los pagos ordenados
            const pagosOrdenados = payments.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // Ordenamos por fecha
            );
            return {
              client,
              payments: pagosOrdenados, // Todos los pagos del visitante ordenados
            };
          } else {
            // Si el cliente no es "visitante", solo mostramos el pago más reciente
            const pagosOrdenados = payments.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            return {
              client,
              payments: [pagosOrdenados[0]], // Solo el pago más reciente
            };
          }
        });

        // Actualizamos el estado de pagos filtrados
        setPagosFiltrados(pagosOrganizados);
      } catch (error) {
        console.error("Error cargando los pagos:", error);
      }
    };

    loadPagos(); // Llamamos a la función para cargar los pagos y organizar los datos
  }, [refreshData]); // Dependencia para recargar los pagos cuando `refreshData` cambie

  // Se ejecuta cada vez que cambian los pagos
  // Hook para obtener datos iniciales y cada vez que se refrescan
  useEffect(() => {
    pagosx();
    const fetchPaymentData = async () => {
      // Obtener datos diarios en pesos
      const paymentData = await getPaymetDayPesos();
      setMontoDiaPesos(paymentData?.map((payment) => payment.totalPayments));

      // Obtener abreviatura de días
      const diasAbreviadosArray = paymentData?.map((payment) => {
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
          {/* <Input
            className="bg-white"
            label="Monto"
            name="amount"
            type="number"
            value={paymentData.amount}
            onChange={handlePaymentDataChange}
            required
          /> */}
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
      <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm mb-3">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6"
        >
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-1">
              Pagos del dia de hoy
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            ></Typography>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Cliente", "Fecha", "moneda", "monto"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-6 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[15px] font-medium uppercase text-blue-gray-900"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados?.map((grupo, index) => {
                const { client, payments } = grupo;

                // Aquí generamos la clase para cada fila, asegurando que las últimas filas no tengan borde
                const className = `py-3 px-5 ${
                  index === pagosFiltrados.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;

                return (
                  <>
                    {/* Si el cliente es "visitante", renderizamos todos los pagos */}
                    {client === "visitante" ? (
                      payments.map((payment, subIndex) => {
                        return (
                          <tr key={`${client}-${subIndex}`}>
                            <td className={className}>
                              <div className="flex items-center gap-4">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-bold"
                                >
                                  {client}{" "}
                                  {/* Mostramos el nombre del cliente */}
                                </Typography>
                              </div>
                            </td>

                            <td className={className}>
                              <div className="w-10/12">
                                <Typography
                                  variant="small"
                                  className="mb-1 block text-x font-medium text-blue-gray-600"
                                >
                                  {new Date(payment.createdAt).toLocaleString()}{" "}
                                  {/* Mostramos la fecha del pago */}
                                </Typography>
                              </div>
                            </td>

                            <td className={className}>
                              <Typography
                                variant="small"
                                className="text-x font-medium text-blue-gray-600"
                              >
                                {payment.currency} {/* Mostramos la moneda */}
                              </Typography>
                            </td>

                            <td className={className}>
                              <Typography
                                variant="small"
                                className="text-x font-medium text-green-600"
                              >
                               $ {payment.amount} {/* Mostramos el monto */}
                              </Typography>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      // Si no es "visitante", solo mostramos el pago más reciente
                      <tr key={client}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {client} {/* Mostramos el nombre del cliente */}
                            </Typography>
                          </div>
                        </td>

                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-x font-medium text-blue-gray-600"
                            >
                              {new Date(payments[0].createdAt).toLocaleString()}{" "}
                              {/* Mostramos la fecha del pago */}
                            </Typography>
                          </div>
                        </td>

                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-x font-medium text-blue-gray-600"
                          >
                            {payments[0].currency} {/* Mostramos la moneda */}
                          </Typography>
                        </td>

                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-x font-medium text-green-600"
                          >
                          $  {payments[0].amount} {/* Mostramos el monto */}
                          </Typography>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
      {/* <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
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
      </div> */}
    </div>
  );
}

export default Home;
