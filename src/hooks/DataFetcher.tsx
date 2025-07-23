import { useEffect, useState } from 'react';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface DataFetcherOutput {
    data: OpenMeteoResponse | null;
    loading: boolean;
    error: string | null;
}

interface DataFetcherProps {
    city: string;
}

const cityCoordinates: Record<string, { lat: number; lon: number }> = {
    guayaquil: { lat: -2.104461, lon: -79.904514 },
    quito:     { lat: -0.002172, lon: -78.456272 },
    manta:     { lat: -0.950267, lon: -80.692685 },
    cuenca:    { lat: -2.901167, lon: -79.011389 }
};

const CACHE_DURATION_MINUTES = 10;

export default function DataFetcher({ city }: DataFetcherProps): DataFetcherOutput {
    const [data, setData] = useState<OpenMeteoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!city || !cityCoordinates[city]) {
            setData(null);
            setLoading(false);
            setError(null);
            return;
        }

        const { lat, lon } = cityCoordinates[city];
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m`;

        const storageKey = `weatherData_${city}`;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // 1. Verificar si hay datos en localStorage válidos
                const cached = localStorage.getItem(storageKey);
                if (cached) {
                    const { timestamp, data } = JSON.parse(cached);
                    const age = (Date.now() - timestamp) / (1000 * 60); // minutos

                    if (age < CACHE_DURATION_MINUTES) {
                        setData(data);
                        setLoading(false);
                        return; // Usa caché válida
                    }
                }

                // 2. No hay caché válida, se hace fetch
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
                }

                const result: OpenMeteoResponse = await response.json();
                setData(result);

                // 3. Guardar en localStorage con timestamp
                const item = {
                    timestamp: Date.now(),
                    data: result
                };
                localStorage.setItem(storageKey, JSON.stringify(item));
            } catch (err: any) {
                // 4. En caso de error, intenta usar la caché si existe
                const cached = localStorage.getItem(storageKey);
                if (cached) {
                    const { data } = JSON.parse(cached);
                    setData(data);
                    setError("Error al actualizar. Se están usando datos en caché.");
                } else {
                    setError(err instanceof Error ? err.message : "Error desconocido al obtener los datos.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [city]);

    return { data, loading, error };
}
