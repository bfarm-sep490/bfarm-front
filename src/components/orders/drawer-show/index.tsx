import { DateField, TextField } from "@refinedev/antd";
import { useBack, useList, useUpdate, useOne } from "@refinedev/core";
import {
  Drawer,
  Flex,
  Typography,
  Divider,
  Table,
  Space,
  Button,
  Tag,
  notification,
  theme,
  Card,
  Image,
  Row,
  Col,
  Badge,
  Progress,
  Grid,
} from "antd";
import { useState, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { CompleteOrderModal } from "../complete-modal";
import { OrderStatusTag } from "../order-status";
import {
  FileDoneOutlined,
  ShopOutlined,
  PhoneOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { StatusTag } from "@/components/caring-task/status-tag";
import { CreateBatchModal } from "../create-batches";
import "../index.css";
export const OrderDrawerShow = () => {
  const [open, setOpen] = useState(false);
  const [createBatchOpen, setCreateBatchOpen] = useState(false);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const {
    data: queryResult,
    isLoading: orderLoading,
    refetch: orderRefetch,
    isFetching: orderFetching,
  } = useOne<any>({
    resource: "orders",
    id: orderId,
  });
  const order = queryResult?.data;
  const { data: plantData, isLoading: plantLoading } = useOne({
    resource: "plants",
    id: order?.plant_id,
  });
  const plant = plantData?.data;
  const {
    data: packagingProductsData,
    isLoading: packagingProductsLoading,
    refetch: packagingProductRefetch,
    isFetching: packagingProductFetching,
  } = useList({
    resource: "packaging-products",
    filters: [
      {
        field: "order_id",
        operator: "eq",
        value: order?.id,
      },
    ],
  });
  const {
    data: plansData,
    isLoading: plansLoading,
    refetch: planRefetch,
    isFetching: planFetching,
  } = useList({
    resource: "plans",
    filters: [
      {
        field: "order_id",
        operator: "eq",
        value: order?.id,
      },
    ],
  });
  const { data: packagingTypeData, isLoading: packagingTypeLoading } = useList({
    resource: "packaging-types",
  });
  const {
    data: batchesData,
    isLoading: batchesLoading,
    refetch: batchRefetch,
    isFetching: batchFetching,
  } = useList({
    resource: "product-pickup-batches",
    filters: [
      {
        field: "order_id",
        operator: "eq",
        value: order?.id,
      },
    ],
  });
  const packagingTypes = packagingTypeData?.data || [];
  const back = useBack();
  const [api, contextHolder] = notification.useNotification();
  const { token } = theme.useToken();

  const { mutate } = useUpdate();

  const processedPackageProducts = useMemo(
    () => packagingProductsData?.data || [],
    [packagingProductsData],
  );

  const handleUpdate = (value: string) => {
    mutate({
      resource: `orders`,
      id: `${orderId}/status?status=${value}`,
      values: {},
    });
    orderRefetch();
    navigate(-1);
    api.success({
      message: "Cập nhật thành công",
      description: `Đơn hàng #${orderId} đã được cập nhật thành công`,
    });
  };
  return (
    <>
      {contextHolder}
      <Button type="text" style={{ width: "40px", height: "40px" }} onClick={() => back()}>
        <ArrowLeftOutlined style={{ width: "50px", height: "50px" }} />
      </Button>
      <Flex
        justify="space-between"
        align="center"
        style={{
          marginBottom: 24,
          padding: "16px 0",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          Thông tin đơn hàng #{orderId}
        </Typography.Title>
        {order?.status === "PendingConfirmation" && (
          <Flex justify="end">
            <Space>
              <Button danger onClick={() => handleUpdate("Reject")}>
                Từ chối
              </Button>
              <Button type="primary" onClick={() => handleUpdate("Pending")}>
                Chấp nhận
              </Button>
            </Space>
          </Flex>
        )}

        {order?.status === "Deposit" && (
          <Flex justify="end" gap={10}>
            {order?.plan_id !== null ? (
              <Button type="primary" onClick={() => setOpen(true)}>
                Hoàn thành
              </Button>
            ) : (
              <Badge.Ribbon text="Lưu ý" color="red">
                <div
                  style={{
                    padding: "8px 16px",
                    background: token.colorErrorBg,
                    borderRadius: 8,
                    minWidth: 280,
                  }}
                >
                  <Typography.Text type="danger" italic>
                    Đơn hàng này không thể hoàn thành khi chưa có kế hoạch
                  </Typography.Text>
                </div>
              </Badge.Ribbon>
            )}
          </Flex>
        )}
      </Flex>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card
            className="card card-border"
            loading={orderLoading || orderFetching}
            title={
              <Flex justify="space-between" align="center">
                <Flex gap={8} align="center">
                  <Typography.Title level={5} style={{ margin: 0 }}>
                    Nội dung đơn hàng
                  </Typography.Title>
                </Flex>
                <OrderStatusTag status={order?.status} />
              </Flex>
            }
          >
            <Flex justify="center" align="center" gap={12}>
              <Image
                width={240}
                height={240}
                className="card"
                style={{
                  border: `1px solid ${token.colorBorderSecondary}`,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
                src={plant?.image_url}
                alt="Plant Image"
                preview={{
                  mask: <div style={{ fontSize: 16 }}>Xem ảnh</div>,
                }}
              />
            </Flex>
            <Flex vertical justify="center" gap={12} align="center">
              <Typography.Title level={3}>{plant?.plant_name}</Typography.Title>

              <Card
                size="small"
                bordered={false}
                style={{
                  width: "80%",
                  background: token.colorBgLayout,
                }}
              >
                <Flex vertical gap={12}>
                  <Flex align="baseline" gap={8}>
                    <Typography.Text strong style={{ minWidth: 120 }}>
                      Ngày đặt hàng:
                    </Typography.Text>
                    <DateField value={order?.created_at} format="hh:mm DD/MM/YYYY" />
                  </Flex>

                  <Flex align="baseline" gap={8}>
                    <Typography.Text strong style={{ minWidth: 120 }}>
                      Dự kiến lấy hàng:
                    </Typography.Text>
                    <DateField value={order?.estimate_pick_up_date} format="hh:mm DD/MM/YYYY" />
                  </Flex>

                  <Flex align="baseline" gap={8}>
                    <Typography.Text strong style={{ minWidth: 120 }}>
                      Sản lượng đặt:
                    </Typography.Text>
                    <Typography.Text>{order?.preorder_quantity} kg</Typography.Text>
                  </Flex>
                  <Flex align="baseline" gap={8}>
                    <Typography.Text strong style={{ minWidth: 120 }}>
                      Loại đóng gói:
                    </Typography.Text>
                    <Typography.Text>
                      {packagingTypes?.find((type) => type.id === order?.packaging_type_id)?.name ||
                        "N/A"}
                    </Typography.Text>
                  </Flex>

                  <Flex align="baseline" gap={8}>
                    <Typography.Text strong style={{ minWidth: 120 }}>
                      Mức cọc:
                    </Typography.Text>
                    <Typography.Text>
                      {new Intl.NumberFormat("vi-VN").format(order?.deposit_price || 0)} VND
                    </Typography.Text>
                  </Flex>
                  <Flex align="baseline" gap={8}>
                    <Typography.Text strong style={{ minWidth: 120 }}>
                      Tổng tiền:
                    </Typography.Text>
                    <Typography.Text>
                      {order?.total_price
                        ? new Intl.NumberFormat("vi-VN").format(order?.total_price || 0) + " VND"
                        : "Chưa hoàn thành"}{" "}
                    </Typography.Text>
                  </Flex>
                </Flex>
              </Card>

              <Card
                loading={orderLoading || orderFetching}
                title="Thông tin người đặt"
                size="small"
                style={{
                  width: "80%",
                  background: token.colorBgLayout,
                }}
              >
                <Flex vertical gap={12}>
                  <Flex align="center" gap={12}>
                    <ShopOutlined style={{ color: token.colorPrimary }} />
                    <Typography.Text strong>Nhà mua sỉ:</Typography.Text>
                    <Typography.Text>{order?.retailer_name}</Typography.Text>
                  </Flex>

                  <Flex align="center" gap={12}>
                    <HomeOutlined style={{ color: token.colorPrimary }} />
                    <Typography.Text strong>Địa chỉ:</Typography.Text>
                    <Typography.Text>{order?.address}</Typography.Text>
                  </Flex>

                  <Flex align="center" gap={12}>
                    <PhoneOutlined style={{ color: token.colorPrimary }} />
                    <Typography.Text strong>Số điện thoại:</Typography.Text>
                    <Typography.Text>{order?.phone}</Typography.Text>
                  </Flex>
                </Flex>
              </Card>
            </Flex>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          {" "}
          <Card
            className="card"
            loading={plansLoading || planFetching}
            title={
              <Flex align="center" gap={8}>
                <FileDoneOutlined style={{ color: token.colorPrimary }} />
                <span>Thông tin kế hoạch</span>
              </Flex>
            }
            style={{
              marginBottom: 24,
              height: "fit-content",
            }}
          >
            {plansData?.data?.map((x: any, index: number) => {
              const start = new Date(x?.start_date);
              const end = new Date(x?.end_date);
              const now = new Date();

              const total = end.getTime() - start.getTime();
              const passed = now.getTime() - start.getTime();
              const percent = Math.min(100, Math.max(0, (passed / total) * 100));

              return (
                <Flex
                  className="card hover-attribute"
                  key={index}
                  vertical
                  gap={12}
                  style={{
                    cursor: "pointer",
                    padding: 16,
                    borderRadius: 8,
                    background: token?.colorBgLayout,
                    marginBottom: 16,
                  }}
                >
                  <Typography.Title
                    level={5}
                    style={{
                      margin: 0,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    #{x?.id} {x?.plan_name} <StatusTag status={x?.status} />
                  </Typography.Title>

                  <Flex gap={4} align="center">
                    <Typography.Text strong>Thời gian:</Typography.Text>
                    <DateField value={x?.start_date} format="HH:mm DD/MM/YYYY" />
                    <Typography.Text>→</Typography.Text>
                    <DateField value={x?.end_date} format="HH:mm DD/MM/YYYY" />
                  </Flex>
                  <Flex gap={24}>
                    <Flex gap={4} align="center">
                      <Typography.Text strong>Khu đất:</Typography.Text>
                      <TextField value={x?.yield_name} />
                    </Flex>

                    <Flex gap={4} align="center">
                      <Typography.Text strong>Chuyên gia:</Typography.Text>
                      <TextField value={x?.expert_name} />
                    </Flex>
                  </Flex>
                  <Progress
                    percent={parseFloat(percent.toFixed(2))}
                    status={
                      x?.status === "Complete"
                        ? "success"
                        : x?.status === "Cancel"
                          ? "exception"
                          : "active"
                    }
                  />
                </Flex>
              );
            })}
            {plansData?.data?.length === 0 && (
              <Flex
                vertical
                gap={12}
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: token?.colorBgLayout,
                }}
              >
                <Typography.Text type="secondary">
                  Chưa có kế hoạch nào cho đơn hàng này
                </Typography.Text>
              </Flex>
            )}
          </Card>
          <Card
            loading={packagingProductsLoading || packagingProductFetching}
            title="Thông tin sản phẩm"
            className="card"
            style={{ borderRadius: 8 }}
          >
            <Table
              dataSource={processedPackageProducts || []}
              pagination={{
                pageSize: 5,
              }}
              size="middle"
              style={{ marginTop: -16 }}
            >
              <Table.Column
                title="ID"
                dataIndex="id"
                width={50}
                render={(value: any) => <TextField value={`#${value}`} />}
              />

              <Table.Column
                title="Kiểm định"
                dataIndex="evaluated_result"
                render={(value: string) => {
                  const gradeMap = {
                    "Grade 3": { color: "red", label: "Loại 3" },
                    "Grade 2": { color: "orange", label: "Loại 2" },
                    "Grade 1": { color: "green", label: "Loại 1" },
                  };
                  const gradeInfo = gradeMap[value as keyof typeof gradeMap] || {};
                  return gradeInfo.color ? (
                    <Tag color={gradeInfo.color}>{gradeInfo.label}</Tag>
                  ) : null;
                }}
              />

              <Table.Column title="Đã nhận" dataIndex="received_pack_quantity" align="center" />

              <Table.Column title="Tổng thành phẩm" dataIndex="total_packs" align="center" />
              <Table.Column
                title="Bao bì"
                dataIndex="packaging_type_id"
                render={(value) => {
                  const packageProduct = packagingTypes?.find((pkg) => pkg.id === value);
                  return <TextField value={packageProduct?.name || "Không xác định"} />;
                }}
              />
            </Table>
          </Card>
        </Col>
      </Row>
      <Divider style={{ margin: "24px 0" }} />
      <Card
        className="card"
        title={"Thông tin giao hàng"}
        loading={batchesLoading || batchFetching}
      >
        <Flex justify="end" align="center" style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => setCreateBatchOpen(true)}>
            Bàn giao
          </Button>
        </Flex>
        <Table
          dataSource={batchesData?.data || []}
          pagination={{
            pageSize: 5,
          }}
        >
          <Table.Column
            title={"#ID"}
            dataIndex="id"
            render={(value: any) => <TextField value={`#${value}`} />}
          />
          <Table.Column
            title={"Ngày lấy"}
            dataIndex="created_date"
            render={(value: any) => <DateField value={value} format="hh:mm DD/MM/YYYY" />}
          />
          <Table.Column
            title={"ID thành phẩm"}
            dataIndex="product_id"
            render={(value: any) => <TextField value={`#${value}`} />}
          />
          <Table.Column title={"Số lượng bàn giao"} dataIndex="quantity" />
        </Table>
      </Card>
      <CompleteOrderModal
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        open={open}
      />
      <CreateBatchModal
        product_types={packagingTypes as []}
        visible={createBatchOpen}
        onClose={() => setCreateBatchOpen(false)}
        order={order}
        packaging_products={(packagingProductsData?.data as []) || []}
        retch={() => {
          batchRefetch();
          packagingProductRefetch();
          planRefetch();
          orderRefetch();
        }}
      />
    </>
  );
};
