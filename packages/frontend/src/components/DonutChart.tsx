import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

interface DonutChartProps {
  series: number[];
  labels?: string[];
}
const DonutChart = (props: DonutChartProps) => {
  const series = props.series;
  const options: ApexOptions = {
    series: props.series,
    labels: props.labels,
    chart: {
      type: "donut",
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            show: true,
          },
        },
      },
    ],
    legend: {
      position: "right",
      offsetY: 0,
      height: 230,
    },
  };
  return (
    <ReactApexChart
      options={options}
      series={series}
      type="donut"
      width={380}
    />
  );
};
export default DonutChart;
