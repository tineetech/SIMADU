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

type MonthlyStatusReport = {
    bulan: string;
    pending: number;
    proses: number;
    success: number;
};

type Props = {
    dataStatus: MonthlyStatusReport[];
};

export default function StatusReportChart({ dataStatus }: Props) {
    const { darkMode } = useContext(DarkModeContext) ?? { darkMode: false };

    const labels = dataStatus.map(item => item.bulan);

    const data = {
        labels,
        datasets: [
            {
                label: 'Pending',
                data: dataStatus.map(item => item.pending),
                backgroundColor: '#facc15', // kuning soft
            },
            {
                label: 'Proses',
                data: dataStatus.map(item => item.proses),
                backgroundColor: '#60a5fa', // biru soft
            },
            {
                label: 'Success',
                data: dataStatus.map(item => item.success),
                backgroundColor: '#34d399', // hijau soft
            },
        ],
    };

    const options = {
        responsive: true,
        indexAxis: 'y', // membuat bar horizontal
        plugins: {
            legend: {
                labels: {
                    color: darkMode ? '#fff' : '#000',
                },
            },
            tooltip: {
                bodyColor: '#fff',
                titleColor: '#fff',
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    color: darkMode ? '#ffffff' : '#000000',
                },
                grid: {
                    color: darkMode ? '#444' : '#ccc',
                },
            },
            y: {
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
