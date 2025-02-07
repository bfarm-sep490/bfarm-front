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
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { EnvironmentDashboard } from "../../components/dashboard/environmentDashboard";
import { RealTimeEnvironment } from "../../components/dashboard/realTimeCardEnviroment";

dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);

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
    <div>
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
    </div>
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
  const item_3 = (
    <>
      <p>Nhân viên phụ trách</p>
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
    {
      key: "3",
      label: "Nhân viên phụ trách",
      children: item_3,
    },
    {
      key: "4",
      label: "Thông tin vật tư",
      children: item_3,
    },
    {
      key: "5",
      label: "Thông tin hoạt động",
      children: item_3,
    },
    {
      key: "6",
      label: "Khu đất",
      children: item_3,
    },
  ];
  return (
    <>
      <Tabs tabPosition={"left"} defaultActiveKey="1" items={items} />
    </>
  );
};

type PlanObservationProps = {
  data: any;
};
export const PlanObservation = (props: PlanObservationProps) => {
  const [chosenLand, setChosenLand] = useState<any>(null);
  const [deviceCodes, setDeviceCodes] = useState<string[]>([]);
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    if (props.data?.lands?.length > 0) {
      setOptions(
        props.data.lands.map((land: any) => ({
          label: land.name,
          value: land.id,
        }))
      );
      setChosenLand(props.data.lands[0]);
    }
  }, [props.data]);

  useEffect(() => {
    if (chosenLand) {
      setDeviceCodes(chosenLand.devices.map((device: any) => device.code));
    }
  }, [chosenLand]);

  return (
    <>
      <Space
        align="center"
        style={{ display: "flex", gap: "5px", marginBottom: "20px" }}
      >
        <Title level={5}>Khu đất:</Title>
        <Select
          defaultValue={chosenLand?.id}
          options={options}
          style={{ width: "300px" }}
          onChange={(value) => {
            const land = props.data.lands.find((l: any) => l.id === value);
            setChosenLand(land);
          }}
        />
      </Space>
      <Flex style={{ gap: "20px" }}>
        <div style={{ flex: 0.4 }}>
          <RealTimeEnvironment
            device_codes={deviceCodes}
            land_id={chosenLand?.id}
          />
        </div>
        <div style={{ flex: 2.7 }}>
          <EnvironmentDashboard
            data={props.data?.environment_data}
            land_id={chosenLand?.id}
          />
        </div>
      </Flex>
    </>
  );
};

export const PlanShow: React.FC = () => {
  const translate = useTranslate();
  const { query } = useShow();
  const { data, isLoading } = query;
  const record = data?.data;
  const items = [
    {
      key: "1",
      label: "Thông tin",
      children: <PlanGeneralInformation data={record} />,
    },
    {
      key: "2",
      label: "Theo dõi môi trường",
      children: <PlanObservation data={record} />,
    },
    {
      key: "3",
      label: "Tiến trình",
      children: (
        <>
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
            </Card>
          </div>
        </>
      ),
    },
  ];
  return (
    <Show title="Chi tiết kế hoạch" isLoading={false}>
      <Tabs defaultActiveKey="1" centered items={items} />
    </Show>
  );
};
