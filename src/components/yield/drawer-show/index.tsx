/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import {
  type BaseKey,
  useGetToPath,
  useGo,
  useShow,
  useList,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  List,
  Typography,
  theme,
} from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { EditOutlined } from "@ant-design/icons";
import { YieldTypeTag } from "../type";
import { YieldStatusTag } from "../status";
import { DeleteButton } from "@refinedev/antd";
import { YieldDrawerForm } from "../drawer-form";
import { useTranslation } from "react-i18next";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
};

export const YieldDrawerShow: React.FC<Props> = ({ id, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
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

  const { t } = useTranslation();

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
              <Flex
                style={{
                  padding: 10,
                  backgroundColor: token.colorBgContainer,
                }}
                justify="space-between"
              >
                <Typography.Title level={4}>
                  {yieldData.yield_name}
                </Typography.Title>
                <Flex align="center" justify="end">
                  <DeleteButton
                    type="text"
                    recordItemId={yieldData.id}
                    resource="yields"
                    onSuccess={handleDrawerClose}
                  />
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setIsEditing(true)}
                  >
                    {t("actions.edit")}
                  </Button>
                </Flex>
              </Flex>
              <Divider />

              <List
                style={{ margin: 10, backgroundColor: token.colorBgContainer }}
                bordered
                dataSource={[

                  {
                    label: t("yield.description"),
                    value: yieldData.description,
                  },
                  {
                    label: t("yield.area"),
                    value: `${yieldData.area} ${yieldData.area_unit}`,
                  },
                  {
                    label: t("yield.soilType"),
                    value: <YieldTypeTag value={yieldData.type} />,
                  },
                  {
                    label: t("yield.status"),

                    value: <YieldStatusTag value={yieldData.status} />,
                  },
                ]}
                renderItem={(itemData) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Typography.Text type="secondary">
                          {itemData.label}
                        </Typography.Text>
                      }
                      title={itemData.value}
                    />
                  </List.Item>
                )}
              />
              <Divider />

              <Typography.Title level={5} style={{ margin: 10 }}>
                {t("yield.suitablePlants")}
              </Typography.Title>

              {isPlantsLoading ? (
                <Typography.Text>{t("yield.loading")}</Typography.Text>
              ) : (
                <List
                  style={{
                    margin: 10,
                    backgroundColor: token.colorBgContainer,
                  }}
                  bordered
                  dataSource={suggestedPlants}
                  renderItem={(plant) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={plant.image_url}
                            size={200}
                            style={{ borderRadius: 8 }}
                          />
                        }
                        title={
                          <Typography.Text strong style={{ fontSize: "30px" }}>
                            {plant.plant_name}
                          </Typography.Text>
                        }
                        description={
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
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                              }}
                            >
                              <Typography.Text>
                                {t("plant.status")}: {plant.status}
                              </Typography.Text>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                              }}
                            >
                              <Typography.Text>
                                {t("plant.type")}: {plant.type}
                              </Typography.Text>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
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
