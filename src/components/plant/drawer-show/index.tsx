/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import {
  type BaseKey,
  useBack,
  useDelete,
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
  Space,
  Tag,
  Tooltip,
  Typography,
  notification,
  theme,
} from "antd";
import { useParams, useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { DeleteButton } from "@refinedev/antd";
import Icon, {
  AreaChartOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  ExperimentOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { PlantDrawerForm } from "../drawer-form";
import { IYield } from "@/interfaces";
import { PlantStatusTag } from "../status";
import { YieldStatusTag } from "@/components/yield/status";
import { AddSuitableModal } from "../add-modal";

type Props = {
  onClose?: () => void;
};

export const PlantDrawerShow: React.FC<Props> = ({ onClose }) => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();
  const [api, contextHolder] = notification.useNotification();
  const { queryResult } = useShow({
    resource: "plants",
    id,
  });

  const plant = queryResult?.data?.data;

  const {
    data: yieldsData,
    isLoading: isYieldsLoading,
    refetch: yieldRefetch,
  } = useList({
    resource: `plants/${id}/suggest-yields`,
  });

  const yields = yieldsData?.data ?? [];

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
  const getAvatarColor = (name: any) => {
    const colors = [
      "#f56a00",
      "#7265e6",
      "#ffbf00",
      "#00a2ae",
      "#87d068",
      "#108ee9",
      "#722ed1",
      "#eb2f96",
    ];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  };
  const getInitials = (name: any) => {
    return name.charAt(0).toUpperCase();
  };
  const back = useBack();
  const { mutate } = useDelete({});
  const handleDelete = (value: number) => {
    mutate(
      {
        resource: `plants/${id}`,
        values: {
          plant_id: plant?.id,
          yield_id: value,
        },
        id: "suggest-yields?yield_id=" + value,
      },
      {
        onSuccess: () => {
          api.success({
            message: "Xóa đất trồng phù hợp thành công",
          });
          yieldRefetch();
        },
        onError: () => {
          api.error({
            message: "Lỗi. Vui lòng thử lại sau",
          });
        },
      }
    );
  };
  return (
    <>
      <Button
        type="text"
        style={{ width: "40px", height: "40px" }}
        onClick={() => back()}
      >
        <ArrowLeftOutlined style={{ width: "50px", height: "50px" }} />
      </Button>
      {!isEditing && (
        <>
          {plant && (
            <>
              {contextHolder}{" "}
              <Flex gap={10}>
                <Card title={"Thông tin cây trồng"} style={{ width: "50%" }}>
                  <Flex align="center" justify="center">
                    <Avatar
                      shape="square"
                      style={{
                        aspectRatio: 1,
                        objectFit: "contain",
                        width: "240px",
                        height: "240px",
                        borderRadius: "8px",
                        border: `1px solid ${token.colorBorderSecondary}`,
                      }}
                      src={plant.image_url}
                      alt={plant.plant_name}
                    />
                  </Flex>
                  <Divider />
                  <Flex style={{ margin: 10 }} justify="space-between">
                    <Typography.Title level={5}>
                      {t("plant.title")}
                    </Typography.Title>
                    <Flex align="center" justify="start" gap={10}>
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
                  </Flex>
                  <List
                    style={{
                      backgroundColor: token.colorBgLayout,
                    }}
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
                        <Typography.Text strong>
                          {itemData.label}:
                        </Typography.Text>{" "}
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
                    style={{
                      margin: 10,
                      backgroundColor: token.colorBgLayout,
                    }}
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
                        <Typography.Text strong>
                          {itemData.label}:
                        </Typography.Text>{" "}
                        {itemData.value}
                      </List.Item>
                    )}
                  />
                </Card>
                <Card
                  title={
                    <Flex justify="space-between" align="center">
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        Thông tin đất trồng phù hợp
                      </Typography.Title>
                      <Button
                        onClick={() => setIsAddModalVisible(true)}
                        type="primary"
                      >
                        Thêm
                      </Button>
                    </Flex>
                  }
                  loading={isYieldsLoading}
                  style={{
                    width: "50%",
                    maxWidth: "100%",
                    borderRadius: "8px",
                    overflow: "hidden",
                    height: "400px",
                  }}
                  bodyStyle={{
                    padding: 0,
                    maxHeight: "350px",
                    overflow: "auto",
                  }}
                >
                  <List
                    style={{
                      backgroundColor: token.colorBgContainer,
                    }}
                    dataSource={yields}
                    renderItem={(yieldItem) => (
                      <List.Item
                        key={yieldItem.id}
                        style={{
                          padding: "16px 24px",
                          transition: "all 0.3s ease",
                          borderBottom: `1px solid ${token.colorBorderSecondary}`,
                        }}
                      >
                        <Space align="start" style={{ width: "100%" }}>
                          <Avatar
                            size={48}
                            style={{
                              backgroundColor: getAvatarColor(
                                yieldItem.yield_name
                              ),
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "18px",
                              fontWeight: "bold",
                            }}
                          >
                            {getInitials(yieldItem.yield_name)}
                          </Avatar>

                          <div style={{ flex: 1, width: "100%" }}>
                            <Flex
                              style={{ width: "100%" }}
                              justify="space-between"
                              align="center"
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: "8px",
                                }}
                              >
                                <Typography.Title
                                  level={5}
                                  style={{ margin: 0, marginRight: 8 }}
                                >
                                  {yieldItem.yield_name}
                                </Typography.Title>
                                <YieldStatusTag value={yieldItem?.status} />
                              </div>
                              <Tooltip title="Xóa đất trồng này">
                                <DeleteOutlined
                                  style={{
                                    color: token.colorError,
                                    fontSize: 18,
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleDelete(yieldItem?.id as number)
                                  }
                                />
                              </Tooltip>
                            </Flex>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                              }}
                            >
                              <Space>
                                <AreaChartOutlined
                                  style={{ color: token.colorPrimary }}
                                />
                                <Typography.Text
                                  style={{ color: token.colorTextSecondary }}
                                >
                                  {"Diện tích"}:
                                </Typography.Text>
                                <Typography.Text strong>
                                  {yieldItem.area} {yieldItem.area_unit}
                                </Typography.Text>
                              </Space>

                              <Space>
                                <ExperimentOutlined
                                  style={{ color: token.colorPrimary }}
                                />
                                <Typography.Text
                                  style={{ color: token.colorTextSecondary }}
                                >
                                  {"Loại đất"}:
                                </Typography.Text>
                                <Typography.Text strong>
                                  {yieldItem.type}
                                </Typography.Text>
                              </Space>
                              <Space>
                                <LineChartOutlined
                                  style={{ color: token.colorSuccess }}
                                />
                                <Typography.Text
                                  style={{ color: token.colorTextSecondary }}
                                >
                                  {"Thu hoạch ước tính"}:
                                </Typography.Text>
                                <Tooltip
                                  title={`Tổng thu hoạch ước tính: ${(yieldItem.area * yieldItem.maximum_quantity).toFixed(1)} kg`}
                                >
                                  <Typography.Text
                                    strong
                                    style={{ color: token.colorSuccess }}
                                  >
                                    {yieldItem?.maximum_quantity} kg/m²
                                  </Typography.Text>
                                </Tooltip>
                              </Space>
                              {yieldItem.description && (
                                <Typography.Paragraph
                                  ellipsis={{
                                    rows: 2,
                                    expandable: true,
                                    symbol: "Xem thêm",
                                  }}
                                  style={{ marginTop: "8px", marginBottom: 0 }}
                                >
                                  <Typography.Text
                                    style={{ color: token.colorTextSecondary }}
                                  >
                                    {"Mô tả"}:
                                  </Typography.Text>{" "}
                                  {yieldItem.description}
                                </Typography.Paragraph>
                              )}
                            </div>
                          </div>
                        </Space>
                      </List.Item>
                    )}
                    locale={{
                      emptyText: (
                        <Typography.Text>Không có dữ liệu</Typography.Text>
                      ),
                    }}
                  />
                </Card>
              </Flex>
            </>
          )}
        </>
      )}
      <AddSuitableModal
        api={api}
        id={plant?.id as number}
        onClose={() => setIsAddModalVisible(false)}
        visible={isAddModalVisible}
        suggest_yields={yields as []}
        refresh={yieldRefetch}
      />
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
