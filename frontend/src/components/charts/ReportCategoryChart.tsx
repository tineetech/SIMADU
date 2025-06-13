/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Filler,
    ChartOptions,
    ChartData
} from 'chart.js';
import { DarkModeContext } from "../../contexts/DarkModeContext";

// Daftarkan plugin hanya sekali (di luar komponen)
ChartJS.register(ArcElement, Tooltip, Legend, Filler);

const createCenterTextPlugin = (isDark: boolean) => ({
    id: 'centerTextPlugin',
    beforeDraw: (chart: any) => {
        if (chart.config.type !== 'doughnut') return;
        const { width, height, ctx } = chart;
        ctx.restore();

        const textColor = isDark ? '#ffffff' : '#000000';
        const total = chart.data.datasets[0].data.reduce(
            (acc: number, value: number) => acc + value,
            0
        );

        const fontSize = Math.min(height, width) / 5;
        ctx.font = `bold ${fontSize}px Montserrat, sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = textColor;

        const text = `${total}`;
        const textWidth = ctx.measureText(text).width;
        const textX = (width - textWidth) / 2;
        const textY = height / 2;

        ctx.fillText(text, textX, textY);
        ctx.save();
    },
});

export default function ReportCategoryChart() {
    const { darkMode } = useContext(DarkModeContext) ?? { darkMode: false };

    const data: ChartData<'doughnut', number[], string> = {
        labels: ['Jalan Rusak', 'Sampah', 'Bencana Alam', 'Lainnya'],
        datasets: [
            {
                label: 'Jumlah Laporan',
                data: [46, 37, 28, 12],
                backgroundColor: ['#8fff67', '#67fffC', '#C767FF', '#FF6769'],
                borderWidth: 0,
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        cutout: '75%',
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                bodyColor: '#fff',
                titleColor: '#fff',
            },
        },
    };

    const plugins = [createCenterTextPlugin(darkMode)];

    return (
        <Doughnut
            key={darkMode ? 'dark' : 'light'} // 👉 trigger re-render saat tema berubah
            data={data}
            options={options}
            plugins={plugins}
        />
    );
}
