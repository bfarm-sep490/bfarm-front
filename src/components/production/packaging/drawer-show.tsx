import { DateField, TagField, TextField } from "@refinedev/antd";
import { useShow, useBack, useOne } from "@refinedev/core";
import { Table, theme, Flex, Grid, Typography, List, Divider, Drawer, Card } from "antd";
import { useParams } from "react-router";
import { ProductionStatus } from "./list";
const { Title, Text } = Typography;

export const PackagingProductShow = () => {
  const { productId } = useParams();
  const { query: queryResult } = useShow<any>({
    resource: "packaging-products",
    id: productId,
  });
  const back = useBack();
  const { data: taskData, isLoading } = queryResult;
  const task = taskData?.data;
  const { token } = theme.useToken();
  const { data: plantData, isLoading: isPlantLoading } = useOne({
    resource: "plants",
    id: task?.plant_id,
  });
  const plant = plantData?.data;
  const breakpoint = Grid.useBreakpoint();
  const orders = task?.orders || [];
  const columns = [
    {
      title: "Id",
      dataIndex: "order_id",
      key: "order_id",
      render: (text: string) => <TextField value={text} />,
    },
    {
      title: "Tên chủ đơn hàng",
      dataIndex: "retailer_name",
      key: "retailer_name",
      render: (text: string) => <TextField value={text} />,
    },
    {
      title: "Số lượng thành phẩm",
      dataIndex: "quantity_of_packs",
      key: "quantity_of_packs",
      render: (text: string) => <TextField value={text} />,
    },
  ];
  const grade = task?.evaluated_result;
  const quantityPerPack = task?.quantity_per_pack;
  const gradeLabel =
    grade === "Grade 1"
      ? "Loại 1"
      : grade === "Grade 2"
        ? "Loại 2"
        : grade === "Grade 3"
          ? "Loại 3"
          : grade;

  const gradeColor = grade === "Grade 3" ? "red" : grade === "Grade 2" ? "orange" : "green";

  const priceRatio =
    grade === "Grade 3"
      ? plant?.delta_three
      : grade === "Grade 2"
        ? plant?.delta_two
        : plant?.delta_one;

  const finalPrice = (priceRatio ?? 1) * (plant?.base_price ?? 0) * (quantityPerPack ?? 1);
  return (
    <Drawer
      zIndex={1001}
      loading={isLoading}
      open={true}
      width={breakpoint.sm ? "60%" : "100%"}
      onClose={back}
      style={{
        backgroundColor: token.colorBgLayout,
        borderTopLeftRadius: "5px",
        borderBottomLeftRadius: "5px",
      }}
      headerStyle={{
        backgroundColor: token.colorBgContainer,
      }}
      title={<TextField style={{ padding: "16px" }} value={"Chi tiết thành phẩm"} />}
    >
      <Flex vertical gap={24} style={{ padding: "32px" }}>
        <Card
          style={{ width: "100%" }}
          title={
            <Flex justify="space-between" align="center">
              <Flex gap={8} align="center">
                <Title level={4} style={{ margin: 0 }}>
                  Thành Phẩm {quantityPerPack} kg {task?.plant_name?.toLowerCase()}
                </Title>
                <Text style={{ fontSize: 14, color: gradeColor }}>{gradeLabel}</Text>
              </Flex>
              <ProductionStatus status={task?.status} />
            </Flex>
          }
        >
          <Flex
            vertical
            gap={12}
            style={{
              padding: "16px",
              background: token?.colorBgLayout,
              borderRadius: 8,
            }}
          >
            <Flex justify="start" gap={10}>
              <Text strong>Kế hoạch</Text>
              <Text>{task?.plan_name ?? "Chưa thu hoạch"}</Text>
            </Flex>

            <Flex justify="start" gap={10}>
              <Text strong>Ngày đóng gói</Text>
              <DateField format="HH:mm DD/MM/YYYY" value={task?.packaging_date} />
            </Flex>

            <Flex justify="start" gap={10}>
              <Text strong>Ngày hết hạn</Text>
              <DateField format="HH:mm DD/MM/YYYY" value={task?.expired_date} />
            </Flex>

            <Flex justify="start" gap={10}>
              <Text strong>Số lượng thành phẩm</Text>
              <Text>
                <Text strong style={{ fontSize: 16 }}>
                  {task?.available_packs}
                </Text>
                {" / "}
                {task?.total_packs} gói
              </Text>
            </Flex>

            <Flex justify="start" gap={10}>
              <Text strong>Sản lượng trong thành phẩm</Text>
              <Text>
                <Text strong style={{ fontSize: 16 }}>
                  {quantityPerPack} kg
                </Text>
                {" / thành phẩm"}
              </Text>
            </Flex>
          </Flex>

          <Flex
            vertical
            gap={12}
            style={{
              marginTop: 16,
              padding: "16px",
              background: token?.colorBgLayout,
              borderRadius: 8,
            }}
          >
            <Flex justify="start" gap={10}>
              <Text strong>Giá cơ bản</Text>
              <Text>{plant?.base_price?.toLocaleString()} VND</Text>
            </Flex>

            <Flex justify="start" gap={10}>
              <Text strong>Tỉ lệ giá {gradeLabel?.toLowerCase()}</Text>
              <Text>{(priceRatio * 100).toFixed(2)}%</Text>
            </Flex>

            <Flex justify="start" gap={10}>
              <Text strong>Giá thành phẩm</Text>
              <Text strong style={{ fontSize: 18 }}>
                {finalPrice.toLocaleString()} VND
              </Text>
            </Flex>
          </Flex>
        </Card>

        <Card title="Danh sách đơn hàng" style={{ width: "100%" }}>
          <Table pagination={false} bordered columns={columns} dataSource={orders} />
        </Card>
      </Flex>
    </Drawer>
  );
};
