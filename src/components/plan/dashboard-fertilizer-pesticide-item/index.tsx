import { useList } from "@refinedev/core";
import { Card } from "antd";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useParams } from "react-router";

export const MaterialDashboard = () => {
  const { id } = useParams();

  // Fetch data for fertilizers and pesticides
  const { data: materialFertilizerData } = useList({
    resource: `plans/${id}/fertilizers`,
    queryOptions: { cacheTime: 60000 },
  });

  const { data: materialPesticideData } = useList({
    resource: `plans/${id}/pesticides`,
    queryOptions: { cacheTime: 60000 },
  });

  // State to manage chart data
  const [chartData, setChartData] = useState<{
    series: { name: string; data: number[] }[];
    options: ApexOptions;
  }>({
    series: [],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: "100%",
        toolbar: { show: true },
        zoom: { enabled: true },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: { position: "top", offsetX: -10, offsetY: 0 },
          },
        },
      ],
      xaxis: {
        categories: [],
      },
      fill: { opacity: 1 },
      legend: { position: "bottom", offsetX: 0, offsetY: 0 },
    },
  });

  // useEffect to update state when data is available
  useEffect(() => {
    if (materialFertilizerData && materialPesticideData) {
      const fertilizers = materialFertilizerData?.data || [];
      const pesticides = materialPesticideData?.data || [];

      const estimate_quantity = fertilizers
        .map((item) => item.estimate_quantity)
        .concat(pesticides.map((item) => item.estimate_quantity));

      const used_quantity = fertilizers
        .map((item) => item.used_quantity)
        .concat(pesticides.map((item) => item.used_quantity));

      const categories_label = fertilizers
        .map((item) => item.name)
        .concat(pesticides.map((item) => item.name));

      setChartData({
        series: [
          { name: "Dự kiến (kg/lít)", data: estimate_quantity },
          { name: "Đã sử dụng (kg/lít)", data: used_quantity },
        ],
        options: {
          ...chartData.options,
          xaxis: { categories: categories_label },
        },
      });
    }
  }, [materialFertilizerData, materialPesticideData]); // Chạy khi dữ liệu thay đổi

  return (
    <Card title="📊 Phân bón & Thuốc trừ sâu">
      <ReactApexChart
        options={chartData.options as ApexOptions}
        series={chartData.series}
        type="bar"
        height={280}
      />
    </Card>
  );
};
