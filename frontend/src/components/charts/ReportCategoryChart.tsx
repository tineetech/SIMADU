/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useMemo } from "react";
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
import { Report } from "../../types";

// Registrasi chart plugin
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

type Props = {
    laporan: Report[];
};

export default function ReportCategoryChart({ laporan }: Props) {
    const { darkMode } = useContext(DarkModeContext) ?? { darkMode: false };

    const { labels, dataPoints, colors } = useMemo(() => {
        const countByCategory: Record<string, number> = {};

        laporan.forEach((item) => {
            const category = item.category || "Lainnya";
            countByCategory[category] = (countByCategory[category] ?? 0) + 1;
        });

        const categoryColors: Record<string, string> = {
            "jalan_rusak": "#8fff67",
            "sampah_menumpuk": "#67fffC",
            "bencana_alam": "#C767FF",
            "Lainnya": "#FF6769",
        };

        const labels = Object.keys(countByCategory);
        const dataPoints = Object.values(countByCategory);
        const colors = labels.map((label) => categoryColors[label] ?? "#ccc");

        return { labels, dataPoints, colors };
    }, [laporan]);

    const data: ChartData<'doughnut', number[], string> = {
        labels,
        datasets: [
            {
                label: "Jumlah Laporan",
                data: dataPoints,
                backgroundColor: colors,
                borderWidth: 0,
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        cutout: "75%",
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                bodyColor: "#fff",
                titleColor: "#fff",
            },
        },
    };

    const plugins = [createCenterTextPlugin(darkMode)];

    return (
        <Doughnut
            key={darkMode ? "dark" : "light"}
            data={data}
            options={options}
            plugins={plugins}
        />
    );
}
