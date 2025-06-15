import { useContext } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { DarkModeContext } from "../../contexts/DarkModeContext";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

type MonthlyReportChartProps = {
    labels: string[];       // contoh: ['Jan', 'Feb', ...]
    dataPoints: number[];   // contoh: [30, 45, 50, ...]
};

export default function MonthlyReportChart({ labels, dataPoints }: MonthlyReportChartProps) {
    const { darkMode } = useContext(DarkModeContext) ?? { darkMode: false };

    const textColor = darkMode ? '#E5E7EB' : '#4B5563';
    const bgColor = darkMode ? '#1F2937' : '#F9FAFB';
    const tooltipTitle = darkMode ? '#F9FAFB' : '#111827';

    const data = {
        labels,
        datasets: [
            {
                label: 'Jumlah Laporan',
                data: dataPoints,
                borderColor: '#04d9ff',
                pointBackgroundColor: '#04d9ff',
                pointBorderColor: '#04d9ff',
                backgroundColor: '#04d9ff',
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: false
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
                bodyColor: textColor,
                backgroundColor: bgColor,
                titleColor: tooltipTitle,
                borderColor: '#04d9ff',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: textColor,
                    font: { weight: 300 },
                },
                grid: {
                    display: false,
                },
            },
            y: {
                ticks: {
                    color: textColor,
                    font: {
                        family: 'Poppins',
                        weight: 300,
                    },
                },
                grid: {
                    color: darkMode ? '#374151' : '#D1D5DB',
                    borderDash: [4, 4],
                },
            },
        },
    };

    return <Line key={darkMode ? 'dark' : 'light'} data={data} options={options} />;
}
