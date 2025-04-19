import { OrderStatusTag } from "@/components/orders/order-status";
import { DateField } from "@refinedev/antd";
import { Card, Empty, Flex, Typography, Image, theme } from "antd";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router";
interface Order {
  id: string;
  status: OrderStatus;
  plant_id?: string;
  retailer_name?: string;
  deposit_price: number;
  estimate_pick_up_date: string;
  preorder_quantity: number;
  created_at: string;
}
type OrderStatus =
  | "PendingConfirmation"
  | "PendingDeposit"
  | "Cancel"
  | "Reject"
  | "Deposit"
  | "Paid";
type OrderTrackingProps = {
  orderData: any;
  plantData: any;
  loading?: boolean;
  style?: React.CSSProperties;
};
export const DashboardOrdersTracking = ({
  orderData,
  plantData,
  loading,
  style,
}: OrderTrackingProps) => {
  const [activeOrderTab, setActiveOrderTab] = useState<"Pending" | "PendingConfirm" | "Deposit">(
    "Pending",
  );
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [pendingConfirmOrders, setPendingConfirmOrders] = useState<Order[]>([]);
  const [depositeOrders, setDepositeOrders] = useState<Order[]>([]);
  useEffect(() => {
    if (orderData?.data) {
      const pendingOrders = orderData?.data?.filter((order: any) => order?.status === "Pending");
      const pendingConfirmOrders = orderData?.data?.filter(
        (order: any) => order?.status === "PendingConfirmation",
      );
      const depositeOrders = orderData?.data?.filter((order: any) => order.status === "Deposit");
      setPendingOrders(pendingOrders);
      setPendingConfirmOrders(pendingConfirmOrders);
      setDepositeOrders(depositeOrders);
    }
  }, [orderData]);
  const { token } = theme.useToken();
  return (
    <Card
      loading={loading}
      style={style}
      title="Theo dõi đơn hàng"
      tabList={[
        {
          key: "Pending",
          tab: "Chờ đặt cọc",
        },
        {
          key: "PendingConfirm",
          tab: "Chờ xác nhận",
        },
        {
          key: "Deposit",
          tab: "Đã đặt cọc",
        },
      ]}
      activeTabKey={activeOrderTab}
      onTabChange={(key) => setActiveOrderTab(key as any)}
    >
      <div
        id="scrollableOrderTrackingDiv"
        style={{
          height: 400,
          overflow: "auto",
          padding: "4px 2px",
        }}
      >
        <InfiniteScroll
          dataLength={
            activeOrderTab === "Pending"
              ? pendingOrders.length
              : activeOrderTab === "PendingConfirm"
                ? pendingConfirmOrders.length
                : depositeOrders.length
          }
          next={() => {}}
          hasMore={false}
          loader={<Typography.Text type="secondary">Đang tải...</Typography.Text>}
          scrollableTarget="scrollableOrderTrackingDiv"
        >
          {(() => {
            let displayOrders: any[] = [];

            if (activeOrderTab === "Pending") {
              displayOrders = pendingOrders;
            } else if (activeOrderTab === "PendingConfirm") {
              displayOrders = pendingConfirmOrders;
            } else if (activeOrderTab === "Deposit") {
              displayOrders = depositeOrders;
            }

            return displayOrders.length > 0 ? (
              displayOrders.map((order) => {
                const associatedPlant = plantData?.data?.find(
                  (plant: any) => plant?.id === order?.plant_id,
                );

                return (
                  <Flex
                    onClick={() => {
                      navigate(`/orders/${order.id}`);
                    }}
                    className="order-item-hover"
                    key={order.id}
                    gap={16}
                    style={{
                      padding: "16px 12px",
                      borderRadius: 8,
                      background: token?.colorBgLayout,
                      marginBottom: 12,
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                      border: "1px solid #f0f0f0",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {associatedPlant?.image_url && (
                      <div
                        style={{
                          flex: "0 0 110px",
                          alignSelf: "center",
                        }}
                      >
                        <Image
                          width={100}
                          height={100}
                          style={{
                            borderRadius: 8,
                            objectFit: "cover",
                            border: "1px solid #f0f0f0",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                          }}
                          src={associatedPlant.image_url}
                          alt={associatedPlant.plant_name}
                          preview={false}
                        />
                      </div>
                    )}
                    <Flex vertical gap={8} style={{ width: "100%" }}>
                      <Flex justify="space-between" align="center">
                        <Typography.Title
                          level={5}
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: "#f6f6f6",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "14px",
                              fontWeight: "normal",
                              color: "#666",
                            }}
                          >
                            #{order.id}
                          </span>
                          {associatedPlant?.plant_name || "Không xác định"}
                        </Typography.Title>
                        <OrderStatusTag status={order.status} />
                      </Flex>

                      <Flex wrap="wrap" gap="12 8" style={{ marginTop: 4 }}>
                        <Flex gap={2} align="center" style={{ minWidth: "45%" }}>
                          <Typography.Text type="secondary" style={{ fontSize: "13px" }}>
                            Nhà bán:
                          </Typography.Text>
                          <Typography.Text strong style={{ fontSize: "13px" }}>
                            {order.retailer_name || "N/A"}
                          </Typography.Text>
                        </Flex>

                        <Flex gap={2} align="center" style={{ minWidth: "45%" }}>
                          <Typography.Text type="secondary" style={{ fontSize: "13px" }}>
                            Số lượng:
                          </Typography.Text>
                          <Typography.Text strong style={{ fontSize: "13px" }}>
                            {order.preorder_quantity || 0}
                          </Typography.Text>
                        </Flex>

                        <Flex gap={2} align="center" style={{ minWidth: "45%" }}>
                          <Typography.Text type="secondary" style={{ fontSize: "13px" }}>
                            Đặt cọc:
                          </Typography.Text>
                          <Typography.Text
                            strong
                            style={{
                              fontSize: "13px",
                              color: "#f50",
                            }}
                          >
                            {order.deposit_price?.toLocaleString() || 0} đ
                          </Typography.Text>
                        </Flex>

                        <Flex gap={2} align="center" style={{ minWidth: "45%" }}>
                          <Typography.Text type="secondary" style={{ fontSize: "13px" }}>
                            Lấy hàng:
                          </Typography.Text>
                          <DateField
                            value={order.estimate_pick_up_date}
                            format="DD/MM/YYYY"
                            style={{ fontSize: "13px", fontWeight: "bold" }}
                          />
                        </Flex>
                      </Flex>

                      <div
                        style={{
                          borderTop: "1px dashed #f0f0f0",
                          margin: "6px 0",
                          paddingTop: "6px",
                        }}
                      >
                        <Flex gap={2} align="center" style={{ fontSize: "12px" }}>
                          <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
                            Ngày tạo:
                          </Typography.Text>
                          <DateField
                            value={order.created_at}
                            format="DD/MM/YYYY HH:mm"
                            style={{ fontSize: "12px" }}
                          />
                        </Flex>
                      </div>
                    </Flex>
                  </Flex>
                );
              })
            ) : (
              <Empty description="Không có đơn hàng" style={{ marginTop: 60 }} />
            );
          })()}
        </InfiniteScroll>
      </div>
    </Card>
  );
};
