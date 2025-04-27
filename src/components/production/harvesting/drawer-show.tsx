import { DateField, TagField, TextField } from "@refinedev/antd";
import { useShow, useBack, useOne, useList } from "@refinedev/core";
import {
  Table,
  theme,
  Flex,
  Grid,
  Typography,
  List,
  Divider,
  Drawer,
  Card,
  Space,
  Row,
  Col,
} from "antd";
import { initial } from "lodash";
import { useParams } from "react-router";
import { ProductionStatus } from "../packaging/list";
import "../../plan/detail/dashboard-problems/index.css";

const { Title, Text } = Typography;

export const HarvestingProductShow = () => {
  const { productId } = useParams();
  const { query: queryResult } = useShow<any>({
    resource: "harvesting-product",
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
  const { data: packagingProductData, isLoading: isPackagingProductLoading } = useList({
    resource: "packaging-products",
    filters: [
      {
        field: "harvesting_task_id",
        operator: "eq",
        value: productId,
      },
    ],
  });
  const packagingProducts = packagingProductData?.data || [];
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <TextField value={text} />,
    },
    {
      title: "Số lượng thành phẩm",
      dataIndex: "retailer_name",
      key: "retailer_name",
      render: (text: string) => <TextField value={text} />,
    },
    {
      title: "Sản lượng trong thành phẩm",
      dataIndex: "quantity_of_packs",
      key: "quantity_of_packs",
      render: (text: string) => <TextField value={text} />,
    },
  ];
  const grade = task?.evaluated_result;

  const gradeLabel =
    grade === "Grade 1"
      ? "Loại 1"
      : grade === "Grade 2"
        ? "Loại 2"
        : grade === "Grade 3"
          ? "Loại 3"
          : grade;

  const gradeColor = grade === "Grade 3" ? "red" : grade === "Grade 2" ? "orange" : "green";

  const gradePriceRatio =
    grade === "Grade 3"
      ? plant?.delta_three
      : grade === "Grade 2"
        ? plant?.delta_two
        : plant?.delta_one;

  const finalPrice = (gradePriceRatio ?? 1) * (plant?.base_price ?? 0);

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
          className="card"
          style={{ width: "100%", borderRadius: 8 }}
          title={
            <Flex justify="space-between" align="center">
              <Space size="middle">
                <Title level={4} style={{ margin: 0 }}>
                  Sản lượng {task?.plant_name?.toLowerCase()}
                </Title>
                <Text style={{ color: gradeColor }}>{gradeLabel}</Text>
              </Space>
              <ProductionStatus status={task?.status} />
            </Flex>
          }
        >
          <Flex vertical gap={16}>
            <Row
              gutter={[0, 16]}
              style={{
                backgroundColor: token.colorBgLayout,
                padding: 16,
                borderRadius: 8,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <Col span={24}>
                <Flex justify="start" gap={10}>
                  <Text strong>Kế hoạch:</Text>
                  <Text>{task?.plan_name ?? "Chưa thu hoạch"}</Text>
                </Flex>
              </Col>

              <Col span={24}>
                <Flex justify="start" gap={10}>
                  <Text strong>Ngày đóng gói:</Text>
                  <DateField format="HH:mm DD/MM/YYYY" value={task?.harvesting_date} />
                </Flex>
              </Col>

              <Col span={24}>
                <Flex justify="start" gap={10}>
                  <Text strong>Ngày hết hạn:</Text>
                  <DateField format="HH:mm DD/MM/YYYY" value={task?.expired_date} />
                </Flex>
              </Col>

              <Col span={24}>
                <Flex justify="start" gap={10}>
                  <Text strong>Sản lượng:</Text>
                  <Text>
                    <Text strong style={{ fontSize: 16 }}>
                      {task?.available_harvesting_quantity}
                    </Text>
                    {` / ${task?.harvesting_quantity} ${task?.harvesting_unit}`}
                  </Text>
                </Flex>
              </Col>
            </Row>
            <Row
              gutter={[0, 16]}
              style={{
                backgroundColor: token.colorBgLayout,
                padding: 16,
                borderRadius: 8,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <Col span={24}>
                <Flex justify="start" gap={10}>
                  <Text strong>Giá cơ bản:</Text>
                  <Text>{plant?.base_price?.toLocaleString()} VND</Text>
                </Flex>
              </Col>

              <Col span={24}>
                <Flex justify="start" gap={10}>
                  <Text strong>Tỉ lệ giá {gradeLabel?.toLowerCase()}:</Text>
                  <Text>{(gradePriceRatio * 100).toFixed(2)}%</Text>
                </Flex>
              </Col>

              <Col span={24}>
                <Flex justify="start" gap={10}>
                  <Text strong>Giá sản lượng thực tế:</Text>
                  <Text strong style={{ fontSize: 16 }}>
                    {finalPrice.toLocaleString()} VND/kg
                  </Text>
                </Flex>
              </Col>
            </Row>
          </Flex>
        </Card>

        <Card className="card" title="Danh sách thành phẩm" style={{ width: "100%" }}>
          <Table pagination={false} bordered columns={columns} dataSource={packagingProducts} />
        </Card>
      </Flex>
    </Drawer>
  );
};
