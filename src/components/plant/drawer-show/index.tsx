/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import {
  type BaseKey,
  useGetToPath,
  useGo,
  useList,
  useShow,
  useTranslate,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  List,
  Tag,
  Typography,
  theme,
} from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { DeleteButton } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { PlantDrawerForm } from "../drawer-form";
import { IYield } from "@/interfaces";
import { PlantStatusTag } from "../status";
import { YieldStatusTag } from "@/components/yield/status";

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
          width={breakpoint.sm ? "736px" : "100%"}
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

              <Flex
                vertical
                style={{ backgroundColor: token.colorBgContainer }}
              >
                <Flex vertical style={{ padding: "16px" }}>
                  <Typography.Title level={5}>
                    {plant.plant_name}
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    {plant.type}
                  </Typography.Text>
                </Flex>
              </Flex>

              <Divider />
              <Flex style={{ margin: 10 }} justify="space-between">
                <Typography.Title level={5}>
                  {t("plant.title")}
                </Typography.Title>
              </Flex>
              <List
                style={{ margin: 10, backgroundColor: token.colorBgContainer }}
                bordered
                dataSource={[
                  {
                    label: t("plant.quantity"),
                    value: plant.quantity,
                  },
                  {
                    label: t("plant.basePrice"),
                    value: `${plant.base_price.toLocaleString()} VND`,
                  },
                  {
                    label: t("plant.preservationDay"),
                    value: `${plant.preservation_day} ${t("plant.day")}`,
                  },
                  {
                    label: t("plant.estimatedPerUnit"),
                    value: `${plant.estimated_per_one} kg`,
                  },
                  {
                    label: t("plant.status"),
                    value: <PlantStatusTag value={plant.status} />,
                  },
                  {
                    label: t("plant.description"),
                    value: plant.description,
                  },
                ]}
                renderItem={(itemData) => (
                  <List.Item>
                    <Typography.Text strong>{itemData.label}:</Typography.Text>{" "}
                    {itemData.value}
                  </List.Item>
                )}
              />

              <Divider />
              <Flex style={{ margin: 10 }} justify="space-between">
                <Typography.Title level={5}>
                  {t("plant.plantRatioTitle")}
                </Typography.Title>
              </Flex>
              <List
                style={{ margin: 10, backgroundColor: token.colorBgContainer }}
                bordered
                dataSource={[
                  {
                    label: t("plant.deltaOne"),
                    value: plant.delta_one * 100 + " %",
                  },
                  {
                    label: t("plant.deltaTwo"),
                    value: plant.delta_two * 100 + " %",
                  },
                  {
                    label: t("plant.deltaThree"),
                    value: plant.delta_three * 100 + " %",
                  },
                ]}
                renderItem={(itemData) => (
                  <List.Item>
                    <Typography.Text strong>{itemData.label}:</Typography.Text>{" "}
                    {itemData.value}
                  </List.Item>
                )}
              />

              <Divider />
              <Typography.Title level={4} style={{ margin: 10 }}>
                {t("plant.suitableSoilList")}
              </Typography.Title>
              {isYieldsLoading ? (
                <Typography.Text>{t("plant.loading")}</Typography.Text>
              ) : (
                <List
                  style={{
                    margin: 10,
                    backgroundColor: token.colorBgContainer,
                  }}
                  bordered
                  dataSource={yields}
                  renderItem={(yieldItem) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <Typography.Text strong>
                            {yieldItem.yield_name}
                          </Typography.Text>
                        }
                        description={
                          <>
                            <Typography.Text>
                              {t("plant.area")}: {yieldItem.area}{" "}
                              {yieldItem.area_unit}
                            </Typography.Text>
                            <br />
                            <Typography.Text>
                              {t("plant.soilType")}: {yieldItem.type}
                            </Typography.Text>
                            <br />
                            <Typography.Text>
                              {t("plant.yieldStatus")}:{" "}
                              <YieldStatusTag value={yieldItem?.status} />
                            </Typography.Text>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}

              <Flex
                align="center"
                justify="space-between"
                style={{ padding: "16px 16px 16px 0" }}
              >
                <DeleteButton
                  type="text"
                  recordItemId={plant.id}
                  resource="plants"
                  onSuccess={handleDrawerClose}
                >
                  {t("actions.delete")}
                </DeleteButton>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                >
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
