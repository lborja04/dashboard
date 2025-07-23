import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

interface TableUIProps {
    arrLabels: string[];         // data.hourly.time
    arrValues1: number[];        // data.hourly.temperature_2m
    arrValues2: number[];        // data.hourly.wind_speed_10m
}

function combineArrays(arrLabels: string[], arrValues1: number[], arrValues2: number[]) {
    return arrLabels.map((label, index) => ({
        id: index,
        label: label,
        value1: arrValues1[index],
        value2: arrValues2[index]
    }));
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'label', headerName: 'Hora', width: 150 },
    { field: 'value1', headerName: 'Temp. (°C)', width: 130 },
    { field: 'value2', headerName: 'Viento (km/h)', width: 130 },
    {
        field: 'resumen',
        headerName: 'Resumen',
        width: 200,
        sortable: false,
        hideable: false,
        valueGetter: (_, row) => `${row.label} | ${row.value1}°C | ${row.value2} km/h`,
    },
];

export default function TableUI({ arrLabels, arrValues1, arrValues2 }: TableUIProps) {
    const rows = combineArrays(arrLabels, arrValues1, arrValues2);

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
            />
        </Box>
    );
}
