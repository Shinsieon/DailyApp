import ReactApexChart from "react-apexcharts";

interface HorizontalBarChartProps {
  data: number[];
  labels: string[];
  width?: number | string;
  height?: number | string;
  title?: string;
  reverse?: boolean;
}
const HorizontalBarChart = (props: HorizontalBarChartProps) => {
  return (
    <ReactApexChart
      options={{
        title: {
          text: props.title,
          align: "left",
          style: {
            fontSize: "14px",
            color: "#666",
          },
        },
        yaxis: {
          reversed: props.reverse,
          labels: {
            padding: 1,
          },
        },
        legend: {
          show: false,
        },
        chart: {
          type: "bar",
          toolbar: {
            show: false,
          },
          zoom: {
            autoScaleYaxis: false,
          },
          redrawOnParentResize: true,
          redrawOnWindowResize: true,
        },
        plotOptions: {
          bar: {
            horizontal: true,
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

export default HorizontalBarChart;
