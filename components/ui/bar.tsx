import { FC } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart: FC<{ data: ChartData<"bar">; option: ChartOptions<"bar"> }> = ({
  data,
  option,
}) => {
  return <Bar data={data} options={option} />;
};

export default BarChart;
