import { useShow, useTranslate } from "@refinedev/core";
import mqtt, { IClientOptions } from "mqtt";
import {
  Col,
  Divider,
  Flex,
  Layout,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Timeline,
} from "antd";
import type { GetProp, SelectProps, TabsProps } from "antd";
import React, { useState, useEffect } from "react";
import { AntdInferencer } from "@refinedev/inferencer/antd";
import { Typography, Button, MenuProps, Menu } from "antd";
import { Tabs } from "antd";
import {
  AndroidOutlined,
  AppleOutlined,
  AppstoreOutlined,
  BulbOutlined,
  CloudOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  DateField,
  NumberField,
  Show,
  Sider,
  TagField,
  TextField,
} from "@refinedev/antd";
import { Card } from "antd/lib";
import TextArea from "antd/es/input/TextArea";
import { set } from "lodash";
import { Line } from "@ant-design/plots";
import { color } from "bun";
import { Content } from "antd/es/layout/layout";

const { Title } = Typography;
type LabelRender = SelectProps["labelRender"];

type MenuItem = GetProp<MenuProps, "items">[number];

type PlanGeneralInformationProps = {
  data: any;
};
const GanttData: object[] = [
  {
    TaskID: 1,
    TaskName: "Project Initiation",
    StartDate: new Date("04/02/2019"),
    EndDate: new Date("04/21/2019"),
    subtasks: [
      {
        TaskID: 2,
        TaskName: "Identify Site location",
        StartDate: new Date("04/02/2019"),
        Duration: 4,
        Progress: 50,
      },
      {
        TaskID: 3,
        TaskName: "Perform Soil test",
        StartDate: new Date("04/02/2019"),
        Duration: 4,
        Progress: 50,
      },
      {
        TaskID: 4,
        TaskName: "Soil test approval",
        StartDate: new Date("04/02/2019"),
        Duration: 4,
        Progress: 50,
      },
    ],
  },
  {
    TaskID: 5,
    TaskName: "Project Estimation",
    StartDate: new Date("04/02/2019"),
    EndDate: new Date("04/21/2019"),
    subtasks: [
      {
        TaskID: 6,
        TaskName: "Develop floor plan for estimation",
        StartDate: new Date("04/04/2019"),
        Duration: 3,
        Progress: 50,
      },
      {
        TaskID: 7,
        TaskName: "List materials",
        StartDate: new Date("04/04/2019"),
        Duration: 3,
        Progress: 50,
      },
      {
        TaskID: 8,
        TaskName: "Estimation approval",
        StartDate: new Date("04/04/2019"),
        Duration: 3,
        Progress: 50,
      },
    ],
  },
];
export const PlanGeneralInformation = (props: PlanGeneralInformationProps) => {
  const [record, setRecord] = useState<any>(props?.data);
  useEffect(() => {
    setRecord(props.data);
  }, [props?.data]);
  const item_2 = (
    <>
      <Title level={4}>{record?.seed?.name}</Title>

      <Flex justify="space-between" style={{ gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <Title level={5}>{"Mô tả: "}</Title>
          <TextArea disabled={true} value={record?.seed?.description} />
        </div>
        <div style={{ flex: 1 }}>
          <Title level={5}>{"Nhiệt độ phù hợp:"}</Title>
          <TextField
            value={`${record?.seed?.min_temperature}°C - ${record?.seed?.max_temperature}°C`}
          />
          <Title level={5}>{"Độ ẩm không khí phù hợp:"}</Title>
          <TextField
            value={`${record?.seed?.min_humidity}% - ${record?.seed?.max_humidity}%`}
          />
          <Title level={5}>{"Độ ẩm đất phù hợp:"}</Title>
          <TextField
            value={`${record?.seed?.min_moisture}% - ${record?.seed?.max_moisture}%`}
          />
        </div>
      </Flex>
    </>
  );
  const item_1 = (
    <>
      <Title level={4}>{record?.name}</Title>

      <Flex justify="space-between" style={{ gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <Title level={5}>{"Thời gian:"}</Title>
          {record?.status !== "not-start" ? (
            <>
              <DateField value={`${record?.start_date}`} /> {" - "}
              {record?.end_date ? (
                <DateField value={` ${record.end_date}`} />
              ) : (
                "Đang tiếp tục"
              )}
            </>
          ) : (
            "Chưa bắt đầu"
          )}
          <Title level={5}>{"Tổng diện tích trồng"}</Title>
          <TextField
            value={`${record?.area || "Không tìm thấy dữ liệu"}
            `}
          />
          <Title level={5}>{"Khu đất:"}</Title>
          {record?.lands?.length > 0
            ? record?.lands.map((land: any) => (
                <TagField value={`${land?.name}`} key={land?.id} />
              ))
            : "Chưa có khu đất nào được gán"}
        </div>

        <div style={{ flex: 1 }}>
          <Title level={5}>{"Dự kiến sản lượng:"}</Title>
          <TextField
            value={`${record?.expected_yield || "Chưa có dữ liệu"} ${
              record?.expected_unit || ""
            }`}
          />
          <Title level={5}>{"Tổng sản lượng thu hoạch:"}</Title>
          <TextField
            value={
              record?.total_yield
                ? `${record?.total_yield} ${record?.expected_unit || ""}`
                : "Chưa có dữ liệu"
            }
          />
          <Title level={5}>{"Nhân viên:"}</Title>
          {record?.employees?.length > 0
            ? record?.employees.map((employee: any) => (
                <TagField
                  value={`${employee?.name} - ${employee?.role}`}
                  key={employee?.id}
                />
              ))
            : "Chưa có nhân viên nào được gán"}
        </div>
      </Flex>
    </>
  );
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Thông tin chung",
      children: item_1,
    },
    {
      key: "2",
      label: "Thông tin cây trồng",
      children: item_2,
    },
  ];
  return (
    <>
      <Title level={4} style={{ fontWeight: "bold", textAlign: "center" }}>
        THÔNG TIN
      </Title>

      <>
        <Tabs defaultActiveKey="1" items={items} />
      </>
    </>
  );
};
////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
type PlanObservationProps = {
  data: any;
};
export const PlanObservation = (props: PlanObservationProps) => {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [landHumidity, setLandHumidity] = useState(0);
  const [record, setRecord] = useState<any>(props?.data);
  const [chartConfig, setChartConfig] = useState<any>({});
  useEffect(() => {
    setRecord(props.data);
    if (props.data?.lands) {
      const formattedOptions = props.data?.lands.map((land: any) => ({
        value: land.id,
        label: land.name,
      }));
      setOptions(formattedOptions);
      console.log(props?.data?.environment_data);
      const config = {
        data: props?.data.environment_data,
        xField: "date",
        yField: "air_temp_value",
        smooth: true,
        color: "#ff4d4f",
        legend: false,
      };
      setChartConfig(config);
    }
  }, [props?.data]);
  const [chosenLand, setChosenLand] = useState<any>(null);
  const [oldCodeDevice, setOldCodeDevice] = useState<any>("");
  const [dataSourceTable, setDataSourceTable] = useState<any[]>([]);
  const [codeDevice, setCodeDevice] = useState<string>("");
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    const client = mqtt.connect("ws://broker.mqttdashboard.com:8000/mqtt");
    client.on("connect", () => {
      console.log("Connected to MQTT Broker");
      client.unsubscribeAsync("sep409-blcapstone/farm-owner/device");
      client.subscribe("sep409-blcapstone/farm-owner/device/AD889", (err) => {
        if (!err) {
          console.log(
            "subscribed to topic: sep409-blcapstone/farm-owner/device/" +
              codeDevice
          );
        } else {
          console.error("failed to subscribe", err);
        }
      });
    });
    client.on("message", (topic, message) => {
      console.log("message received", message.toString());
      var messageJson = JSON.parse(message.toString());

      setTemperature(messageJson?.air_temperature);
      setHumidity(messageJson?.air_humidity);
      setLandHumidity(messageJson?.land_humidity);
    });
    client.on("error", (error) => {
      console.error("MQTT Error:", error);
    });
    return () => {
      if (client.connected) {
        client.end(true);
        console.log("disconnected from MQTT Broker");
      }
    };
  }, [codeDevice]);
  const labelRender: LabelRender = ({ label, value }) => {
    if (label) {
      const land = record?.lands?.find((land: any) => land.id === value);
      setChosenLand(land);
      if (land.devices.length > 0) {
        console.log("land.devices[0].code", land.devices[0].code);
        setOldCodeDevice(codeDevice);
        setCodeDevice(land.devices[0].code);
      }
      return label;
    }
    return <span>No option match</span>;
  };

  useEffect(() => {
    setDataSourceTable(props?.data?.tasks);
  }, props.data);

  return (
    <>
      <Title level={4} style={{ fontWeight: "bold", textAlign: "center" }}>
        THEO DÕI
      </Title>
      <Space align="center" style={{ display: "flex", gap: "5px" }}>
        <Title level={4}>Khu đất:</Title>
        <Select
          defaultActiveFirstOption={true}
          defaultValue={1}
          labelRender={labelRender}
          options={options}
          style={{ width: "300px" }}
        />
      </Space>
      <Divider />
      <Flex vertical={false} style={{ gap: "20px" }}>
        <div style={{ flex: 0.4, gap: "5px" }}>
          <div style={{ justifyContent: "space-between", display: "flex" }}>
            <Title level={5}>{"Theo dõi môi trường"}</Title>
            <a>{"Xem thêm"}</a>
          </div>
          <Flex vertical={true} style={{ gap: "20px" }}>
            <Card
              headStyle={{ color: "#FF9900" }}
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#FF9900" }}>Nhiệt độ </span>
                  <SunOutlined style={{ color: "#FF9900" }} />
                </div>
              }
              style={{
                color: "#FF9900",
                border: "1px solid #FF9900",
                backgroundColor: "transparent",
              }}
            >
              <Typography
                id={`air-temperature`}
                style={{
                  color: "#FF9900",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {temperature || "Không tìm thấy dữ liệu"}
              </Typography>
            </Card>
            <Card
              headStyle={{ color: "#3366CC" }}
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#3366CC" }}>Độ ẩm không khí</span>
                  <CloudOutlined style={{ color: "#3366CC" }} />
                </div>
              }
              style={{
                color: "##3366CC",
                border: "1px solid #3366CC",
                backgroundColor: "transparent",
              }}
            >
              <Typography
                id={`air-humidity`}
                style={{
                  color: "#3366CC",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {humidity || "Không tìm thấy dữ liệu"}
              </Typography>
            </Card>
            <Card
              headStyle={{ color: "#993333" }}
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#993333" }}>Độ ẩm đất</span>
                  <BulbOutlined style={{ color: "#993333" }} />
                </div>
              }
              style={{
                color: "#993333",
                border: "1px solid #993333",
                backgroundColor: "transparent",
              }}
            >
              <Typography
                id={`land-humidity`}
                style={{
                  color: "#993333",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {landHumidity || "Không tìm thấy dữ liệu"}
              </Typography>
            </Card>
          </Flex>
        </div>

        <div style={{ flex: 2.7 }}>
          <Title level={5}>{"Theo dõi tiến độ"}</Title>
          <Flex style={{ gap: "20px" }}>
            <Select
              defaultActiveFirstOption={true}
              defaultValue="air_temp"
              style={{ width: "300px" }}
            >
              <Select.Option value="air_temp">
                Nhiệt độ môi trường
              </Select.Option>
              <Select.Option value="air_humidity">
                Độ ẩm không khí
              </Select.Option>
              <Select.Option value="land_humidity">Độ ẩm đất</Select.Option>
            </Select>
            <Select
              defaultActiveFirstOption={true}
              defaultValue="day"
              style={{ width: "300px" }}
            >
              <Select.Option value="day">Theo ngày</Select.Option>
              <Select.Option value="week">Theo Tuần</Select.Option>
              <Select.Option value="month">Theo tháng</Select.Option>
            </Select>
          </Flex>
          <Line {...chartConfig} />
        </div>
      </Flex>
    </>
  );
};
//////////////////////////////////////////////////////////////////////////////////////////////////
export const PlanShow: React.FC = () => {
  const translate = useTranslate();
  const { query } = useShow();
  const { data, isLoading } = query;
  const record = data?.data;

  const tasks = [
    {
      id: 20,
      text: "New Task",
      start: new Date(2024, 5, 11),
      end: new Date(2024, 6, 12),
      duration: 1,
      progress: 2,
      type: "task",
      lazy: false,
    },
    {
      id: 47,
      text: "[1] Master project",
      start: new Date(2024, 5, 12),
      end: new Date(2024, 7, 12),
      duration: 8,
      progress: 0,
      parent: 0,
      type: "summary",
    },
    {
      id: 22,
      text: "Task",
      start: new Date(2024, 7, 11),
      end: new Date(2024, 8, 12),
      duration: 8,
      progress: 0,
      parent: 47,
      type: "task",
    },
    {
      id: 21,
      text: "New Task 2",
      start: new Date(2024, 7, 10),
      end: new Date(2024, 8, 12),
      duration: 3,
      progress: 0,
      type: "task",
      lazy: false,
    },
  ];

  const links = [{ id: 1, source: 20, target: 21, type: "e2e" }];

  const scales = [
    { unit: "month", step: 1, format: "MMMM yyy" },
    { unit: "day", step: 1, format: "d" },
  ];
  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
  };
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" tip={translate("loading")} />
      </div>
    );
  }

  return (
    <>
      <PlanGeneralInformation data={record} />
      <Divider />
      <PlanObservation data={record} />
      <Divider />
      <div>
        <Title level={3}>Tiến trình: Giai đoạn chuẩn bị</Title>
        <Card style={{ width: "100%", backgroundColor: "transparent" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Button>Giai đoạn chuẩn bị</Button>
            <Button>Giai đoạn chăm sóc</Button>
            <Button>Giai đoạn thu hoạch</Button>
          </div>
          <Divider></Divider>

          <Layout style={{ height: "100vh" }}></Layout>
        </Card>
      </div>
    </>
  );
};
