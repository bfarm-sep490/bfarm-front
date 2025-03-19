import { DashboardOutlined } from "@ant-design/icons";
import { ShowButton } from "@refinedev/antd";
import { Card, Flex } from "antd";
import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

export const CaringTaskDashboard = () => {
  const [state1, setState1] = React.useState({
    series: [
      {
        name: "Tổng số",
        data: [12, 1, 1],
      },
      {
        name: "Đã hoàn thành",
        data: [11, 0, 0],
      },
      {
        name: "Chưa hoàn thành",
        data: [1, 0, 0],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 430,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      xaxis: {
        categories: ["Chăm sóc", "Kiểm định", "Thu hoạch"],
      },
    },
  });
  return (
    <Card
      title={
        <Flex align="center" gap={8}>
          <DashboardOutlined />
          {"Biểu đồ tổng hợp công việc chăm sóc"}
        </Flex>
      }
      extra={<ShowButton hideText size="small" />}
    >
      <ReactApexChart
        options={state1.options as ApexOptions}
        series={state1.series}
        type="bar"
        height={300}
      />
    </Card>
  );
};
