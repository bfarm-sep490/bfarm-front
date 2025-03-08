import { Image, Card, Typography, Space, Tag, Flex, Divider, Row, Col, Grid, Button } from "antd";
import {
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  BranchesOutlined,
  AuditOutlined,
  GiftOutlined,
  DashboardOutlined,
  ArrowLeftOutlined,
  FieldTimeOutlined,
  GoldOutlined,
  GroupOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { DateField, ShowButton } from "@refinedev/antd";
import { HttpError, useOne } from "@refinedev/core";
import { useNavigate, useParams } from "react-router";
import React, { PropsWithChildren } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { DropDownSection } from "../../components/section/drop-down-section";
import { ActivityCard } from "../../components/card/card-activity";
import { StatusTag } from "../../components/caring-task/status-tag";
import { StatusModal } from "@/components/plan/completd-modal";

interface IGeneralPlan {
  plan_id: number;
  plan_name: string;
  plant_information: {
    plant_id: number;
    plant_name: string;
    plant_image: string;
  };
  yield_information: {
    yield_id: number;
    yield_name: string;
    yield_unit: string;
    area: number;
  };
  start_date: Date;
  end_date: Date;
  estimated_product: number;
  estimated_unit: string;
  status: string;
  created_at: Date;
  expert_information: {
    expert_id: number;
    expert_name: string;
  };
  description: string;
}
interface IProblem {
  id: number;
  plan_id: number;
  problem_name: string;
  description: string;
  date: Date;
  problem_type: string;
  status: string;
  result_content: string;
  problem_images: {
    image_id: number;
    url: string;
  }[];
}
export const PlanShow = ({ children }: PropsWithChildren<{}>) => {
  const { id } = useParams();
  const [completedModal, setCompletedModal] = React.useState(false);
  const [valueModal, setValueModal] = React.useState("");
  const {
    data: generalData,
    isLoading: generalLoading,
    error: generalError,
  } = useOne<IGeneralPlan, HttpError>({
    resource: "plans",
    id: `${id}/general`,
  });
  const {
    data: farmersData,
    isLoading: farmersLoading,
    error: farmersError,
  } = useOne<any, HttpError>({
    resource: "plans",
    id: `${id}/farmers`,
    queryOptions: {
      staleTime: 1000 * 60,
      cacheTime: 1000 * 60,
    },
  });
  const { data: problemsData, isLoading: problemsLoading } = useOne<IProblem[], HttpError>({
    resource: "plans",
    id: `${id}/problems`,
  });
  const general_info = generalData?.data;
  const farmers_info = farmersData?.data as any[];
  const navigate = useNavigate();

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
        position: "bottom",
        offsetX: 0,
        offsetY: 0,
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
  const [state5, setState5] = React.useState({
    series: [
      {
        name: "Độ ẩm %",
        type: "column",
        data: [40, 50, 41, 67, 22, 41, 20, 35, 75, 32, 25, 16],
      },
      {
        name: "Nhiệt độ °C",
        type: "line",
        data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: [0, 4],
      },
      labels: [
        "01 Jan 2001",
        "02 Jan 2001",
        "03 Jan 2001",
        "04 Jan 2001",
        "05 Jan 2001",
        "06 Jan 2001",
        "07 Jan 2001",
        "08 Jan 2001",
        "09 Jan 2001",
        "10 Jan 2001",
        "11 Jan 2001",
        "12 Jan 2001",
      ],
      yaxis: [
        {
          opposite: true,
          title: {
            text: "Nhiệt độ °C",
            style: {
              fontWeight: "bold",
            },
          },
        },
        {
          title: {
            text: "Độ ẩm %",
            style: {
              fontWeight: "bold",
            },
          },
        },
      ],
    },
  });

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
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} md={12} lg={12} xl={12}>
            <Typography.Title level={3}>📋 Thông tin kế hoạch</Typography.Title>
          </Col>
          <Col xs={24} md={12} lg={12} xl={12}>
            <Flex justify="end">
              {general_info?.status === "Pending" && (
                <Space>
                  <Button
                    color="danger"
                    variant="solid"
                    onClick={() => {
                      setValueModal("cancel");
                      setCompletedModal(true);
                    }}
                    icon={<CloseCircleOutlined />}
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    color="primary"
                    variant="solid"
                    onClick={() => {
                      navigate(`/plans/${id}/approve`);
                    }}
                    icon={<EditOutlined />}
                  >
                    Chấp nhận
                  </Button>
                </Space>
              )}
              {general_info?.status === "Ongoing" && (
                <Space>
                  <Button
                    color="primary"
                    variant="solid"
                    onClick={() => {
                      setValueModal("complete");
                      setCompletedModal(true);
                    }}
                    icon={<CheckCircleOutlined />}
                  >
                    Kết thúc
                  </Button>
                </Space>
              )}
            </Flex>
          </Col>
        </Row>
        <Divider />
        <Card title="Thông tin chung" loading={generalLoading}>
          <Flex
            gap={breakpoint.md ? 30 : 16}
            vertical={!breakpoint.md}
            justify="center"
            align="center"
          >
            <Image
              loading="lazy"
              style={{
                borderRadius: 10,
                width: breakpoint.md ? "300px" : "100%",
              }}
              width={300}
              height={400}
              src={
                general_info?.plant_information?.plant_image ||
                "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2024/1/13/xa-lach-1705113923296944450397.jpg"
              }
            />
            <Flex vertical gap={16} style={{ flex: 1 }}>
              <Typography.Title level={4}>
                🌱 {general_info?.plan_name || "Chưa xác định"}
              </Typography.Title>
              <Divider />
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Space align="start" style={{ marginTop: 12 }}>
                    <EnvironmentOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Thời gian:</Typography.Text>
                    <Typography.Text>
                      {general_info?.start_date ? (
                        <DateField value={general_info?.start_date} />
                      ) : (
                        "Chưa xác định"
                      )}{" "}
                      -
                      {general_info?.end_date ? (
                        <DateField value={general_info?.end_date} />
                      ) : (
                        "Chưa xác định"
                      )}
                    </Typography.Text>
                  </Space>

                  <Space align="start" style={{ marginTop: 12 }}>
                    <UserOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Cây trồng:</Typography.Text>
                    <Typography.Text>
                      {general_info?.plant_information?.plant_name || "Chưa xác định"}
                    </Typography.Text>
                  </Space>

                  <Space align="start" style={{ marginTop: 12 }}>
                    <GoldOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Khu đất</Typography.Text>
                    <Typography.Text>
                      <Tag>{general_info?.yield_information?.yield_name || "Chưa xác định"}</Tag>
                    </Typography.Text>
                  </Space>
                  <Space align="start" style={{ marginTop: 12 }}>
                    <GroupOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Sản lượng dự kiến:</Typography.Text>
                    <Typography.Text>
                      {general_info?.estimated_product || "Không có"}{" "}
                      {general_info?.estimated_unit || "Không có"}
                    </Typography.Text>
                  </Space>

                  <Space align="start" style={{ marginTop: 12 }}>
                    <FieldTimeOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Trạng thái:</Typography.Text>
                    <StatusTag status={general_info?.status || "Default"} />
                  </Space>
                  <Space align="start" style={{ marginTop: 12 }}>
                    <CalendarOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Ngày tạo:</Typography.Text>
                    <Typography.Text type="secondary">
                      <DateField value={general_info?.created_at} format="hh:mm DD/MM/YYYY" />
                    </Typography.Text>
                  </Space>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Space align="start" style={{ marginTop: 12 }}>
                    <GroupOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Chuyên gia:</Typography.Text>
                    <Typography.Text>
                      {general_info?.expert_information.expert_name}
                    </Typography.Text>
                  </Space>
                  <Space align="start" style={{ marginTop: 12 }}>
                    <SnippetsOutlined style={{ fontSize: 16 }} />
                    <Typography.Text strong>Mô tả</Typography.Text>
                    <Typography.Paragraph>
                      {general_info?.description || "Không có mô tả"}
                    </Typography.Paragraph>
                  </Space>
                </Col>
              </Row>
            </Flex>
          </Flex>
        </Card>
        <Divider />
        <DropDownSection title="Tổng quan">
          <Row gutter={[16, 16]} justify="center" style={{ marginTop: "30px" }}>
            <Col xs={24} sm={12} md={6}>
              <Card title="📦 Sản lượng thu hoạch">
                <Typography.Title level={2} style={{ textAlign: "center" }}>
                  1000
                </Typography.Title>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <ActivityCard
                title="⚠️ Vấn đề"
                navigate={`/plans/${id}/problems`}
                completedTasks={problemsData?.data?.length || 0}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <ActivityCard
                loading={generalLoading}
                title={`🌍 Tổng diện tích (${general_info?.yield_information?.area})`}
                completedTasks={general_info?.yield_information?.area || 0}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <ActivityCard
                loading={farmersLoading}
                title="👨‍🌾 Số nông dân"
                completedTasks={farmers_info?.length}
              />
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
        </DropDownSection>
        <Divider />

        <DropDownSection title="Công việc">
          <Row gutter={[16, 16]} justify="center" style={{ marginTop: "10px" }}>
            <Col xs={24} md={12} lg={12} xl={12}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <ActivityCard
                    icon={<BranchesOutlined style={{ color: "#52c41a" }} />}
                    completedTasks={12}
                    title="Chăm sóc"
                    totalActivity={13}
                    lastActivityDate="Lần cuối: 12/02/2025"
                    navigate={`/plans/${id}/caring-tasks`}
                  />
                </Col>

                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <ActivityCard
                    icon={<AuditOutlined style={{ color: "#fa8c16" }} />}
                    completedTasks={12}
                    title="Kiểm định"
                    totalActivity={13}
                    lastActivityDate="Lần cuối: 12/02/2025"
                    navigate={`/plans/${id}/inspecting-tasks`}
                  />
                </Col>

                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <ActivityCard
                    icon={<GiftOutlined style={{ color: "#52c41a" }} />}
                    completedTasks={12}
                    title="Thu hoạch"
                    totalActivity={13}
                    lastActivityDate="Lần cuối: 12/02/2025"
                    navigate={`/plans/${id}/harvesting-tasks`}
                  />
                </Col>

                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <ActivityCard
                    icon={<AuditOutlined style={{ color: "#fa8c16" }} />}
                    completedTasks={12}
                    title="Đóng gói"
                    lastActivityDate="Chưa có công việc mới"
                    navigate={`/plans/${id}/packaging-tasks`}
                  />
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
        </DropDownSection>
        <Divider />

        {/* <DropDownSection title="Quan sát">
          <Row gutter={[16, 16]} justify={"start"} style={{ marginTop: "10px" }}>

            <Col
              xs={24}
              md={8}
              lg={8}
              xl={8}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {[
                {
                  channel: "blcapstone/1",
                  id: "air_temperature",
                  title: "Nhiệt độ °C",
                  icon: <SunOutlined />,
                },
                {
                  channel: "blcapstone/1/air_humidity",
                  id: "air_humidity",
                  title: "Độ ẩm không khí %",
                  icon: <CloudOutlined />,
                },
                {
                  channel: "blcapstone/1/land_humidity",
                  id: "land_humidity",
                  title: "Độ ẩm đất %",
                  icon: <BulbOutlined />,
                },
              ].map((item) => (
                <RealTimeContentCard
                  key={item.id}
                  channel_name={item.channel}
                  component_id={item.id}
                  title={item.title}
                  icon={item.icon}
                />
              ))}
            </Col>

            <Col xs={24} md={16} lg={16} xl={16}>
              <Card
                title={
                  <Flex align="center" gap={8}>
                    <DashboardOutlined />
                    Hệ thống cảnh báo
                  </Flex>
                }
                style={{ height: "100%" }}
                extra={<ShowButton hideText size="small" />}
              >
                <Typography.Text type="warning">
                  Chưa có cảnh báo nào
                </Typography.Text>
              </Card>
            </Col>
          </Row>
          <Card
            style={{ marginTop: "10px" }}
            title="Biểu đồ nhiệt ẩm của khu đất"
          >
            <div>
              <div id="chart">
                <ReactApexChart
                  options={state5.options as ApexOptions}
                  series={state5.series}
                  type="line"
                  height={350}
                />
              </div>
              <div id="html-dist"></div>
            </div>
          </Card>
        </DropDownSection> */}
      </div>
      <StatusModal
        visible={completedModal}
        id={Number(id)}
        onClose={() => setCompletedModal(false)}
        status={valueModal}
      />
      {children}
    </div>
  );
};
