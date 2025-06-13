import { useContext } from "react";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';
import { DarkModeContext } from "../../contexts/DarkModeContext";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StatusReportChart() {
    const { darkMode } = useContext(DarkModeContext) ?? { darkMode: false };

    const data = {
        labels: ['Januari', 'Februari', 'Maret', 'April'],
        datasets: [
            {
                label: 'Ditunda',
                data: [12, 18, 9, 7],
                backgroundColor: '#8fff67',
            },
            {
                label: 'Diterima',
                data: [20, 14, 16, 22],
                backgroundColor: '#67fffC',
            },
            {
                label: 'Diproses',
                data: [15, 10, 12, 9],
                backgroundColor: '#C767FF',
            },
            {
                label: 'Selesai',
                data: [8, 12, 14, 18],
                backgroundColor: '#FF6769',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                bodyColor: '#fff',
                titleColor: '#fff',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: darkMode ? '#ffffff' : '#000000',
                },
                grid: {
                    color: darkMode ? '#444' : '#ccc',
                },
            },
            x: {
                ticks: {
                    color: darkMode ? '#ffffff' : '#000000',
                },
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <Bar
            key={darkMode ? 'dark' : 'light'}
            data={data}
            options={options}
            style={{ width: '100%', height: '100%' }}
        />
    );
}
