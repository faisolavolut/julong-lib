import { FC } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Chart as ChartInstance,
  Plugin,
} from "chart.js";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface ProgressChartProps {
  percentage: number;
  color?: string;
  backgroundColor?: string;
  options: ChartOptions<"doughnut">;
}

const ProgressChart: FC<ProgressChartProps> = ({
  percentage,
  options,
  color = "#6366F1",
  backgroundColor = "#E0E7FF",
}) => {
  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [color, "transparent"],
        borderWidth: 0,
        borderRadius: [10, 0],
        cutout: "70%",
      },
    ],
  };
  const backgroundCircle: Plugin<"doughnut"> = {
    id: "backgroundCircle",
    beforeDatasetsDraw(chart: ChartInstance, args: any, pluginOptions: any) {
      const { ctx } = chart;
      ctx.save();

      const meta = chart.getDatasetMeta(0);
      if (!meta || meta.data.length === 0) return;

      const arc = meta.data[0] as any; // Pastikan ini adalah elemen arc
      const xCoor = arc.x;
      const yCoor = arc.y;
      const innerRadius = arc.innerRadius || 0;
      const outerRadius = arc.outerRadius || 0;
      const width = outerRadius - innerRadius;
      const angle = Math.PI / 180;

      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.strokeStyle = backgroundColor;
      ctx.arc(xCoor, yCoor, outerRadius - width / 2, 0, angle * 360, false);
      ctx.stroke();
      ctx.restore();
    },
  };
  return (
    <div className="relative w-16 h-16">
      <Doughnut data={data} options={options} plugins={[backgroundCircle]} />
      <div className="absolute inset-0 flex items-center justify-center text-black font-bold text-sm">
        +{percentage}%
      </div>
    </div>
  );
};

export default ProgressChart;
