import { LineChart } from '@mui/x-charts/LineChart';

interface ChartUIProps {
    arrLabels: string[];         // Ej: data.hourly.time
    arrValues1: number[];        // Ej: data.hourly.temperature_2m
    arrValues2: number[];        // Ej: data.hourly.wind_speed_10m
}

export default function ChartUI({ arrLabels, arrValues1, arrValues2 }: ChartUIProps) {
    return (
        <>
            <LineChart
                height={300}
                series={[
                    { data: arrValues1, label: 'Temperatura (°C)' },
                    { data: arrValues2, label: 'Viento (km/h)' },
                ]}
                xAxis={[{ scaleType: 'point', data: arrLabels }]}
            />
        </>
    );
}
