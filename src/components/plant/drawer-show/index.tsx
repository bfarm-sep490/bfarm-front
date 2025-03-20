import React, { useState } from "react";
import { type BaseKey, useGetToPath, useGo, useList, useShow, useTranslate } from "@refinedev/core";
import { Avatar, Button, Card, Divider, Flex, Grid, List, Tag, Typography, theme } from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { DeleteButton } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { PlantDrawerForm } from "../drawer-form";
import { IYield } from "@/interfaces";
import { PlantStatusTag } from "../status";

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

  const { data: yieldsData, isLoading: isYieldsLoading } = useList({
    resource: `plants/${id}/suggest-yields`,
    queryOptions: {
      enabled: !!id,
    },
  });

  const yields = (yieldsData?.data as IYield[]) ?? [];

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
          width={breakpoint.sm ? "40%" : "100%"}
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
                  <Typography.Text type="secondary">{plant.type}</Typography.Text>
                </Flex>
              </Flex>

              <Divider />

              <List
                dataSource={[
                  { label: "Description", value: plant.description },
                  { label: "Quantity", value: plant.quantity },
                  { label: "Base Price", value: `${plant.base_price.toLocaleString()} VND` },
                  { label: "Preservation Days", value: `${plant.preservation_day} days` },
                  { label: "Estimated Per One", value: `${plant.estimated_per_one} kg` },
                  { label: "Delta One", value: plant.delta_one },
                  { label: "Delta Two", value: plant.delta_two },
                  { label: "Delta Three", value: plant.delta_three },
                  {
                    label: "Status",
                    value: <PlantStatusTag value={plant.status} />,
                  },
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

              <Divider />

              <Card bordered style={{ padding: 16, margin: 16 }}>
                <Typography.Title level={4} style={{ paddingBottom: 8 }}>
                  List Suggest Yields
                </Typography.Title>
                {isYieldsLoading ? (
                  <Typography.Text>Loading...</Typography.Text>
                ) : (
                  <List
                    dataSource={yields}
                    renderItem={(yieldItem) => (
                      <List.Item>
                        <List.Item.Meta
                          title={<Typography.Text strong>{yieldItem.yield_name}</Typography.Text>}
                          description={
                            <>
                              <Typography.Text type="secondary">
                                {yieldItem.description}
                              </Typography.Text>
                              <br />
                              <Typography.Text>
                                Area: {yieldItem.area} {yieldItem.area_unit}
                              </Typography.Text>
                              <br />
                              <Typography.Text>Type: {yieldItem.type}</Typography.Text>
                              <br />
                              <Typography.Text>Status: {yieldItem.status}</Typography.Text>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>

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
