/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import {
  type BaseKey,
  useGetToPath,
  useGo,
  useShow,
  useList,
  useBack,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  List,
  Space,
  Timeline,
  Typography,
  theme,
} from "antd";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  FieldTimeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { YieldTypeTag } from "../type";
import { YieldStatusTag } from "../status";
import { DateField, DeleteButton, TextField } from "@refinedev/antd";
import { YieldDrawerForm } from "../drawer-form";
import { useTranslation } from "react-i18next";
import { StatusTag } from "@/components/caring-task/status-tag";
import dayjs from "dayjs";
import "../../plan/detail/dashboard-problems/index.css";
type Props = {
  onClose?: () => void;
};

export const YieldDrawerShow: React.FC<Props> = ({ onClose }) => {
  const { id } = useParams();
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
  const { data: historyData, isLoading: historyLoading } = useList({
    resource: `yields/${id}/history-plans`,
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
  const navigate = useNavigate();
  const { t } = useTranslation();
  const sortedData = React.useMemo(() => {
    if (!historyData?.data || historyData.data.length === 0) {
      return [];
    }

    return [...historyData.data].sort((a, b) => {
      return dayjs(b.start_date).valueOf() - dayjs(a.start_date).valueOf();
    });
  }, [historyData?.data]);

  const back = useBack();

  return (
    <>
      {!isEditing && (
        <>
          <Button
            type="text"
            style={{ width: "40px", height: "40px" }}
            onClick={() => back()}
          >
            <ArrowLeftOutlined style={{ width: "50px", height: "50px" }} />
          </Button>
          {yieldData && (
            <>
              <Flex vertical={false} gap={10}>
                <Card
                  className="card"
                  title="Thông tin khu đất"
                  style={{ width: "50%", height: "400px" }}
                  loading={queryResult.isLoading}
                >
                  <Flex
                    style={{
                      padding: 4,
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
                  <List
                    style={{
                      margin: 10,
                      backgroundColor: token.colorBgLayout,
                    }}
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
                        value: yieldData?.type,
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
                </Card>
                <Card
                  className="card"
                  loading={isPlantsLoading}
                  title="Danh sách cây trồng gợi ý"
                  style={{
                    width: "50%",
                    maxWidth: "100%",
                    borderRadius: "8px",
                    overflow: "hidden",
                    height: "400px",
                  }}
                  bodyStyle={{
                    padding: 0,
                    height: "calc(100% - 58px)",
                    overflow: "auto",
                  }}
                >
                  <List
                    style={{
                      backgroundColor: token.colorBgContainer,
                    }}
                    dataSource={suggestedPlants}
                    renderItem={(plant) => (
                      <List.Item
                        onClick={() => {
                          navigate(`/plants/${plant.id}`);
                        }}
                        className="hover-attribute"
                        style={{
                          borderRadius: 8,
                          padding: "16px 24px",
                          borderBottom: `1px solid ${token.colorBorderSecondary}`,
                        }}
                      >
                        <List.Item.Meta
                          style={{ padding: 8, borderRadius: 8 }}
                          avatar={
                            <Avatar
                              className="card"
                              src={plant.image_url}
                              size={80}
                              shape="square"
                              style={{
                                borderRadius: 8,
                                border: "1px solid #f0f0f0",
                              }}
                            />
                          }
                          title={
                            <Typography.Text
                              strong
                              style={{ fontSize: "18px" }}
                            >
                              {plant.plant_name}
                            </Typography.Text>
                          }
                          description={
                            <Space
                              direction="vertical"
                              size="small"
                              style={{ marginTop: 8 }}
                            >
                              <Space>
                                <InfoCircleOutlined
                                  style={{ color: token.colorPrimary }}
                                />
                                <Typography.Text>
                                  Loại cây: {plant.type}
                                </Typography.Text>
                              </Space>
                              <Space>
                                <FieldTimeOutlined
                                  style={{ color: token.colorPrimary }}
                                />
                                <Typography.Text>
                                  Thời gian bảo quản: {plant.preservation_day}{" "}
                                  ngày
                                </Typography.Text>
                              </Space>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Flex>
              <Divider />
              <Card
                className="card"
                loading={historyLoading}
                title="Lịch sử dụng đất"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  overflow: "hidden",
                  height: "400px",
                }}
                bodyStyle={{
                  padding: "16px",
                  height: "calc(100% - 58px)",
                  overflow: "auto",
                }}
              >
                {sortedData && sortedData.length > 0 ? (
                  <Timeline
                    items={sortedData.map((plan, index) => ({
                      dot:
                        plan.status === "Complete" ? (
                          <CheckCircleOutlined
                            style={{
                              fontSize: "16px",
                              color: token.colorSuccess,
                            }}
                          />
                        ) : (
                          <ClockCircleOutlined
                            style={{
                              fontSize: "16px",
                              color: token.colorPrimary,
                            }}
                          />
                        ),
                      color: plan.status === "Complete" ? "green" : "blue",
                      children: (
                        <Card
                          className="hover-attribute"
                          onClick={() => navigate(`/plans/${plan.id}`)}
                          size="small"
                          style={{
                            marginBottom: "16px",
                            borderLeft: `3px solid ${plan.status === "Complete" ? token.colorSuccess : "#3399FF"}`,
                          }}
                        >
                          <Flex align="center" justify="space-between">
                            <Typography.Title level={5} style={{ margin: 0 }}>
                              {plan.plant_name}
                            </Typography.Title>
                            <StatusTag status={plan.status} />
                          </Flex>

                          <Space
                            direction="vertical"
                            style={{ marginTop: "12px", width: "100%" }}
                          >
                            <Flex align="center" gap="small">
                              <CalendarOutlined
                                style={{ color: token.colorPrimary }}
                              />
                              <Typography.Text type="secondary">
                                Thời gian:{" "}
                              </Typography.Text>
                              <Typography.Text strong>
                                <DateField
                                  value={plan.start_date}
                                  format="hh:mm DD/MM/YYYY"
                                />{" "}
                                —{" "}
                                <DateField
                                  value={plan.end_date}
                                  format="hh:mm DD/MM/YYYY"
                                />
                              </Typography.Text>
                            </Flex>

                            {plan.complete_date && (
                              <Flex align="center" gap="small">
                                <CheckCircleOutlined
                                  style={{ color: token.colorSuccess }}
                                />
                                <Typography.Text type="secondary">
                                  Ngày hoàn thành:{" "}
                                </Typography.Text>
                                <Typography.Text
                                  strong
                                  style={{ color: token.colorSuccess }}
                                >
                                  {plan?.complete_date ? (
                                    <DateField
                                      value={plan.complete_date}
                                      format="hh:mm DD/MM/YYYY"
                                    />
                                  ) : (
                                    <TextField value="Chưa hoàn thành" />
                                  )}
                                </Typography.Text>
                              </Flex>
                            )}
                          </Space>
                        </Card>
                      ),
                    }))}
                  />
                ) : (
                  <Flex
                    justify="center"
                    align="center"
                    style={{ height: "100%" }}
                  >
                    <Typography.Text type="secondary">
                      Chưa có lịch sử sử dụng đất
                    </Typography.Text>
                  </Flex>
                )}
              </Card>
            </>
          )}
        </>
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
