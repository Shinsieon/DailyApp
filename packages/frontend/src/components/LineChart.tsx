import dayjs from "dayjs";
import ReactApexChart from "react-apexcharts";
import { formatMoney } from "../utils";
interface LineChartProps {
  series: { name: string; data: number[] }[];
  labels?: string[];
}
const LineChart = (props: LineChartProps) => {
  const series = props.series;
  console.log(`series : ${JSON.stringify(series)}`);
  const options = {
    chart: {
      height: 350,
      toolbar: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          colors: "#999",
          fontSize: "12px",
        },
        formatter: (value: number) => {
          return formatMoney(value);
        },
      },
    },
    xaxis: {
      categories: props.labels,
      labels: {
        show: true,
        style: {
          colors: "#999",
          fontSize: "12px",
        },
        formatter: (value: string) => {
          return dayjs(value).format("MM-DD");
        },
      },
    },
  };
  return <ReactApexChart options={options} series={series} type="line" />;
};
export default LineChart;
