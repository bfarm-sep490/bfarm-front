import {
  FieldTimeOutlined,
  GoldOutlined,
  GroupOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { DateField, TextField } from "@refinedev/antd";
import { Card, Col, Flex, Row, Space, Table, Tabs, Typography } from "antd";
import dayjs from "dayjs";
import { CaringTypeTag } from "../../../components/caring-task/type-tag";

type Props = {
  plants: any;
  yields: any;
  gainingPlan: any;
  experts: any;
  productiveTasks: any;
  harvestingTasks: any;
  inspectingTasks: any;
  inspectors: any;
  farmers: any;
};

export const VerifyPlanInformation = ({
  plants,
  yields,
  gainingPlan,
  experts,
  productiveTasks,
  harvestingTasks,
  inspectingTasks,
  inspectors,
  farmers,
}: Props) => {
  const column_productive_checked = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (text: any, record: any) => (
        <DateField value={record?.start_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text: any, record: any) => (
        <DateField value={record?.end_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Loại chăm sóc",
      dataIndex: "type",
      key: "type",
      render: (text: any, record: any) => (
        <CaringTypeTag status={record?.task_type} />
      ),
    },
    {
      title: "Nông dân",
      dataIndex: "farmer_id",
      key: "farmer_id",
      render: (text: any, record: any) => (
        <TextField
          value={
            farmers?.find((farmer: any) => farmer.id === record.farmer_id)
              ?.name || "Chưa xác định"
          }
        />
      ),
    },
  ];
  const column_harvesting_checked = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (text: any, record: any) => (
        <DateField value={record?.start_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text: any, record: any) => (
        <DateField value={record?.end_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Nông dân",
      dataIndex: "farmer_id",
      key: "farmer_id",
      render: (text: any, record: any) => (
        <TextField
          value={
            farmers?.find((farmer: any) => farmer.id === record.farmer_id)
              ?.name || "Chưa xác định"
          }
        />
      ),
    },
  ];
  const column_inspecting_checked = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "task_name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (text: any, record: any) => (
        <DateField value={record?.start_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text: any, record: any) => (
        <DateField value={record?.end_date} format="DD/MM/YYYY" />
      ),
    },
    {
      title: "Nhà kiểm định",
      dataIndex: "inspector_id",
      key: "inspector_id",
      render: (text: any, record: any) => (
        <TextField
          value={
            inspectors?.find(
              (inspector: any) => inspector.id === record.inspector_id
            )?.name || "Chưa xác định"
          }
        />
      ),
    },
  ];
  return (
    <Flex vertical justify="center" about="center" gap={10}>
      <Card title={"Xác nhận thông tin chung kế hoạch"}>
        <Typography.Title level={4}></Typography.Title>

        <Row gutter={[16, 16]}>
          <Col>
            <Flex vertical gap={16} style={{ flex: 1 }}>
              <Space align="start" style={{ marginTop: 12 }}>
                <UserOutlined style={{ fontSize: 16 }} />
                <Typography.Text strong>Cây trồng:</Typography.Text>

                <Typography.Text>
                  {plants?.find(
                    (plant: any) => plant.id === gainingPlan?.seed_id
                  )?.name || "Không có dữ liệu"}
                </Typography.Text>
              </Space>

              <Space align="start" style={{ marginTop: 12 }}>
                <GoldOutlined style={{ fontSize: 16 }} />
                <Typography.Text strong>Khu đất:</Typography.Text>
                <Typography.Text>
                  {yields?.find(
                    (yieldItem: any) => yieldItem.id === gainingPlan?.yield_id
                  )?.name || "Không có dữ liệu"}
                </Typography.Text>
              </Space>
              <Space align="start" style={{ marginTop: 12 }}>
                <FieldTimeOutlined style={{ fontSize: 16 }} />
                <Typography.Text strong>Thời gian dự kiến</Typography.Text>
                <Typography.Text>
                  <DateField
                    value={dayjs(gainingPlan?.start_date)}
                    format="DD/MM/YYYY"
                  ></DateField>{" "}
                  -{" "}
                  <DateField
                    value={dayjs(gainingPlan?.end_date)}
                    format="DD/MM/YYYY"
                  ></DateField>
                </Typography.Text>
              </Space>
              <Space align="start" style={{ marginTop: 12 }}>
                <GroupOutlined style={{ fontSize: 16 }} />
                <Typography.Text strong>Sản lượng dự kiến:</Typography.Text>
                <Typography.Text>
                  {gainingPlan?.estimated_products}{" "}
                  {gainingPlan?.estimated_unit}
                </Typography.Text>
              </Space>

              <Space align="start" style={{ marginTop: 12 }}>
                <FieldTimeOutlined style={{ fontSize: 16 }} />
                <Typography.Text strong>Chuyên gia:</Typography.Text>
                <Typography.Text>
                  {experts?.find(
                    (expert: any) => expert.id === gainingPlan?.expert_id
                  )?.name || "Không có dữ liệu"}
                </Typography.Text>
              </Space>
            </Flex>
          </Col>
          <Col>
            <FieldTimeOutlined style={{ fontSize: 16 }} />
            <Typography.Text strong>Mô tả</Typography.Text>
            <Typography.Paragraph>
              {gainingPlan?.description}
            </Typography.Paragraph>
          </Col>
        </Row>
      </Card>
      <Card
        title={"Xác nhận công việc đã phân công của kế hoạch"}
        style={{ minHeight: "600px" }}
      >
        <Tabs
          defaultActiveKey={"1"}
          tabPosition={"left"}
          style={{ minHeight: 220 }}
        >
          <Tabs.TabPane key="1" tab="Chăm sóc">
            <Table
              pagination={{
                pageSize: 10,
              }}
              columns={column_productive_checked}
              dataSource={productiveTasks}
              rowKey="id"
              scroll={{ x: "max-content" }}
            ></Table>
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab="Thu hoạch">
            <Table
              pagination={{
                pageSize: 10,
              }}
              columns={column_harvesting_checked}
              dataSource={harvestingTasks}
              rowKey="id"
              scroll={{ x: "max-content" }}
            ></Table>
          </Tabs.TabPane>
          <Tabs.TabPane key="3" tab="Kiểm định">
            <Table
              pagination={{
                pageSize: 10,
              }}
              columns={column_inspecting_checked}
              dataSource={inspectingTasks}
              rowKey="id"
              scroll={{ x: "max-content" }}
            ></Table>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Flex>
  );
};
