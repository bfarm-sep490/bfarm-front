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
} from "antd";
import { useState, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { CompleteOrderModal } from "../complete-modal";
import { OrderStatusTag } from "../order-status";

export const OrderDrawerShow = () => {
  const [open, setOpen] = useState(false);
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

  const { data: packagingProductsData, isLoading: packagingProductsLoading } =
    useList({
      resource: "packaging-products",
      filters: [
        {
          field: "plan_id",
          operator: "eq",
          value: order?.plan_id,
        },
      ],
    });

  const back = useBack();
  const [api, contextHolder] = notification.useNotification();
  const { token } = theme.useToken();

  const { mutate } = useUpdate();

  const processedPackageProducts = useMemo(
    () => packagingProductsData?.data || [],
    [packagingProductsData]
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
    });
  };

  const breakpoint = { sm: window.innerWidth > 576 };

  return (
    <>
      {contextHolder}
      <Drawer
        loading={orderLoading || packagingProductsLoading}
        open={true}
        width={breakpoint.sm ? "60%" : "100%"}
        onClose={back}
        style={{
          backgroundColor: token.colorBgLayout,
        }}
        headerStyle={{
          backgroundColor: token.colorBgContainer,
        }}
        title={
          <Flex
            justify="space-between"
            align="center"
            style={{ marginLeft: 16 }}
          >
            <Typography.Title level={4} style={{ margin: 0 }}>
              Thông tin đơn hàng #{orderId}
            </Typography.Title>
            {order?.status === "PendingConfirmation" && (
              <Flex justify="end">
                <Space>
                  <Button
                    color="danger"
                    variant="solid"
                    onClick={() => handleUpdate("Reject")}
                  >
                    Từ chối
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => handleUpdate("Pending")}
                  >
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
                  <TextField
                    style={{
                      textAlign: "end",
                      fontSize: 12,
                      color: "red",
                      fontStyle: "italic",
                      marginTop: 10,
                      marginBottom: 10,
                      justifyContent: "end",
                    }}
                    value={
                      "* Đơn hàng này không thể hoàn thành khi chưa có kế hoạch"
                    }
                  />
                )}
              </Flex>
            )}
          </Flex>
        }
      >
        <Card
          title={
            <Flex justify="space-between">
              <Flex vertical={false} gap={6}>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  Đơn hàng #{orderId}
                </Typography.Title>
              </Flex>
              <Flex justify="end">
                <OrderStatusTag status={order?.status} />
              </Flex>
            </Flex>
          }
        >
          <Flex vertical gap={12}>
            {[
              { label: "Nhà mua sỉ", value: order?.retailer_name },
              { label: "Giống cây", value: order?.plant_name },
              { label: "Địa chỉ", value: order?.address },
              { label: "Số điện thoại", value: order?.phone },
              {
                label: "Số lượng dự kiến",
                value: order?.preorder_quantity
                  ? `${order.preorder_quantity} kg`
                  : "N/A",
              },
              {
                label: "Ngày ước tính lấy hàng",
                value: order?.estimate_pick_up_date ? (
                  <DateField
                    format="DD/MM/YYYY"
                    value={order.estimate_pick_up_date}
                  />
                ) : (
                  "N/A"
                ),
              },
              {
                label: "Ngày tạo đơn",
                value: order?.created_at ? (
                  <DateField
                    format="hh:mm DD/MM/YYYY"
                    value={order.created_at}
                  />
                ) : (
                  "N/A"
                ),
              },
              {
                label: "Mức giá đặt cọc",
                value: order?.deposit_price
                  ? `${order.deposit_price} vnd`
                  : "N/A",
              },
              {
                label: "Giá tổng",
                value: order?.total_price
                  ? `${order.total_price} vnd`
                  : "Chưa có",
              },
            ].map(({ label, value }) => (
              <Flex key={label} justify="space-between">
                <Typography.Text strong>{label}</Typography.Text>
                <Typography.Text>{value}</Typography.Text>
              </Flex>
            ))}
          </Flex>
        </Card>

        <Divider />
        <Card title={"Thông tin kế hoạch"}>
          <Flex justify="space-between">
            <Typography.Text strong>Id</Typography.Text>
            <Typography.Text>{order?.plan_id}</Typography.Text>
          </Flex>
          <Flex justify="space-between">
            <Typography.Text strong>Tên kế hoạch</Typography.Text>
            <Typography.Text>{order?.plan_name}</Typography.Text>
          </Flex>
        </Card>
        <Divider />
        <Card title={"Thông tin sản phẩm"}>
          <Table dataSource={order?.products || []} rowKey="product_id">
            <Table.Column
              title={"ID"}
              dataIndex="product_id"
              key="product_id"
            />

            <Table.Column
              title={"Kiểm định"}
              dataIndex="evaluated_result"
              key="evaluated_result"
              render={(value) => {
                const gradeMap = {
                  "Grade 3": { color: "red", label: "Loại 3" },
                  "Grade 2": { color: "orange", label: "Loại 2" },
                  "Grade 1": { color: "green", label: "Loại 1" },
                };
                const gradeInfo = gradeMap[value] || {};
                return gradeInfo.color ? (
                  <Tag color={gradeInfo.color}>{gradeInfo.label}</Tag>
                ) : null;
              }}
            />

            <Table.Column
              title={"Số lượng"}
              dataIndex="quantity_of_packs"
              key="quantity_of_packs"
            />

            <Table.Column
              title={"Bao bì"}
              dataIndex="product_id"
              key="kind_packaging"
              render={(productId) => {
                const packageProduct = processedPackageProducts.find(
                  (pkg) => pkg.id === productId
                );
                return <TextField value={packageProduct?.name || "N/A"} />;
              }}
            />
          </Table>
        </Card>
        <CompleteOrderModal
          onCancel={() => setOpen(false)}
          onClose={() => setOpen(false)}
          open={open}
        />
      </Drawer>
    </>
  );
};
