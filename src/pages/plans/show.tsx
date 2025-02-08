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
import { EnvironmentDashboard } from "../../components/plan/environmentDashboard";
import { RealTimeEnvironment } from "../../components/plan/realTimeCardEnviroment";
import { ShowActivities } from "../../components/plan/showActivities";
import { PlanGeneralInformation } from "../../components/plan/planGeneralInfomation";
import { PlanObservation } from "../../components/plan/planObervation";

dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);

const { Title } = Typography;

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
      children: <ShowActivities />,
    },
  ];
  return (
    <Show title="Chi tiết kế hoạch" isLoading={false}>
      <Tabs defaultActiveKey="1" centered items={items} />
    </Show>
  );
};
