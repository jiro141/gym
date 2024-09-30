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
import { FaTrashAlt } from "react-icons/fa";
import { deleteClient } from "@/Api/controllers/Clients";
import DeleteClient from "@/widgets/modals/DeleteClient";
import PutClient from "@/widgets/modals/PutClient";
import UpdateClient from "@/widgets/modals/UpdateClient";

export function Tables() {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openPut, setOpenPut] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteData, setDeleteData] = useState({
    id: '',
    firstName: "",
    lastName: "",

  })
  const [idData, setIdData] = useState('')
  const handleOpen = () => setOpen(!open);
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value); // Actualiza el estado con el valor del input
  };

  const { clients, loading, getClient, error } = useClients();
  const { clientsSearch, getSearchClient } = useSearchClient();

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // First useEffect: Fetch clients only once on mount if not already loaded
  useEffect(() => {
    // Fetch clients only if the clients array is empty
    getClient();

  }, []);

  // Second useEffect: Debounce searchTerm changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm); // Update debounced term after delay
    }, 500);  // 500ms debounce delay

    // Cleanup timeout if searchTerm changes before delay finishes
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Third useEffect: Trigger search request only when debouncedSearchTerm changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      getSearchClient(debouncedSearchTerm);  // Call the search API with the debounced term
    }
  }, [debouncedSearchTerm, getSearchClient]);
  // Función handleDelete para eliminar un cliente
  const handleDelete = (id, firstName, lastName) => {
    setOpenDelete(!openDelete)
    setDeleteData({
      id: id,
      firstName: firstName,
      lastName: lastName,
    })

  };
  const handleUpdate = (id, firstName, lastName) => {
    setOpenUpdate(!openUpdate)
    setDeleteData({
      id: id,
      firstName: firstName,
      lastName: lastName,
    })

  };
  const handlePut = (id) => {
    setOpenPut(!openPut)
    setIdData(id)
  }

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
                {["Nombre completo", "Vencimiento", "Estado", "Vencido", "Renovar", " Editar", "Borrar"].map((el) => (
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
                  ({ id, firstName, lastName, createdAt, expirationDate, attendance, isActive, membershipType }) => {
                    const className = `py-3 px-5 ${id === clients.length - 1 ? "" : "border-b border-blue-gray-50"
                      }`;
                    console.log(expirationDate, 'data');

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
                            {membershipType === 'permanente' ? '----------' : formatDate(expirationDate)} {/* Fecha formateada */}
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
                            color={membershipType === 'permanente' ? 'blue-gray' : today >= expirationD ? "red" : "blue-gray"}
                            value={membershipType === 'permanente' ? 'Activo' : today >= expirationD ? "Vencido" : "Activo"}
                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                          />
                        </td>
                        <td className={className}>
                          <button className="text-md bg-grey-600 " onClick={() => handleUpdate(id, firstName, lastName)}>
                            <Chip
                              variant="gradient"
                              color={'blue'}
                              value={"renovar"}
                              className="py-0.5 px-2 text-[11px] font-medium w-fit"
                            />
                          </button>
                        </td>
                        <td className={className}>
                          <button className="p-0 m-0" onClick={() => handlePut(id)}> {/* Botón sin padding ni margen */}
                            <PencilIcon className="h-5 w-5 text-blue-gray-600" /> {/* Icono lápiz */}
                          </button>
                        </td>
                        <td className={className}>
                          <button className="p-0 m-0" onClick={() => handleDelete(id, firstName, lastName)}> {/* Botón sin padding ni margen */}
                            <FaTrashAlt size={20} color="red" />
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )
              ) : clientsSearch && clientsSearch.length > 0 ? (
                // Renderizar los resultados de búsqueda cuando hay coincidencias
                clientsSearch.map(
                  ({ id, firstName, lastName, createdAt, expirationDate, attendance, isActive, membershipType }) => {


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
                            {membershipType === 'permanente' ? '----------' : formatDate(expirationDate)} {/* Fecha formateada */}
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
                            color={membershipType === 'permanente' ? 'blue-gray' : today >= expirationD ? "red" : "blue-gray"}
                            value={membershipType === 'permanente' ? 'Activo' : today >= expirationD ? "Vencido" : "Activo"}
                            className="py-0.5 px-2 text-[11px] font-medium w-fit"
                          />
                        </td>
                        <td className={className}>
                          <Button>Hola</Button>
                        </td>
                        <td className={className}>
                          <button className="p-0 m-0" onClick={() => handlePut(id)}> {/* Botón sin padding ni margen */}
                            <PencilIcon className="h-5 w-5 text-blue-gray-600" /> {/* Icono lápiz */}
                          </button>
                        </td>
                        <td className={className}>
                          <button className="p-0 m-0" onClick={() => handleDelete(id, firstName, lastName)}> {/* Botón sin padding ni margen */}
                            <FaTrashAlt size={20} color="red" />
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
      <Dialog open={openDelete} handler={handleDelete}>
        <DialogBody>
          <DeleteClient deleteData={deleteData} setOpenDelete={setOpenDelete} openDelete={openDelete} />
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleDelete}>Cerrar</Button>
        </DialogFooter>
      </Dialog>
      <Dialog open={openPut} handler={handlePut}>
        <DialogBody>
          <PutClient id={idData} setOpenPut={setOpenPut} openPut={openPut} />
        </DialogBody>
        <DialogFooter>
          <Button onClick={handlePut}>Cerrar</Button>
        </DialogFooter>
      </Dialog>
      <Dialog open={openUpdate} handler={handleUpdate}>
        <DialogBody>
          <UpdateClient deleteData={deleteData} setOpenDelete={setOpenUpdate} openDelete={openUpdate} />
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleUpdate}>Cerrar</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Tables;
