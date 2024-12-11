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
import { use } from "react";

export function Home() {
  // Estados para almacenar datos diarios y semanales de pesos y dólares
  const [montoDiaPesos, setMontoDiaPesos] = useState([]);
  const [diasAbreviados, setDiasAbreviados] = useState([]);
  const [montoDiaDolares, setMontoDiaDolares] = useState([]);
  const [diasAbreviadosD, setDiasAbreviadosD] = useState([]);
  const [weekPesos, setWeekPesos] = useState([]);
  const [weekDolares, setWeekDolares] = useState([]);
  const [pagos, setPagos] = useState();
  //Estados filtro  de los pagos by cliente
  const [pagosFiltrados, setPagosFiltrados] = useState([]);
  const [terminoAFiltrar, setTerminoAFiltrar] = useState("");
  // Estado filtro by date
  const [filterDesde, setFilterDesde] = useState(0);
  const [filterHasta, setFilterHasta] = useState(0);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    currency: "",
  });
  //suma total en pesos del dia de hoy
  const [totalPesosHoy, setTotalPesosHoy] = useState(0);
  //today
  const [hoy, setHoy] = useState(null);
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

    filtrarPagosPorFecha();
  }, [filterDesde, filterHasta, paymentData.currency]);

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

        //calculamos la suma del dia de hoy
        //sacamos solo la fecha y el monto de pago...
        const nestedArray = pagosOrganizados.map((cliente) => cliente.payments);
        //aplanamos el arreglo para sacar solo los pagos
        const flattenedArray = nestedArray.reduce((acc, curr) => {
          return acc.concat(
            curr.map((item) => ({
              date: item.createdAt,
              pago: item.amount,
            }))
          );
        }, []);

        //sacamos solos los pagos que correspondan al dia de hoy
        function obtenerElementosDeHoy(arrayDeObjetos) {
          const hoy = new Date();
          const anioHoy = hoy.getFullYear();
          const mesHoy = hoy.getMonth() + 1; // Los meses en JavaScript comienzan en 0
          const diaHoy = hoy.getDate();

          return arrayDeObjetos.filter((objeto) => {
            const fechaObjeto = new Date(objeto.date);
            const anioObjeto = fechaObjeto.getFullYear();
            const mesObjeto = fechaObjeto.getMonth() + 1;
            const diaObjeto = fechaObjeto.getDate();

            return (
              anioObjeto === anioHoy &&
              mesObjeto === mesHoy &&
              diaObjeto === diaHoy
            );
          });
        }
        //sumamos los pagos solo de hoy
        const sumPagosHoy = obtenerElementosDeHoy(flattenedArray).reduce(
          (accmonto, monto) => accmonto + monto.pago,
          0
        );
        //console.log("ESTO SON TODOS LOS PAGOS: ", flattenedArray);
        //console.log(sumPagosHoy);
        //seteamos el dia de hoy
        function obtenerFechaYDia() {
          const fecha = new Date();

          const diasSemana = [
            "Domingo",
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
          ];
          const diaSemana = diasSemana[fecha.getDay()];

          const dia = fecha.getDate().toString().padStart(2, "0");
          const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
          const anio = fecha.getFullYear();

          return `${diaSemana}`;
        }
        setHoy(obtenerFechaYDia);
        setTotalPesosHoy(sumPagosHoy);
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
      totalDias: `Total de ingresos hoy ${hoy} : ${totalPesosHoy}`,
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

  const safePagos = Array.isArray(pagos) ? pagos : [];

  // Aplanamos los pagos de todos los clientes en un solo array
  const allPayments = safePagos.flatMap((grupo) => {
    // Verificamos que 'grupo.payments' sea un array con al menos un pago
    if (Array.isArray(grupo.payments) && grupo.payments.length > 0) {
      return grupo.payments.map((payment) => ({
        client: grupo.client,
        ...payment,
      }));
    }
    return []; // Si no hay pagos, devolvemos un array vacío
  });

  // Ordenamos todos los pagos por fecha (del más reciente al más antiguo)
  const sortedPayments = allPayments
    .map((payment) => ({
      ...payment,
      // Si 'createdAt' no es nulo, formateamos la fecha y hora
      createdAt: payment.createdAt
        ? (() => {
            const date = new Date(payment.createdAt);
            const formattedDate = date.toLocaleDateString("es-ES", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
            const formattedTime = date.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            return `${formattedDate} ${formattedTime}`;
          })()
        : null, // Si 'createdAt' es nulo, lo dejamos igual
    }))
    .sort((a, b) => {
      // Ordenamos las fechas, considerando que algunas pueden ser nulas
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0); // Fechas nulas se consideran antiguas
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA; // Orden descendente
    });

  // Estado para la página actual y los pagos por página
  const [currentPage, setCurrentPage] = useState(1);
  const pagosPorPagina = 10;

  // Calcular el total de páginas
  const totalPages = Math.ceil(sortedPayments.length / pagosPorPagina);

  // Función para cambiar de página
  const changePage = (page) => {
    setCurrentPage(page);
  };

  // Obtener los pagos para la página actual
  const getPaginatedData = () => {
    let data = 0;
    if (terminoAFiltrar || filterDesde || filterHasta) {
      //data se convierte en el areglo filtrado
      data = pagosFiltrados;

      //setear a la pagina 1
    } else {
      //data s econvierte en el arreglo sin filtro
      const startIndex = (currentPage - 1) * pagosPorPagina;
      const endIndex = startIndex + pagosPorPagina;
      data = sortedPayments;
      return data.slice(startIndex, endIndex);
    }
    return data;
  };

  const filtrarPagosPorNombres = (e) => {
    const terminoDeBusqueda = e.target.value.toLowerCase(); // Asegúrate de comparar en minúsculas
    setTerminoAFiltrar(terminoDeBusqueda);

    const clientesFiltradosSegunElNombre = sortedPayments.filter((cliente) =>
      cliente.client.toLowerCase().includes(terminoDeBusqueda)
    );

    setPagosFiltrados(clientesFiltradosSegunElNombre);
    //seteamos ala pagina uno para ver el fitro
    setCurrentPage(1);
  };
  //controla el filtro de fecha
  const filtrarPagosPorFecha = () => {
    if (filterDesde == filterHasta && filterDesde != 0 && filterHasta != 0) {
      console.log(filterHasta);
      //COmo es igual no queda espacio para ningun registro entre los dias
      //Toca sumar un dia a la fecha hasta
      const [day, month, year] = filterHasta.split("/");
      const sumarDia = parseInt(day) + 1;
      console.log(sumarDia);
      setFilterHasta(`${sumarDia}/${month}/${year}`);
    }

    // Convertir filtros a fechas (si existen)
    const desde = filterDesde ? new Date(filterDesde) : null;
    const hasta = filterHasta ? new Date(filterHasta) : null;

    const pagosFiltradosPorFecha = sortedPayments.filter((payment) => {
      const fechaPago = new Date(payment.createdAt);
      // Validar ambos filtros
      if (desde && hasta) {
        return fechaPago >= desde && fechaPago <= hasta;
      }

      // Validar solo el filtro "Desde"
      if (desde) {
        return fechaPago >= desde;
      }

      // Validar solo el filtro "Hasta"
      if (hasta) {
        return fechaPago <= hasta;
      }
      // Si no hay filtros, incluir todos los pagos
      return true;
    });
    setCurrentPage(1);
    //console.log("YA ESTAN FILTRADOS ", pagosFiltradosPorFecha);
    setPagosFiltrados(pagosFiltradosPorFecha);
  };

  // Función para formatear una fecha yyyy-mm-dd a dd/mm/yyyy
  const formatDateToDDMMYYYY = (value) => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  };

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
          <form className="px-5 flex flex-row items-center justify-start gap-3 mb-4">
            {/*Joan inserto esto xD */}
            <label htmlFor="nombreClienteInput" className="">
              Filtrar por Cliente
            </label>
            <input
              id="nombreClienteInput"
              className="placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              type="text"
              onChange={filtrarPagosPorNombres}
              placeholder="Nombre"
            />
            <label htmlFor="fechaDesde">Desde</label>
            <input
              className="border border-slate-200 rounded-md"
              type="date"
              name="fechaDesde"
              id="fechaDesde"
              onChange={(e) => {
                const rawValue = e.target.value; // Valor en formato yyyy-mm-dd
                const formattedValue = formatDateToDDMMYYYY(rawValue);
                setFilterDesde(formattedValue); // Guardamos el valor en formato dd/mm/yyyy
              }}
            />
            <label htmlFor="fechaHasta">Hasta</label>
            <input
              className="border border-slate-200 rounded-md"
              type="date"
              name="fechaHasta"
              id="fechaHasta"
              onChange={(e) => {
                const rawValue = e.target.value; // Valor en formato yyyy-mm-dd
                const formattedValue = formatDateToDDMMYYYY(rawValue);
                setFilterHasta(formattedValue); // Guardamos el valor en formato dd/mm/yyyy
              }}
            />
          </form>

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
              {getPaginatedData()?.map((payment, index) => {
                const className = `py-3 px-5 ${
                  index === allPayments.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={`${payment.client}-${index}`}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {payment.client}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="w-10/12">
                        <Typography
                          variant="small"
                          className="mb-1 block text-x font-medium text-blue-gray-600"
                        >
                          {new Date(payment.createdAt).toLocaleString()}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="text-x font-medium text-blue-gray-600"
                      >
                        {payment.currency}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="text-x font-medium text-green-600"
                      >
                        $ {payment.amount}
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
            >
              Anterior
            </button>
            <span className="flex items-center">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
            >
              Siguiente
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Home;
