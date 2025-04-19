import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

interface StackedChartProps {
  xAxis: string[];
  series: ApexAxisChartSeries;
  title: string;
}
const StackedChart = (props: StackedChartProps) => {
  // annotations?: ApexAnnotations
  // chart?: ApexChart
  // colors?: any[]
  // dataLabels?: ApexDataLabels
  // fill?: ApexFill
  // forecastDataPoints?: ApexForecastDataPoints
  // grid?: ApexGrid
  // labels?: string[]
  // legend?: ApexLegend
  // markers?: ApexMarkers
  // noData?: ApexNoData
  // plotOptions?: ApexPlotOptions
  // responsive?: ApexResponsive[]
  // series?: ApexAxisChartSeries | ApexNonAxisChartSeries
  // states?: ApexStates
  // stroke?: ApexStroke
  // subtitle?: ApexTitleSubtitle
  // theme?: ApexTheme
  // title?: ApexTitleSubtitle
  // tooltip?: ApexTooltip
  // xaxis?: ApexXAxis
  // yaxis?: ApexYAxis | ApexYAxis[]
  const options: ApexOptions = {
    title: {
      text: props.title,
      align: "left",
      style: {
        fontSize: "14px",
        color: "#666",
      },
    },
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      stackType: "100%",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    xaxis: {
      categories: props.xAxis,
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "right",
      offsetX: 0,
      offsetY: 50,
    },
  };
  // const series = [
  //   {
  //     name: "PRODUCT A",
  //     data: [44, 55, 41, 67, 22, 43, 21, 49],
  //   },
  //   {
  //     name: "PRODUCT B",
  //     data: [13, 23, 20, 8, 13, 27, 33, 12],
  //   },
  //   {
  //     name: "PRODUCT C",
  //     data: [11, 17, 15, 15, 21, 14, 15, 13],
  //   },
  // ];

  return <ReactApexChart options={options} series={props.series} />;
};

export default StackedChart;
