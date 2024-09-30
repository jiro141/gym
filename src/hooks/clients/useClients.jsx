import { getClients, fetchSearchClient } from "@/Api/controllers/Clients";
import { useCallback, useMemo, useState } from "react";

export function useClients() {
    const [clients, setClients] = useState([]);
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState(false);

    const getClient = useCallback(async () => {
        try {
            setloading(true);
            seterror(null);
            const client = await getClients();
            setClients(client)
        } catch (error) {
            seterror(error.message);
        } finally {
            setloading(false);
        }
    }, []);




    return { clients, loading, getClient, error };
}
export function useSearchClient() {
    const [clientsSearch, setClientsSearch] = useState([]); // Estado para guardar todos los clientes
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getSearchClient = useCallback(async (searchTerm) => {
        try {
            setLoading(true);
            setError(null);
            const clients = await fetchSearchClient(searchTerm); // Suponemos que esto devuelve un arreglo
            if (Array.isArray(clients)) {  // Asegúrate de que es un arreglo
                setClientsSearch(clients); // Guardar todos los clientes en el estado
                console.log(clientsSearch);
                
            } else {
                console.error("Expected array but got:", clients);
                setClientsSearch([]); // En caso de que no sea un arreglo, asegúrate de vaciar el estado
            }

        } catch (error) {
            console.error("Error fetching clients:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, [clientsSearch]); // Dependencias vacías para evitar ciclos infinitos

    return { clientsSearch, getSearchClient, loading, error };
}