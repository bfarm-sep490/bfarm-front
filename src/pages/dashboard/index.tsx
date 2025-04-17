import React, { useMemo, useState } from "react";
import { Card, Flex, Progress, Table, theme, Typography, Image, Empty } from "antd";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useList } from "@refinedev/core";
import { DateField, TextField } from "@refinedev/antd";
import InfiniteScroll from "react-infinite-scroll-component";

import { StatusTag } from "@/components/caring-task/status-tag";

// Comprehensive Type Definitions
type OrderStatus =
  | "PendingConfirmation"
  | "PendingDeposit"
  | "Cancel"
  | "Reject"
  | "Deposit"
  | "Paid";

type PlanStatus = "Ongoing" | "Complete" | "Cancel";

interface Plant {
  id: string;
  plant_name: string;
  image_url?: string;
  number_order?: number;
}

interface Order {
  id: string;
  status: OrderStatus;
  plant_id?: string;
}

interface Plan {
  id: string;
  plan_name: string;
  start_date: string;
  end_date: string;
  status: PlanStatus;
  plant_id?: string;
  yield_name?: string;
}

export const DashboardPage: React.FC = () => {
  const { token } = theme.useToken();
  const [visiblePlants, setVisiblePlants] = useState(5);

  const { data: harvestingProductData } = useList<any>({
    resource: "harvesting-product",
  });

  const { data: packagingProductData } = useList<any>({
    resource: "packaging-product",
  });

  const { data: orderData } = useList<Order>({
    resource: "orders",
  });

  const { data: plantData } = useList<Plant>({
    resource: "plants",
  });

  const { data: plansData } = useList<Plan>({
    resource: "plans",
    filters: [
      {
        field: "status",
        operator: "eq",
        value: "Ongoing",
      },
    ],
  });

  const remainingProducts = useMemo(() => {
    return (
      plantData?.data?.map((plant) => {
        const harvestingProducts =
          harvestingProductData?.data?.filter(
            (product) => product.plant_id === plant.id && product.status !== "OutOfStock",
          ) || [];

        const packagingProducts =
          packagingProductData?.data?.filter(
            (product) => product.plant_id === plant.id && product.status === "Active",
          ) || [];

        const totalHarvestingQuantity = harvestingProducts.reduce(
          (sum, product) => sum + (product.harvesting_quantity || 0),
          0,
        );

        const availableHarvestingQuantity = harvestingProducts.reduce(
          (sum, product) => sum + (product.available_harvesting_quantity || 0),
          0,
        );

        const totalPackagingPacks = packagingProducts.reduce(
          (sum, product) => sum + product.total_packs,
          0,
        );

        const availablePackagingPacks = packagingProducts.reduce(
          (sum, product) => sum + product.available_packs,
          0,
        );

        return {
          plant_id: plant.id,
          plant_name: plant.plant_name,
          total_harvesting_quantity: totalHarvestingQuantity,
          available_harvesting_quantity: availableHarvestingQuantity,
          total_packaging_packs: totalPackagingPacks,
          available_packaging_packs: availablePackagingPacks,
        };
      }) || []
    );
  }, [plantData, harvestingProductData, packagingProductData]);

  const orderStatusData = useMemo(() => {
    const statusCounts = {
      PendingDeposit: 0,
      PendingConfirmation: 0,
      Cancel: 0,
      Reject: 0,
      Deposit: 0,
      Paid: 0,
    };

    orderData?.data?.forEach((order) => {
      if (order?.status && order.status in statusCounts) {
        statusCounts[order.status]++;
      }
    });

    return {
      series: [
        statusCounts.PendingDeposit,
        statusCounts.PendingConfirmation,
        statusCounts.Cancel,
        statusCounts.Reject,
        statusCounts.Deposit,
        statusCounts.Paid,
      ],
      labels: ["Chờ đặt cọc", "Chờ xác nhận", "Hủy bỏ", "Từ chối", "Đã đặt cọc", "Đã thanh toán"],
    };
  }, [orderData]);

  const orderStatusChartOptions = useMemo(
    () => ({
      chart: {
        width: "100%",
        height: "100%",
        type: "pie",
      },
      labels: orderStatusData.labels,
      colors: ["#4A89DC", "#ED5565", "#F6BB42", "#37BC9B", "#8CC152", "#967ADC"],
      plotOptions: {
        pie: {
          dataLabels: {
            offset: -5,
            style: {
              fontSize: "12px",
              fontWeight: "bold",
              colors: ["#ffffff"],
            },
          },
        },
      },
      dataLabels: {
        formatter(val: number, opts: any) {
          const name = opts.w.globals.labels[opts.seriesIndex];
          return [name, `${val.toFixed(1)}%`];
        },
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
      },
    }),
    [orderStatusData],
  );

  const revenueChartConfig = {
    series: [
      {
        name: "Doanh Thu",
        data: [1, 2, 3, 4, 5, 6, 78, 9, 123, 3123, 321313, 13213],
      },
    ],
    options: {
      chart: {
        type: "area",
        height: 350,
        zoom: { enabled: false },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "straight" },
      title: {
        text: "Biểu Đồ Doanh Thu",
        align: "left",
      },
      xaxis: {
        type: "datetime",
        title: { text: "Thời Gian" },
      },
      yaxis: {
        opposite: true,
        title: { text: "Doanh Thu (VND)" },
      },
      legend: { horizontalAlign: "left" },
    },
  };

  const topPlantsData = useMemo(() => {
    const plantOrderCounts: { [key: string]: number } = {};

    orderData?.data?.forEach((order) => {
      const plantId = order.plant_id;
      if (plantId) {
        plantOrderCounts[plantId] = (plantOrderCounts[plantId] || 0) + 1;
      }
    });

    return (
      plantData?.data
        ?.map((plant) => ({
          ...plant,
          number_order: plantOrderCounts[plant.id] || 0,
        }))
        .sort((a, b) => b.number_order - a.number_order)
        .slice(0, visiblePlants) || []
    );
  }, [orderData, plantData, visiblePlants]);

  const productYieldColumns = [
    {
      title: "Loại Cây Trồng",
      dataIndex: "plant_name",
      key: "plant_name",
      render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: "Tổng Sản Lượng (kg)",
      dataIndex: "total_harvesting_quantity",
      key: "total_harvesting_quantity",
      render: (value: number) => <Typography.Text>{value.toFixed(2)} kg</Typography.Text>,
      sorter: (a: any, b: any) => a.total_harvesting_quantity - b.total_harvesting_quantity,
    },
    {
      title: "Sản Lượng Khả Dụng (kg)",
      dataIndex: "available_harvesting_quantity",
      key: "available_harvesting_quantity",
      render: (value: number) => (
        <Typography.Text type={value > 0 ? "success" : "danger"}>
          {value.toFixed(2)} kg
        </Typography.Text>
      ),
      sorter: (a: any, b: any) => a.available_harvesting_quantity - b.available_harvesting_quantity,
    },
    {
      title: "Tổng Gói",
      dataIndex: "total_packaging_packs",
      key: "total_packaging_packs",
      render: (value: number) => <Typography.Text>{value} gói</Typography.Text>,
      sorter: (a: any, b: any) => a.total_packaging_packs - b.total_packaging_packs,
    },
    {
      title: "Gói Khả Dụng",
      dataIndex: "available_packaging_packs",
      key: "available_packaging_packs",
      render: (value: number) => (
        <Typography.Text type={value > 0 ? "success" : "danger"}>{value} gói</Typography.Text>
      ),
      sorter: (a: any, b: any) => a.available_packaging_packs - b.available_packaging_packs,
    },
  ];

  const handleLoadMore = () => {
    setVisiblePlants((prev) => prev + 5);
  };

  return (
    <>
      <Flex gap={10} style={{ marginBottom: 10 }}>
        <Card title="Doanh thu" style={{ width: "70%" }}>
          <ReactApexChart
            options={revenueChartConfig.options as unknown as ApexOptions}
            series={revenueChartConfig.series}
            type="area"
            height={300}
          />
        </Card>
        <Card title="Tình trạng đơn hàng" style={{ width: "30%" }}>
          <ReactApexChart
            options={orderStatusChartOptions as ApexOptions}
            series={orderStatusData.series}
            type="pie"
          />
        </Card>
      </Flex>

      <Flex gap={10} style={{ marginBottom: 10 }}>
        <Card style={{ width: "50%" }} title="Thành phẩm và sản lượng còn lại">
          <Table columns={productYieldColumns} dataSource={remainingProducts} pagination={false} />
        </Card>
        <Card style={{ width: "50%" }} title="Top giống cây trồng">
          <div
            id="scrollableDiv"
            style={{
              height: 400,
              overflow: "auto",
            }}
          >
            <InfiniteScroll
              dataLength={topPlantsData.length}
              next={handleLoadMore}
              hasMore={(plantData?.data?.length || 0) > visiblePlants}
              loader={<Typography.Text type="secondary">Đang tải...</Typography.Text>}
              scrollableTarget="scrollableDiv"
            >
              {topPlantsData.length > 0 ? (
                topPlantsData.slice(0, 5).map((plant) => (
                  <Flex
                    key={plant.id}
                    gap={12}
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      background: token?.colorBgLayout,
                      marginBottom: 16,
                    }}
                  >
                    {plant.image_url && (
                      <Image
                        width={100}
                        style={{
                          borderRadius: 8,
                          objectFit: "cover",
                          border: "1px solid #f0f0f0",
                        }}
                        src={plant.image_url}
                        alt={plant.plant_name}
                      />
                    )}
                    <Flex vertical gap={12}>
                      <Typography.Title
                        level={5}
                        style={{
                          margin: 0,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {plant.plant_name}
                      </Typography.Title>

                      <Flex gap={4} align="center">
                        <Typography.Text strong>Số đơn hàng:</Typography.Text>
                        <TextField value={plant.number_order || 0} />
                      </Flex>
                    </Flex>
                  </Flex>
                ))
              ) : (
                <Empty description="Không có dữ liệu" />
              )}
            </InfiniteScroll>
          </div>
        </Card>
      </Flex>

      <Card title="Kế hoạch đang triển khai">
        {(plansData?.data?.length ?? 0) > 0 ? (
          plansData?.data.map((plan) => {
            const start = new Date(plan.start_date);
            const end = new Date(plan.end_date);
            const now = new Date();

            const total = end.getTime() - start.getTime();
            const passed = now.getTime() - start.getTime();
            const percent = Math.min(100, Math.max(0, (passed / total) * 100));

            const associatedPlant = plantData?.data?.find((plant) => plant.id === plan.plant_id);

            return (
              <Flex
                key={plan.id}
                gap={12}
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: token?.colorBgLayout,
                  marginBottom: 16,
                }}
              >
                {associatedPlant?.image_url && (
                  <Image
                    width={200}
                    style={{
                      borderRadius: 8,
                      objectFit: "cover",
                      border: "1px solid #f0f0f0",
                    }}
                    src={associatedPlant.image_url}
                    alt={associatedPlant.plant_name}
                  />
                )}
                <Flex vertical gap={12} style={{ width: "100%" }}>
                  <Typography.Title
                    level={5}
                    style={{
                      margin: 0,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    #{plan.id} {plan.plan_name} <StatusTag status={plan.status} />
                  </Typography.Title>

                  <Flex gap={4} align="center">
                    <Typography.Text strong>Khu đất</Typography.Text>
                    <TextField value={plan.yield_name || "N/A"} />
                  </Flex>

                  <Flex gap={4} align="center">
                    <Typography.Text strong>Cây trồng</Typography.Text>
                    <TextField value={associatedPlant?.plant_name || "N/A"} />
                  </Flex>

                  <Flex gap={4} align="center">
                    <Typography.Text strong>Thời gian:</Typography.Text>
                    <DateField value={plan.start_date} format="HH:mm DD/MM/YYYY" />
                    <Typography.Text>→</Typography.Text>
                    <DateField value={plan.end_date} format="HH:mm DD/MM/YYYY" />
                  </Flex>

                  <Progress
                    percent={parseFloat(percent.toFixed(2))}
                    status={
                      plan.status === "Complete"
                        ? "success"
                        : plan.status === "Cancel"
                          ? "exception"
                          : "active"
                    }
                  />
                </Flex>
              </Flex>
            );
          })
        ) : (
          <Empty description="Chưa có kế hoạch nào cho đơn hàng này" />
        )}
      </Card>
    </>
  );
};
