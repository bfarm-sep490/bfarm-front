import React, { useState } from "react";
import { type BaseKey, useGetToPath, useGo, useShow, useList, useTranslate } from "@refinedev/core";
import { Avatar, Button, Card, Divider, Flex, Grid, List, Typography, theme } from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { EditOutlined } from "@ant-design/icons";
import { IYield } from "@/interfaces";
import { YieldTypeTag } from "../type";
import { YieldStatusTag } from "../status";
import { DeleteButton } from "@refinedev/antd";
import { YieldDrawerForm } from "../drawer-form";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
};

export const YieldDrawerShow: React.FC<Props> = ({ id, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow({
    resource: "yields",
    id,
  });

  const yieldData = queryResult?.data?.data;

  const { data: suggestPlantsData, isLoading: isPlantsLoading } = useList({
    resource: `yields/${id}/suggest-plants`,
    queryOptions: {
      enabled: !!id,
    },
  });

  const suggestedPlants = suggestPlantsData?.data ?? [];

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
          {yieldData && (
            <>
              <Typography.Title level={4}>{yieldData.yield_name}</Typography.Title>
              <Divider />

              <List
                dataSource={[
                  { label: "Description ", value: yieldData.description },
                  { label: "Area ", value: `${yieldData.area} ${yieldData.area_unit}` },
                  { label: "Type ", value: <YieldTypeTag value={yieldData.type} /> },
                  { label: "Status ", value: <YieldStatusTag value={yieldData.status} /> },
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
              <Flex align="center" justify="space-between" style={{ padding: "16px 16px 16px 0" }}>
                <DeleteButton
                  type="text"
                  recordItemId={yieldData.id}
                  resource="yields"
                  onSuccess={handleDrawerClose}
                />
                <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                  {t("actions.edit")}
                </Button>
              </Flex>
              <Card bordered style={{ padding: 16, margin: 16 }}>
                <Typography.Title level={5}>Suggested Plants</Typography.Title>
                {isPlantsLoading ? (
                  <Typography.Text>Loading...</Typography.Text>
                ) : (
                  <List
                    dataSource={suggestedPlants}
                    renderItem={(plant) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar src={plant.image_url} size={200} style={{ borderRadius: 8 }} />
                          }
                          title={
                            <Typography.Text strong style={{ fontSize: "30px" }}>
                              {plant.plant_name}
                            </Typography.Text>
                          }
                          description={
                            <>
                              <Typography.Text> Description: {plant.description}</Typography.Text>
                              <br />
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr 1fr",
                                  gap: "12px",
                                  marginTop: 4,
                                  alignItems: "start",
                                }}
                              >
                                <div
                                  style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                                >
                                  <Typography.Text>
                                    Preservation (days): {plant.preservation_day}
                                  </Typography.Text>
                                  <Typography.Text>Status: {plant.status}</Typography.Text>
                                  <Typography.Text>Price: {plant.base_price} VND</Typography.Text>
                                </div>
                                <div
                                  style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                                >
                                  <Typography.Text>
                                    Estimated per unit: {plant.estimated_per_one}
                                  </Typography.Text>
                                  <Typography.Text>Type: {plant.type}</Typography.Text>
                                  <Typography.Text>Quantity: {plant.quantity}</Typography.Text>
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: "50px" }}>
                                <Typography.Text>Delta One: {plant.delta_one}</Typography.Text>
                                <Typography.Text>Delta Two: {plant.delta_two}</Typography.Text>
                                <Typography.Text>Delta Three: {plant.delta_three}</Typography.Text>
                              </div>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </>
          )}
        </Drawer>
      )}
      {isEditing && yieldData && (
        <YieldDrawerForm
          id={yieldData.id}
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
