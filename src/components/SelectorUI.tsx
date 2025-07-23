import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';

interface SelectorUIProps {
    onCityChange: (city: string) => void;
}

export default function SelectorUI({ onCityChange }: SelectorUIProps) {
    const [cityInput, setCityInput] = useState('guayaquil');

    const handleChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        setCityInput(value);
        onCityChange(value);
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="city-select-label">Ciudad</InputLabel>
            <Select
                labelId="city-select-label"
                id="city-simple-select"
                onChange={handleChange}
                label="Ciudad"
                value={cityInput}>
                <MenuItem value="" disabled><em>Seleccione una ciudad</em></MenuItem>
                <MenuItem value="guayaquil">Guayaquil</MenuItem>
                <MenuItem value="quito">Quito</MenuItem>
                <MenuItem value="manta">Manta</MenuItem>
                <MenuItem value="cuenca">Cuenca</MenuItem>
            </Select>
            {cityInput && (
                <p>
                    Información del clima en <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{cityInput}</span>
                </p>
            )}
        </FormControl>
    );
}
