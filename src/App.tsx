import './App.css';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import DataFetcher from './hooks/DataFetcher';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';
import useMediaQuery from '@mui/material/useMediaQuery';


function App() {
    const [selectedCity, setSelectedCity] = useState<string>('guayaquil');
    const { data, loading, error } = DataFetcher({ city: selectedCity });
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const next24Time = data?.hourly.time.slice(0, 24).map(t =>
        new Date(t).toLocaleTimeString('es-EC', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC'
        })
    );
    const next24Temp = data?.hourly.temperature_2m.slice(0, 24);
    const next24Wind = data?.hourly.wind_speed_10m.slice(0, 24);

    return (
        <Box className="app-container">
            <Grid container spacing={4} justifyContent="center" alignItems="stretch">

                {/* Header */}
                <Grid item >
                    <HeaderUI />
                </Grid>

                {/* Selector + Alerta */}
                <Grid container item spacing={2} justifyContent="center" alignItems="center" size={{xs:12}}>
                    <Grid item >
                        <AlertUI description="No se preveen lluvias" />
                    </Grid>
                    <Grid item >
                        <SelectorUI onCityChange={setSelectedCity} />
                    </Grid>
                </Grid>

                {/* Indicadores actuales */}
                {loading && <p>Cargando datos...</p>}
                {error && <p>Error: {error}</p>}
                {data && (<>
                    <Grid item >
                        <div className="indicators">
                            <IndicatorUI title="Temperatura aparente" description={`${data.current.apparent_temperature} ${data.current_units.apparent_temperature}`} />
                            <IndicatorUI title="Viento" description={`${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`} />
                            <IndicatorUI title="Humedad relativa" description={`${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}`} />
                            <IndicatorUI title="Temperatura (2m)" description={`${data.current.temperature_2m} ${data.current_units.temperature_2m}`} />
                        </div>
                    </Grid>

                {/* Gráfico + Tabla (en bloque) */}
                {!isSmallScreen && next24Time && next24Temp && next24Wind && (
                    <Grid item >
                        <div className="chart-table-wrapper">
                            <div>
                                <Typography variant="h6" gutterBottom>Gráfico: Temperatura y Viento (por hora)</Typography>
                                <ChartUI arrLabels={next24Time} arrValues1={next24Temp} arrValues2={next24Wind} />
                            </div>
                            <div>
                                <Typography variant="h6" gutterBottom>Tabla: Datos por hora</Typography>
                                <TableUI arrLabels={next24Time} arrValues1={next24Temp} arrValues2={next24Wind} />
                            </div>
                        </div>
                    </Grid>
                )}

                {/* Información adicional */}
                    <Grid item >
                        <div className="info-box">
                            <Typography variant="h6" gutterBottom>Información adicional</Typography>
                            <Typography variant="body1">
                                Ciudad seleccionada: <strong>{selectedCity}</strong><br />
                                Lat/Lon: {data.latitude}, {data.longitude}<br />
                                Última actualización: {new Date().toLocaleString()}<br />
                                Fuente: <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">Open-Meteo.com</a><br />
                                Recomendación: {data?.current.temperature_2m > 30 ? 'Usa ropa ligera y mantente hidratado' : 'Elige telas transpirables y accesorios versátiles para estar cómodo'}
                            </Typography>
                        </div>
                    </Grid>
                </>)}
            </Grid>
        </Box>

    );
}

export default App;
