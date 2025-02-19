import {
  Image,
  Card,
  Typography,
  Space,
  Tag,
  Flex,
  Divider,
  Row,
  Col,
  Badge,
  Grid,
  Button,
} from "antd";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  ContainerOutlined,
  ExclamationCircleOutlined,
  ExperimentOutlined,
  BranchesOutlined,
  AuditOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  GiftOutlined,
  DashboardOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { DateField, Show, ShowButton, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { useNavigate, useParams } from "react-router";
import React from "react";
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export const PlanShowV2 = () => {
  const { id } = useParams();
  const { query: queryResult } = useShow({
    resource: "plans",
    id: id,
  });
  const [icon, setIcon] = React.useState(true);
  const [icon1, setIcon11] = React.useState(true);
  const navigate = useNavigate();
  const isLoading = queryResult.isLoading;
  const data = queryResult.data?.data;

  const [state, setState] = React.useState({
    series: [
      {
        name: "Chưa sửa dụng",
        data: [44, 55, 41, 67, 22, 43, 21, 49],
      },
      {
        name: "Đã sử dụng",
        data: [13, 23, 20, 8, 13, 27, 33, 12],
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
        categories: [
          "Phân bón loại 1",
          "Phân bón loại 2",
          "Phân bón loại 3",
          "Phân bón loại 4",
          "Phân bón loại 5",
          "Thuốc trừ sâu 1",
          "Thuốc trừ sâu 2",
          "Vật tư",
        ],
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "right",
        offsetX: 0,
        offsetY: 50,
      },
    },
  });
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
  const [state3, setState3] = React.useState({
    series: [
      {
        name: "Flies",
        data: [
          { x: new Date("2023-01-01").getTime(), y: 400 },
          { x: new Date("2023-01-02").getTime(), y: 430 },
          { x: new Date("2023-01-03").getTime(), y: 448 },
          { x: new Date("2023-01-04").getTime(), y: 470 },
          { x: new Date("2023-01-05").getTime(), y: 540 },
          { x: new Date("2023-01-06").getTime(), y: 580 },
          { x: new Date("2023-01-07").getTime(), y: 690 },
          { x: new Date("2023-01-08").getTime(), y: 1100 },
          { x: new Date("2023-01-09").getTime(), y: 1200 },
          { x: new Date("2023-01-10").getTime(), y: 1380 },
        ],
      },
    ],
    options: {
      chart: {
        id: "chart2",
        type: "line",
        height: 250,
        toolbar: {
          show: false,
        },
      },
      colors: ["#FF4560"],
      stroke: {
        width: 2,
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        labels: {
          formatter: (value: any) => `${value} units`,
        },
      },
    },
    seriesLine: [
      {
        name: "Flies",
        data: [
          { x: new Date("2023-01-01").getTime(), y: 400 },
          { x: new Date("2023-01-02").getTime(), y: 430 },
          { x: new Date("2023-01-03").getTime(), y: 448 },
          { x: new Date("2023-01-04").getTime(), y: 470 },
          { x: new Date("2023-01-05").getTime(), y: 540 },
          { x: new Date("2023-01-06").getTime(), y: 580 },
          { x: new Date("2023-01-07").getTime(), y: 690 },
          { x: new Date("2023-01-08").getTime(), y: 1100 },
          { x: new Date("2023-01-09").getTime(), y: 1200 },
          { x: new Date("2023-01-10").getTime(), y: 1380 },
        ],
      },
    ],
    optionsLine: {
      chart: {
        id: "chart1",
        height: 120,
        type: "area",
        brush: {
          target: "chart2",
          enabled: true,
        },
        selection: {
          enabled: true,
          xaxis: {
            min: new Date("2023-01-03").getTime(),
            max: new Date("2023-01-08").getTime(),
          },
        },
      },
      colors: ["#008FFB"],
      stroke: {
        width: [1, 2],
        curve: "smooth",
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.85,
          opacityTo: 0.1,
        },
      },
      xaxis: {
        type: "datetime",
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        tickAmount: 2,
      },
    },
  });
  const handle = (data: any) => {
    setIcon(data);
  };
  const handle1 = (data: any) => {
    setIcon11(data);
  };
  const breakpoint = Grid.useBreakpoint();
  return (
    <div>
      <Button
        type="text"
        style={{ width: "40px", height: "40px" }}
        onClick={() => navigate(`/plans`)}
      >
        <ArrowLeftOutlined style={{ width: "50px", height: "50px" }} />
      </Button>
      <div>
        <Typography.Title level={3}>📋 Thông tin kế hoạch</Typography.Title>
        <Card loading={isLoading} title="Thông tin chung">
          <Flex
            gap={breakpoint.md ? 30 : 16}
            vertical={!breakpoint.md}
            justify="center"
            align="center"
          >
            <Image
              style={{
                borderRadius: 10,
                width: breakpoint.md ? "300px" : "100%",
              }}
              width={300}
              height={400}
              src={
                data?.seed?.imageUrl ||
                "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2024/1/13/xa-lach-1705113923296944450397.jpg"
              }
            />
            <Flex vertical gap={16} style={{ flex: 1 }}>
              <Typography.Title level={4}>
                🌱 {data?.name || "Không có tên"}
              </Typography.Title>
              <Divider />
              <Space align="start" style={{ marginTop: 12 }}>
                <EnvironmentOutlined style={{ fontSize: 16 }} />
                <Typography.Text strong>Thời gian:</Typography.Text>
                <Typography.Text>
                  {data?.status === "on-going"
                    ? `${data?.start_date || "Chưa có"} - ${
                        data?.end_date || "Đang cập nhật"
                      }`
                    : data?.status === "pending"
                    ? "Chưa triển khai"
                    : "Không xác định"}
                </Typography.Text>
              </Space>

              <Space align="start" style={{ marginTop: 12 }}>
                <UserOutlined style={{ fontSize: 16 }} />
                <Typography.Text strong>Cây trồng:</Typography.Text>
                <Typography.Text>
                  {data?.seed?.name || "Không có"}
                </Typography.Text>
              </Space>

              <Space align="start" style={{ marginTop: 12 }}>
                <UserOutlined style={{ fontSize: 16 }} />
                <Typography.Text strong>Tổng diện tích:</Typography.Text>
                <Typography.Text>
                  {data?.lands?.length || "Không có"}
                </Typography.Text>
              </Space>
              <Space align="start" style={{ marginTop: 12 }}>
                <UserOutlined style={{ fontSize: 16 }} />
                <Typography.Text strong>Sản lượng dự kiến:</Typography.Text>
                <Typography.Text>
                  {data?.expected_yield || "Không có"}
                </Typography.Text>
              </Space>

              <Space align="start" style={{ marginTop: 12 }}>
                <UserOutlined style={{ fontSize: 16 }} />
                <Typography.Text strong>Trạng thái:</Typography.Text>
                <Tag color={data?.status === "on-going" ? "red" : "green"}>
                  {data?.status || "Không hoạt động"}
                </Tag>
              </Space>
              <Space align="start" style={{ marginTop: 12 }}>
                <CalendarOutlined style={{ fontSize: 16 }} />
                <Typography.Text strong>Ngày tạo:</Typography.Text>
                <Typography.Text type="secondary">
                  <DateField
                    value={data?.created_at}
                    format="MMMM, YYYY hh:mm A"
                  />
                </Typography.Text>
              </Space>
            </Flex>
          </Flex>
        </Card>
        <Divider />
        <Flex>
          <Typography.Title level={3}>👨‍🌾 Tổng quan</Typography.Title>
          {icon ? (
            <CaretDownOutlined onClick={() => handle(false)} />
          ) : (
            <CaretUpOutlined onClick={() => handle(true)} />
          )}
        </Flex>
        <div style={{ display: icon ? "block" : "none" }}>
          <Row gutter={[16, 16]} justify="center" style={{ marginTop: "30px" }}>
            <Col xs={24} sm={12} md={6}>
              <Card title="📦 Sản lượng thu hoạch">
                <Typography.Title level={2} style={{ textAlign: "center" }}>
                  1000
                </Typography.Title>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card
                title="⚠️ Vấn đề"
                extra={
                  <ShowButton
                    hideText
                    size="small"
                    onClick={() => navigate(`/plans/${id}/problems`)}
                  />
                }
              >
                <Typography.Title level={2} style={{ textAlign: "center" }}>
                  1 vấn đề
                </Typography.Title>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card title="🌍 Số khu đất">
                <Typography.Title level={2} style={{ textAlign: "center" }}>
                  2
                </Typography.Title>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card title="👨‍🌾 Số nông dân">
                <Typography.Title level={2} style={{ textAlign: "center" }}>
                  2
                </Typography.Title>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} justify="center" style={{ marginTop: "20px" }}>
            <Col xs={24} md={12}>
              <Card title="📊 Phân bón & Thuốc trừ sâu">
                <ReactApexChart
                  options={state.options as ApexOptions}
                  series={state.series}
                  type="bar"
                  height={280}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                title={
                  <Flex gap={8}>
                    <DashboardOutlined />
                    {"Biểu đổ xu hướng xảy ra vấn đề"}
                  </Flex>
                }
              >
                <div id="chart-line2" style={{ marginBottom: "0px" }}>
                  <ReactApexChart
                    options={state3.options as ApexOptions}
                    series={state3.series}
                    type="line"
                    height={180}
                  />
                </div>
                <div id="chart-line">
                  <ReactApexChart
                    style={{ marginTop: "0px" }}
                    options={state3.optionsLine as ApexOptions}
                    series={state3.seriesLine}
                    type="area"
                    height={80}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <Divider />
        <Flex>
          <Typography.Title level={3}>👨‍🌾 Công việc</Typography.Title>
          {icon1 ? (
            <CaretDownOutlined onClick={() => handle1(false)} />
          ) : (
            <CaretUpOutlined onClick={() => handle1(true)} />
          )}
        </Flex>
        <div style={{ display: icon1 ? "block" : "none" }}>
          <Row gutter={[16, 16]} justify="center" style={{ marginTop: "10px" }}>
            <Col xs={24} md={12} lg={12} xl={12}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <Card
                    title={
                      <Flex align="center" gap={8}>
                        <BranchesOutlined style={{ color: "#52c41a" }} />
                        {"Chăm sóc"}
                      </Flex>
                    }
                    extra={
                      <ShowButton
                        hideText
                        size="small"
                        onClick={() =>
                          navigate(`/plans/${id}/productive-tasks`)
                        }
                      />
                    }
                  >
                    <Typography.Title
                      level={2}
                      style={{ fontSize: 28, textAlign: "center" }}
                    >
                      12
                      <strong style={{ fontSize: 20, color: "gray" }}>
                        /38
                      </strong>
                    </Typography.Title>
                    <Typography.Text
                      type="secondary"
                      style={{
                        textAlign: "end",
                        fontSize: 12,
                        fontStyle: "italic",
                      }}
                    >
                      Lần cuối: 12/02/2025
                    </Typography.Text>
                  </Card>
                </Col>

                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <Card
                    title={
                      <Flex align="center" gap={8}>
                        <AuditOutlined style={{ color: "#fa8c16" }} />
                        {"Kiểm định"}
                      </Flex>
                    }
                    extra={
                      <ShowButton
                        hideText
                        size="small"
                        onClick={() =>
                          navigate(`/plans/${id}/inspecting-tasks`)
                        }
                      />
                    }
                  >
                    <Typography.Title
                      level={2}
                      style={{ fontSize: 28, textAlign: "center" }}
                    >
                      0
                      <strong style={{ fontSize: 20, color: "gray" }}>
                        /1
                      </strong>
                    </Typography.Title>
                    <Typography.Text
                      type="secondary"
                      style={{
                        textAlign: "end",
                        fontSize: 12,
                        fontStyle: "italic",
                      }}
                    >
                      Chưa kiểm định lần nào
                    </Typography.Text>
                  </Card>
                </Col>

                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <Card
                    title={
                      <Flex align="center" gap={8}>
                        <GiftOutlined style={{ color: "#52c41a" }} />
                        {"Thu hoạch"}
                      </Flex>
                    }
                    extra={
                      <ShowButton
                        hideText
                        size="small"
                        onClick={() =>
                          navigate(`/plans/${id}/harvesting-tasks`)
                        }
                      />
                    }
                  >
                    <Typography.Title
                      level={2}
                      style={{ fontSize: 28, textAlign: "center" }}
                    >
                      0
                      <strong style={{ fontSize: 20, color: "gray" }}>
                        /1
                      </strong>
                    </Typography.Title>
                    <Typography.Text
                      type="secondary"
                      style={{
                        textAlign: "end",
                        fontSize: 12,
                        fontStyle: "italic",
                      }}
                    >
                      Chưa thu hoạch lần nào
                    </Typography.Text>
                  </Card>
                </Col>

                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <Card
                    title={
                      <Flex align="center" gap={8}>
                        <FileTextOutlined style={{ color: "#1890ff" }} />
                        {"Công việc trống"}
                      </Flex>
                    }
                    extra={<ShowButton hideText size="small" />}
                  >
                    <Typography.Title
                      level={2}
                      style={{ fontSize: 28, textAlign: "center" }}
                    >
                      12
                    </Typography.Title>
                    <Typography.Text> Lần cuối: 12/02/2025</Typography.Text>
                  </Card>
                </Col>
              </Row>
            </Col>

            <Col xs={24} md={12} lg={12} xl={12}>
              <Card
                title={
                  <Flex align="center" gap={8}>
                    <DashboardOutlined />
                    {"Biểu đồ tổng hợp công việc"}
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
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
