import React, { useState } from "react";
import {
  type BaseKey,
  type HttpError,
  useGetToPath,
  useGo,
  useShow,
  useTranslate,
} from "@refinedev/core";
import { Avatar, Button, Divider, Flex, Grid, List, Typography, theme } from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { DeleteButton } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { SeedDrawerForm } from "../drawer-form";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
};

export const SeedDrawerShow: React.FC<Props> = ({ id, onClose }) => {
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

  const seed = queryResult?.data?.data;

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
          {seed && (
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
                  src={seed.image_url}
                  alt={seed.plant_name}
                />
              </Flex>
              <Flex vertical style={{ backgroundColor: token.colorBgContainer }}>
                <Flex vertical style={{ padding: "16px" }}>
                  <Typography.Title level={5}>{seed.plant_name}</Typography.Title>
                </Flex>
              </Flex>

              <Divider />

              <List
                dataSource={[
                  { label: "Description", value: seed.description },
                  { label: "Quantity", value: `${seed.quantity} ${seed.unit}` },
                  {
                    label: "Temperature",
                    value: `${seed.min_temp} - ${seed.max_temp} °C`,
                  },
                  {
                    label: "Humidity",
                    value: `${seed.min_humid} - ${seed.max_humid} %`,
                  },
                  {
                    label: "Moisture",
                    value: `${seed.min_moisture} - ${seed.max_moisture} %`,
                  },
                  {
                    label: "Fertilizer",
                    value: `${seed.min_fertilizer} - ${seed.max_fertilizer} ${seed.fertilizer_unit}`,
                  },
                  {
                    label: "Pesticide",
                    value: `${seed.min_pesticide} - ${seed.max_pesticide} ${seed.pesticide_unit}`,
                  },
                  {
                    label: "Brix Point",
                    value: `${seed.min_brix_point} - ${seed.max_brix_point}`,
                  },
                  { label: "GT Test Kit Color", value: seed.gt_test_kit_color },
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
                  recordItemId={seed.id}
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
      {isEditing && seed && (
        <SeedDrawerForm
          id={seed.id ?? ""}
          action="edit"
          open={isEditing}
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
