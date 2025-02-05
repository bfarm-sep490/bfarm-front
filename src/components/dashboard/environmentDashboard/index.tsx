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

dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);

const { Title } = Typography;
export interface IEnvironmentData {
  land_id: number;
  date: string; // Dữ liệu ngày dạng YYYY-MM-DD
  air_temp_value?: number;
  air_humidity_value?: number;
  soil_temp_value?: number;
}

export interface EnvironmentDashboardProps {
  land_id: number;
  data: IEnvironmentData[];
}

interface ChartConfig {
  data: any[];
  xField: string;
  yField: string;
  smooth: boolean;
  color: string;
  legend: boolean;
}

export const EnvironmentDashboard = (props: EnvironmentDashboardProps) => {
  const [typeData, setTypeData] = useState<string>("air_temp_value");
  const [timeData, setTimeData] = useState<string>("date");
  const [record, setRecord] = useState<IEnvironmentData[]>(props.data || []);
  const [title, setTitle] = useState<string>(
    "Nhiệt độ môi trường trung bình theo thời gian"
  );
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    data: [],
    xField: "date",
    yField: "air_temp_value",
    smooth: true,
    color: "#ff4d4f",
    legend: false,
  });

  const aggregateData = (data: IEnvironmentData[], timeFilter: string) => {
    if (timeFilter === "date") {
      return data;
    }

    const groupedData: Record<string, { sum: number; count: number }> = {};

    data.forEach((item) => {
      let key = "";
      if (timeFilter === "week") {
        key = dayjs(item.date).isoWeek().toString();
      } else if (timeFilter === "month") {
        key = dayjs(item.date).format("YYYY-MM");
      }

      if (!groupedData[key]) {
        groupedData[key] = { sum: 0, count: 0 };
      }

      const value = Number(item[typeData as keyof IEnvironmentData]) || 0;
      groupedData[key].sum += value;
      groupedData[key].count += 1;
    });

    return Object.entries(groupedData).map(([key, { sum, count }]) => ({
      land_id: props.land_id,
      date: key,
      [typeData]: count > 0 ? sum / count : 0, // Tính trung bình
    }));
  };

  useEffect(() => {
    if (props.land_id && props.data) {
      const filteredData = props.data.filter(
        (land) => land.land_id === props.land_id
      );
      const aggregatedData = aggregateData(filteredData, timeData);

      setRecord(aggregatedData);
      setChartConfig({
        data: aggregatedData,
        xField: "date",
        yField: typeData,
        smooth: true,
        color: "#ff4d4f",
        legend: false,
      });
    }
  }, [props.data, props.land_id, typeData, timeData]);

  function handleTypeChange(value: string) {
    setTypeData(value);
    switch (value) {
      case "air_temp_value":
        setTitle("Nhiệt độ môi trường trung bình theo thời gian");
        break;
      case "air_humidity_value":
        setTitle("Độ ẩm không khí trung bình theo thời gian");
        break;
      case "soil_temp_value":
        setTitle("Độ ẩm đất trung bình theo thời gian");
        break;
    }
  }

  function handleTimeChange(value: string) {
    setTimeData(value);
  }

  return (
    <>
      <Title level={5}>{title}</Title>
      <Flex style={{ gap: "20px" }}>
        <Select
          defaultValue="air_temp_value"
          style={{ width: "300px" }}
          onChange={handleTypeChange}
        >
          <Select.Option value="air_temp_value">
            Nhiệt độ môi trường
          </Select.Option>
          <Select.Option value="air_humidity_value">
            Độ ẩm không khí
          </Select.Option>
          <Select.Option value="soil_temp_value">Độ ẩm đất</Select.Option>
        </Select>
        <Select
          defaultValue="date"
          style={{ width: "300px" }}
          onChange={handleTimeChange}
        >
          <Select.Option value="date">Theo ngày</Select.Option>
          <Select.Option value="week">Theo tuần</Select.Option>
          <Select.Option value="month">Theo tháng</Select.Option>
        </Select>
      </Flex>
      <Line {...chartConfig} />
    </>
  );
};
