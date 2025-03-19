import { useList } from "@refinedev/core";
import { Card } from "antd";
import { ApexOptions } from "apexcharts";
import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useParams } from "react-router";

export const MaterialDashboard = () => {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const { data: materialFertilizerData } = useList({
    resource: `plans/${id}/fertilizers`,
  });
  const { data: materialPesticideData } = useList({
    resource: `plans/${id}/pesticides`,
  });
  useEffect(() => {
    setLoading(false);
  }, [materialFertilizerData, materialPesticideData]);
  const fertilizers = materialFertilizerData?.data || [];
  const pesticides = materialPesticideData?.data || [];
  const estimate_quantity = fertilizers
    .map((fertilizer) => fertilizer.estimate_quantity)
    .concat(pesticides.map((pesticide) => pesticide.estimate_quantity));
  const used_quantity = fertilizers
    .map((fertilizer) => fertilizer.used_quantity)
    .concat(pesticides.map((pesticide) => pesticide.used_quantity));
  const categories_label = fertilizers
    .map((fertilizer) => fertilizer.name)
    .concat(pesticides.map((pesticide) => pesticide.name));
  const [state, setState] = React.useState({
    series: [
      {
        name: "Dự kiến (kg/lít)",
        data: estimate_quantity,
      },
      {
        name: "Đã sử dụng (kg/lít)",
        data: used_quantity,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: "100%",
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "top",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      xaxis: {
        categories: categories_label,
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "bottom",
        offsetX: 0,
        offsetY: 0,
      },
    },
  });
  return (
    <Card loading={loading} title="📊 Phân bón & Thuốc trừ sâu">
      <ReactApexChart
        options={state.options as ApexOptions}
        series={state.series}
        type="bar"
        height={280}
      />
    </Card>
  );
};
