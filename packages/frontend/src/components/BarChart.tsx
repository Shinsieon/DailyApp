import { formatCountdown } from "antd/es/statistic/utils";
import ReactApexChart from "react-apexcharts";
import { formatMoney } from "../utils";

interface BarChartProps {
  data: number[];
  labels: string[];
  width?: number | string;
  height?: number | string;
  title?: string;
  reverse?: boolean;
}
const BarChart = (props: BarChartProps) => {
  return (
    <ReactApexChart
      options={{
        yaxis: {
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val + "원";
            },
          },
        },
        xaxis: {
          axisTicks: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
        },
        chart: {
          zoom: {
            autoScaleYaxis: false,
          },
          redrawOnParentResize: true,
          redrawOnWindowResize: true,
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: "top", // top, center, bottom
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val: number) {
            return formatMoney(val) + "원";
          },
          offsetY: -20,
          style: {
            colors: ["#304758"],
          },
        },
      }}
      type="bar"
      width={props.width} // 👈 string으로 '100%' 주기
      height={props.height || "100%"}
      series={[
        {
          data: props.data.map((item, index) => ({
            x: props.labels[index],
            y: item,
          })),
        },
      ]}
    />
  );
};

export default BarChart;
