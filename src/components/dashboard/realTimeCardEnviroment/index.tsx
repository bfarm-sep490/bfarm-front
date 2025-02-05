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
import Title from "antd/lib/typography/Title";
type RealTimeEnvironmentProps = {
  land_id: number;
  device_codes: string[];
};
export const RealTimeEnvironment = (props: RealTimeEnvironmentProps) => {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [landHumidity, setLandHumidity] = useState(0);
  const [landId, setLandId] = useState<number>(props?.land_id);
  const [oldCodeDevice, setOldCodeDevice] = useState<any>("");
  const [codeDevice, setCodeDevice] = useState<string>("");

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
          setOldCodeDevice(codeDevice);
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
  useEffect(() => {
    setCodeDevice(props?.device_codes[0]);
    setLandId(props?.land_id);
  }, [props?.land_id, props?.device_codes]);
  return (
    <>
      <div style={{ justifyContent: "space-between", display: "flex" }}>
        <Title level={5}>{"Theo dõi môi trường"}</Title>
        <a>{"Xem thêm"}</a>
      </div>
      <Flex vertical={true} style={{ gap: "20px" }}>
        <Card
          headStyle={{ color: "#FF9900" }}
          title={
            <div style={{ display: "flex", justifyContent: "space-between" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
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
    </>
  );
};
