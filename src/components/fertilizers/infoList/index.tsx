import React from "react";
import type { IFertilizer } from "../../../interfaces";
import {
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  TagsOutlined,
  NumberOutlined,
  InfoCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { List, Typography, Space, theme, Card } from "antd";
import dayjs from "dayjs";
import { useTranslate } from "@refinedev/core";

type Props = {
  fertilizer?: IFertilizer;
};

export const FertilizerInfoList = ({ fertilizer }: Props) => {
  const { token } = theme.useToken();
  const t = useTranslate();

  return (
    <Card
      bordered={false}
      style={{
        marginTop: "16px",
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={[
          {
            title: t("Name", "Name"),
            icon: <TagsOutlined />,
            value: <Typography.Text>{fertilizer?.name}</Typography.Text>,
          },
          {
            title: t("fertilizers.fields.description", "Description"),
            icon: <InfoCircleOutlined />,
            value: (
              <Typography.Text>{fertilizer?.description}</Typography.Text>
            ),
          },
          {
            title: t("Type", "Type"),
            icon: <EnvironmentOutlined />,
            value: <Typography.Text>{fertilizer?.type}</Typography.Text>,
          },
          {
            title: t("Nutrient Content", "Nutrient Content"),
            icon: <HomeOutlined />,
            value: (
              <Typography.Text>{fertilizer?.nutrient_content}</Typography.Text>
            ),
          },
          {
            title: t("Storage Conditions", "Storage Conditions"),
            icon: <InfoCircleOutlined />,
            value: (
              <Typography.Text>
                {fertilizer?.storage_conditions}
              </Typography.Text>
            ),
          },
          {
            title: t("Quantity", "Quantity"),
            icon: <NumberOutlined />,
            value: (
              <Typography.Text>
                {fertilizer?.quantity} {fertilizer?.unit}
              </Typography.Text>
            ),
          },
          {
            title: t("Expired Date", "Expired Date"),
            icon: <CalendarOutlined />,
            value: (
              <Typography.Text>
                {fertilizer?.expired_date
                  ? dayjs(fertilizer.expired_date).format("MMMM DD, YYYY")
                  : t("No Date", "No Date")}
              </Typography.Text>
            ),
          },
          {
            title: t("Status", "Status"),
            icon: <CheckCircleOutlined />,
            value: (
              <Typography.Text>
                {fertilizer?.status || t("Unknown", "Unknown")}
              </Typography.Text>
            ),
          },
          {
            title: t("Created By", "Created By"),
            icon: <UserOutlined />,
            value: <Typography.Text>{fertilizer?.created_by}</Typography.Text>,
          },
          {
            title: t("Created At", "Created At"),
            icon: <CalendarOutlined />,
            value: (
              <Typography.Text>
                {fertilizer?.created_at
                  ? dayjs(fertilizer.created_at).format("MMMM DD, YYYY")
                  : t("No Date", "No Date")}
              </Typography.Text>
            ),
          },
        ]}
        renderItem={(item) => {
          return (
            <List.Item>
              <List.Item.Meta
                avatar={item.icon}
                title={
                  <Typography.Text type="secondary">
                    {item.title}
                  </Typography.Text>
                }
                description={item.value}
              />
            </List.Item>
          );
        }}
      />
    </Card>
  );
};
