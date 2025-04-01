import {
  DateField,
  TagField,
  TextField,
  Title,
  useModalForm,
} from "@refinedev/antd";
import { useShow, useNavigation, useBack, useList } from "@refinedev/core";
import {
  Drawer,
  Flex,
  Grid,
  Typography,
  List,
  Divider,
  Image,
  Table,
  Radio,
  Space,
  Button,
  Modal,
  Tag,
  Select,
  notification,
  Input,
  Form,
  theme,
} from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { set, values } from "lodash";
import { o } from "node_modules/react-router/dist/development/fog-of-war-BALYJxf_.mjs";
import { CompleteOrderModal } from "../complete-modal";
export const OrderDrawerShow = () => {
  const [open, setOpen] = useState(false);
  const { orderId } = useParams();
  const { query: queryResult } = useShow<any>({
    resource: "orders",
    id: orderId,
  });
  const order = queryResult?.data?.data;
  const navigate = useNavigate();
  const back = useBack();
  const [api, contextHolder] = notification.useNotification();
  const { token } = theme.useToken();
  const breakpoint = { sm: window.innerWidth > 576 };
  return (
    <>
      {contextHolder}
      <Drawer
        open={true}
        width={breakpoint.sm ? "736px" : "100%"}
        onClose={back}
        title={
          <>
            {order?.status === "Pending" && (
              <Flex justify="end">
                <Space>
                  <Button color="danger" variant="solid">
                    Từ chối
                  </Button>
                  <Button>Chấp nhận</Button>
                </Space>
              </Flex>
            )}
            {order?.status === "Deposit" && (
              <>
                <Flex justify="end" gap={10}>
                  <Button color="danger" onClick={() => navigate("cancel")}>
                    Hủy bỏ
                  </Button>
                  <Button
                    type="primary"
                    disabled={order?.plan_id === null}
                    onClick={() => setOpen(true)}
                  >
                    Hoàn thành
                  </Button>
                </Flex>

                {order.plan_id === null && (
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
                  ></TextField>
                )}
              </>
            )}
          </>
        }
      >
        <Flex vertical gap={24} style={{ padding: "32px" }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Thông tin chi tiết
          </Typography.Title>
          <List
            style={{ backgroundColor: token.colorBgContainer }}
            bordered
            dataSource={[
              {
                label: "Nhà mua sỉ",
                value: order?.retailer_name,
              },
              {
                label: "Giống cây",
                value: order?.plant_name,
              },
              {
                label: "Trạng thái",
                value: order?.status,
              },
              { label: "Địa chỉ", value: order?.address },
              { label: "Số điện thoại", value: order?.phone },
              {
                label: "Số lượng dự kiến",
                value: order?.preorder_quantity + " kg",
              },
              {
                label: "Ngày ước tính lấy hàng",
                value: (
                  <DateField
                    value={order?.estimate_pick_up_date}
                    format="DD/MM/YYYY"
                  />
                ),
              },
              {
                label: "Ngày tạo đơn",
                value: (
                  <DateField
                    value={order?.created_at}
                    format="hh:mm DD/MM/YYYY"
                  />
                ),
              },
              {
                label: "Mức giá đặt cọc",
                value: order?.deposit_price + " vnd",
              },
              {
                label: "Giá tổng",
                value: order?.total_price
                  ? order?.total_price + " vnd"
                  : "Chưa có",
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text strong>{item.label}:</Typography.Text>{" "}
                {item.value}
              </List.Item>
            )}
          />
          <Divider />
          <Typography.Title level={3} style={{ margin: 0 }}>
            Kế hoạch
          </Typography.Title>
          <List
            style={{ backgroundColor: token.colorBgContainer }}
            bordered
            dataSource={[
              {
                label: "Id ",
                value: order?.plan_id ?? "Chưa có kế hoạch nào",
              },
              {
                label: "Kế hoạch",
                value: order?.plan_name
                  ? order?.plan_name
                  : "Chưa có kế hoạch nào",
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text strong>{item.label}:</Typography.Text>{" "}
                {item.value}
              </List.Item>
            )}
          />
        </Flex>
        <CompleteOrderModal
          onCancel={() => setOpen(false)}
          onClose={() => setOpen(false)}
          open={open}
        />
      </Drawer>
    </>
  );
};
