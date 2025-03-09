import React, { useState } from "react";
import { type BaseKey, useGetToPath, useGo, useShow, useTranslate } from "@refinedev/core";
import { Avatar, Button, Divider, Flex, Grid, List, Typography, theme } from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { DeleteButton } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { PlantDrawerForm } from "../drawer-form";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
};

export const PlantDrawerShow: React.FC<Props> = ({ id, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow({
    resource: "plants",
    id,
  });

  const plant = queryResult?.data?.data;

  const handleDrawerClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    go({
      to: searchParams.get("to") ?? getToPath({ action: "list" }) ?? "",
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  return (
    <>
      {!isEditing && (
        <Drawer
          open={!!id}
          width={breakpoint.sm ? "400px" : "100%"}
          zIndex={1001}
          onClose={handleDrawerClose}
        >
          {plant && (
            <>
              <Flex vertical align="center" justify="center">
                <Avatar
                  shape="square"
                  style={{
                    aspectRatio: 1,
                    objectFit: "contain",
                    width: "240px",
                    height: "240px",
                    margin: "16px auto",
                    borderRadius: "8px",
                  }}
                  src={plant.image_url}
                  alt={plant.plant_name}
                />
              </Flex>
              <Flex vertical style={{ backgroundColor: token.colorBgContainer }}>
                <Flex vertical style={{ padding: "16px" }}>
                  <Typography.Title level={5}>{plant.plant_name}</Typography.Title>
                </Flex>
              </Flex>

              <Divider />

              <List
                dataSource={[
                  { label: "Description", value: plant.description },
                  { label: "Quantity", value: `${plant.quantity} ${plant.unit}` },
                  {
                    label: "Temperature",
                    value: `${plant.min_temp} - ${plant.max_temp} °C`,
                  },
                  {
                    label: "Humidity",
                    value: `${plant.min_humid} - ${plant.max_humid} %`,
                  },
                  {
                    label: "Moisture",
                    value: `${plant.min_moisture} - ${plant.max_moisture} %`,
                  },
                  {
                    label: "Fertilizer",
                    value: `${plant.min_fertilizer} - ${plant.max_fertilizer} ${plant.fertilizer_unit}`,
                  },
                  {
                    label: "Pesticide",
                    value: `${plant.min_pesticide} - ${plant.max_pesticide} ${plant.pesticide_unit}`,
                  },
                  {
                    label: "Brix Point",
                    value: `${plant.min_brix_point} - ${plant.max_brix_point}`,
                  },
                  { label: "GT Test Kit Color", value: plant.gt_test_kit_color },
                ]}
                renderItem={(itemData) => (
                  <List.Item>
                    <List.Item.Meta
                      style={{ padding: "0 16px" }}
                      avatar={<Typography.Text type="secondary">{itemData.label}</Typography.Text>}
                      title={itemData.value}
                    />
                  </List.Item>
                )}
              />

              <Flex align="center" justify="space-between" style={{ padding: "16px 16px 16px 0" }}>
                <DeleteButton
                  type="text"
                  recordItemId={plant.id}
                  resource="plants"
                  onSuccess={handleDrawerClose}
                />
                <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                  {t("actions.edit")}
                </Button>
              </Flex>
            </>
          )}
        </Drawer>
      )}
      {isEditing && plant && (
        <PlantDrawerForm
          id={plant.id ?? ""}
          action="edit"
          onClose={() => setIsEditing(false)}
          onMutationSuccess={() => {
            setIsEditing(false);
            queryResult.refetch();
          }}
        />
      )}
    </>
  );
};
