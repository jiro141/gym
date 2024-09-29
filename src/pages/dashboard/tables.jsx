import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  IconButton
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";
import { useClients, useSearchClient } from "@/hooks/clients/useClients";
import { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import CreateClient from "@/widgets/modals/CreateClient";
import { Bars3Icon } from "@heroicons/react/24/solid";

export function Tables() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleOpen = () => setOpen(!open);
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value); // Actualiza el estado con el valor del input
  };

  const { clients, loading, getClient, error } = useClients();
  useEffect(() => {
    getClient();
  }, []);
  const { clientsSearch, getSearchClient } = useSearchClient();
  console.log(searchTerm, 'tabla');

  useEffect(() => {
    if (searchTerm) {
      getSearchClient(searchTerm); // Llamar a la función de búsqueda solo si hay un término
    }
  }, [searchTerm, getSearchClient]);

  const today = new Date();
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex  justify-between">
          <Typography variant="h6" color="white">
            Clientes
          </Typography>
          <div className="mr-auto md:mr-4 md:w-56">
            <Input
              className="bg-white text-black placeholder-gray-500"
              label="Buscar"
              value={searchTerm} // El valor del input viene del estado
              onChange={handleInputChange} // Actualiza el estado cada vez que el usuario escribe
            />
          </div>
          <button className="p-1 m-0 flex bg-yellow-400 rounded-md" onClick={handleOpen}>
            <Typography variant="h6" color="black">
              Nuevo cliente
            </Typography>
          </button>

        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Nombre completo", "Inscripcion", "Vencimiento", "Estado", "Vencido"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {searchTerm === '' ? (
                // Renderizar la tabla normal cuando no hay búsqueda
                clients.map(
                  ({ firstName, lastName, createdAt, expirationDate, attendance, isActive }, id) => {
                    const className = `py-3 px-5 ${id === clients.length - 1 ? "" : "border-b border-blue-gray-50"
                      }`;

                    // Formatear las fechas a 'dd-mm-aaaa'
                    const formatDate = (date) => {
                      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
                      return new Date(date).toLocaleDateString('es-ES', options);  // Formato 'dd/mm/aaaa'
                    };

                    const expirationD = new Date(expirationDate);
                    return (
                      <tr key={id}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold text-[16px]"
                              >
                                {firstName}
                              </Typography>
                              <Typography className="text-[14px] font-normal text-blue-gray-500">
                                {lastName}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {formatDate(createdAt)} {/* Fecha formateada */}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {formatDate(expirationDate)} {/* Fecha formateada */}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Chip
                            variant="gradient"
                            color={attendance ? "green" : "blue-gray"}
                            value={attendance ? "Asistente" : "Inasistente"}
                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                          />
                        </td>
                        <td className={className}>
                          <Chip
                            variant="gradient"
                            color={today >= expirationD ? "red" : "blue-gray"}
                            value={today >= expirationD ? "Vencido" : "Activo"}
                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                          />
                        </td>
                        <td className={className}>
                          <button className="p-0 m-0"> {/* Botón sin padding ni margen */}
                            <PencilIcon className="h-5 w-5 text-blue-gray-600" /> {/* Icono lápiz */}
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )
              ) : clientsSearch && clientsSearch.length > 0 ? (
                // Renderizar los resultados de búsqueda cuando hay coincidencias
                clientsSearch.map(
                  ({ firstName, lastName, createdAt, expirationDate, attendance, isActive }, id) => {
                    const className = `py-3 px-5 ${id === clientsSearch.length - 1 ? "" : "border-b border-blue-gray-50"
                      }`;

                    // Formatear las fechas a 'dd-mm-aaaa'
                    const formatDate = (date) => {
                      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
                      return new Date(date).toLocaleDateString('es-ES', options);  // Formato 'dd/mm/aaaa'
                    };

                    const expirationD = new Date(expirationDate);
                    return (
                      <tr key={id}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-semibold text-[16px]"
                              >
                                {firstName}
                              </Typography>
                              <Typography className="text-[14px] font-normal text-blue-gray-500">
                                {lastName}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {formatDate(createdAt)} {/* Fecha formateada */}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {formatDate(expirationDate)} {/* Fecha formateada */}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Chip
                            variant="gradient"
                            color={attendance ? "green" : "blue-gray"}
                            value={attendance ? "Asistente" : "Inasistente"}
                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                          />
                        </td>
                        <td className={className}>
                          <Chip
                            variant="gradient"
                            color={today >= expirationD ? "red" : "blue-gray"}
                            value={today >= expirationD ? "Vencido" : "Activo"}
                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                          />
                        </td>
                        <td className={className}>
                          <button className="p-0 m-0"> {/* Botón sin padding ni margen */}
                            <PencilIcon className="h-5 w-5 text-blue-gray-600" /> {/* Icono lápiz */}
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                // Mostrar mensaje si no hay coincidencias en los resultados de búsqueda
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    <Typography className="text-blue-gray-500">
                      Sin coincidencias
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>


          </table>
        </CardBody>
      </Card>
      <Dialog open={open} handler={handleOpen}>
        {/* <DialogHeader>Its a simple modal.</DialogHeader> */}
        <DialogBody>
          <CreateClient handleOpen={handleOpen} open={open} setOpen={setOpen} />
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleOpen}>Cerrar</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Tables;
