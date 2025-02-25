import {
  FieldTimeOutlined,
  GoldOutlined,
  GroupOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Area } from "@ant-design/plots";
import { DateField, TextField } from "@refinedev/antd";
import { useBack, useShow } from "@refinedev/core";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Steps,
  Table,
  Tabs,
  Tag,
  theme,
  Typography,
} from "antd";
import { DatePickerType } from "antd/es/date-picker";
// Removed import for Paragraph as it does not exist in "antd"
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { set } from "lodash";
import { title } from "process";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
type LayoutType = Parameters<typeof Form>[0]["layout"];

const getTypeTagColor = (value: string) => {
  switch (value) {
    case "planting":
      return "green";
    case "nurturing":
      return "#550000";
    case "watering":
      return "blue";
    case "fertilizing":
      return "orange";
    case "pestcontrol":
      return "yellow";
    default:
      return "default";
  }
};
const getTypeTagValue = (value: string) => {
  switch (value) {
    case "planting":
      return "Gieo hạt";
    case "nurturing":
      return "Chăm sóc";
    case "watering":
      return "Tưới nước";
    case "fertilizing":
      return "Bón phân";
    case "pestcontrol":
      return "Phun thuốc";
    default:
      return "default";
  }
};

export const ApprovalingPlanDrawer = () => {
  const { id } = useParams();
  const [current, setCurrent] = React.useState(0);
  const [form] = Form.useForm();
  const [gainingPlan, setGainingPlan] = useState<any>();
  const [productiveTasks, setProductiveTasks] = useState<any>([]);
  const [harvestingTasks, setHarvestingTasks] = useState<any>([]);
  const [inspectingTasks, setInspectingTasks] = useState<any>([]);
  const [farmers, setFarmers] = useState<any>([]);
  const [chosenFarmers, setChosenFarmers] = useState<any>([]);
  const [plants, setPlants] = useState<any>([]);
  const [experts, setExperts] = useState<any>([]);
  const [yields, setYields] = useState<any>([]);
  const [inspectors, setinspectors] = useState<any>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  ///////////////////////////////////////////////
  const { query: queryResult } = useShow({
    resource: "plans",
    id: id,
  });
  const gainingQuery = useQueries({
    queries: [
      {
        queryKey: ["farmers"],
        queryFn: () =>
          fetch(`http://localhost:3001/farmers`).then((res) => res.json()),
      },
      {
        queryKey: ["productive-tasks"],
        queryFn: () =>
          fetch(`http://localhost:3001/productive-tasks`).then((res) =>
            res.json()
          ),
      },
      {
        queryKey: ["harvesting-tasks"],
        queryFn: () =>
          fetch(`http://localhost:3001/harvesting-tasks`).then((res) =>
            res.json()
          ),
      },
      {
        queryKey: ["inspecting-tasks"],
        queryFn: () =>
          fetch(`http://localhost:3001/inspecting-tasks`).then((res) =>
            res.json()
          ),
      },
      {
        queryKey: ["inspectors"],
        queryFn: () =>
          fetch(`http://localhost:3001/inspectors`).then((res) => res.json()),
      },
      {
        queryKey: ["plants"],
        queryFn: () =>
          fetch(`http://localhost:3001/plants`).then((res) => res.json()),
      },
      {
        queryKey: ["experts"],
        queryFn: () =>
          fetch(`http://localhost:3001/experts`).then((res) => res.json()),
      },
      {
        queryKey: ["yields"],
        queryFn: () =>
          fetch(`http://localhost:3001/lands`).then((res) => res.json()),
      },
    ],
  });
  useEffect(() => {
    console.log("Updated productiveTasks:", productiveTasks);
  }, [productiveTasks]);
  useEffect(() => {
    if (gainingQuery[0].data) {
      setFarmers(gainingQuery[0].data);
    }
    if (gainingQuery[1].data) setProductiveTasks(gainingQuery[1].data);
    if (gainingQuery[2].data) setHarvestingTasks(gainingQuery[2].data);
    if (gainingQuery[3].data) setInspectingTasks(gainingQuery[3].data);
    if (gainingQuery[4].data) setinspectors(gainingQuery[4].data);
    if (gainingQuery[5].data) setPlants(gainingQuery[5].data);
    if (gainingQuery[6].data) setExperts(gainingQuery[6].data);
    if (gainingQuery[7].data) setYields(gainingQuery[7].data);
  }, [gainingQuery.some((query) => query.isFetched)]);
  const column_productive_checked = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "name",
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
        <Tag color={getTypeTagColor(record.type)} style={{ fontSize: "12px" }}>
          {getTypeTagValue(record.type)}
        </Tag>
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
      dataIndex: "name",
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
      dataIndex: "name",
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
  const column_productive = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "name",
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
        <Tag color={getTypeTagColor(record.type)} style={{ fontSize: "12px" }}>
          {getTypeTagValue(record.type)}
        </Tag>
      ),
    },
    {
      title: "Lựa chọn nông dân",
      key: "farmer_id",
      dataIndex: "farmer_id",
      fixed: "left",
      render: (text: any, record: any) => (
        <Select
          key={record.farmer_id}
          value={record?.farmer_id || ""}
          onChange={(value) => {
            const newProductiveTasks = productiveTasks.map((task: any) => {
              if (record.id === task.id) {
                return {
                  ...task,
                  farmer_id: value,
                };
              }
              return task;
            });
            setProductiveTasks(newProductiveTasks);
            console.log(productiveTasks);
          }}
          style={{ width: "150px" }}
        >
          {chosenFarmers.map((farmer: any) => (
            <Select.Option key={farmer.id} value={farmer.id}>
              {farmer.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];
  const column_harvesting = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên thu hoạch",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "startDate",
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
      title: "Lựa chọn nông dân",
      fixed: "left",
      key: "farmer_id",
      dataIndex: "farmer_id",
      render: (text: any, record: any) => (
        <Select
          key={record.id}
          value={record?.farmer_id || ""}
          onChange={(value) => {
            const newHarvestingTask = harvestingTasks.map((task: any) => {
              if (record.id === task.id) {
                return {
                  ...task,
                  farmer_id: value,
                };
              }
              return task;
            });
            setHarvestingTasks(newHarvestingTask);
            console.log(productiveTasks);
          }}
          style={{ width: "150px" }}
        >
          {chosenFarmers.map((chosenFarmer: any) => (
            <Select.Option key={chosenFarmer.id} value={chosenFarmer.id}>
              {chosenFarmer.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];
  const column_inspecting = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "name",
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
      title: "Lựa chọn nhà kiểm định",
      fixed: "left",
      key: "inspector_id",
      dataIndex: "inspector_id",
      render: (text: any, record: any) => (
        <Select
          key={record.id}
          value={record?.inspector_id || ""}
          onChange={(value) => {
            const newInspectingTasks = inspectingTasks.map((task: any) => {
              if (task.id === record.id) {
                return {
                  ...task,
                  inspector_id: value,
                };
              }
              return task;
            });
            setInspectingTasks([...newInspectingTasks]);
          }}
          style={{ width: "150px" }}
        >
          {inspectors.map((inspector: any) => (
            <Select.Option key={inspector.id} value={inspector.id}>
              {inspector.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];
  useEffect(() => {
    const plan = queryResult.data?.data;
    if (queryResult.data) {
      console.log(queryResult.data.data);
      setGainingPlan(queryResult.data.data);
      form.setFieldsValue({
        ...plan,
      });
    }
  }, [queryResult.data]);
  useEffect(() => {
    console.log(gainingPlan);
  }, [gainingPlan]);

  const farm_columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ảnh nông dân",
      dataIndex: "avatar",
      key: "avatar",
      render: (text: any, record: any) => (
        <Avatar src={record?.avatar}></Avatar>
      ),
    },
    {
      title: "Tên nông dân",
      dataIndex: "name",
      key: "name",
    },
  ];
  const farm_modals_columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ảnh nông dân",
      dataIndex: "avatar",
      key: "avatar",
      render: (text: any, record: any) => (
        <Avatar src={record?.avatar}></Avatar>
      ),
    },
    {
      title: "Tên nông dân",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Chọn",
      key: "action",
      render: (text: any, record: any) => (
        <Checkbox
          value={
            chosenFarmers?.find((farmer: any) => farmer.id === record.id)
              ?.chosen || false
          }
          onChange={(e) => {
            if (e.target.checked) {
              setChosenFarmers([...chosenFarmers, { ...record, chosen: true }]);
            } else {
              setChosenFarmers(
                chosenFarmers.filter((farmer: any) => farmer.id !== record.id)
              );
              const newProductiveTask = productiveTasks.map((task: any) => {
                if (task.id === record.id) {
                  return {
                    ...task,
                    farmer_id: null,
                  };
                }
                return task;
              });
              setProductiveTasks(newProductiveTask);
              const newHarvestingTask = harvestingTasks.map((task: any) => {
                if (task.id === record.id) {
                  return {
                    ...task,
                    farmer_id: null,
                  };
                }
                return task;
              });
              setHarvestingTasks(newHarvestingTask);
            }
          }}
        ></Checkbox>
      ),
    },
  ];
  const [tab, setTab] = useState("1");

  const steps = [
    {
      title: "1",
      content: (
        <>
          <Form layout="vertical">
            <Flex justify="center" about="center">
              <Card
                style={{ width: "60%" }}
                title={
                  <>
                    {" "}
                    <Typography.Title style={{ textAlign: "center" }} level={4}>
                      Thông tin kế hoạch
                    </Typography.Title>
                  </>
                }
              >
                <Flex vertical>
                  <Form.Item label="Giống cây trồng">
                    <Flex gap={10}>
                      <Select
                        value={gainingPlan?.seed_id}
                        key={"seed_id"}
                        onChange={(value) => {
                          setGainingPlan({
                            ...gainingPlan,
                            seed_id: value,
                          });
                        }}
                        style={{ width: "100%" }}
                        placeholder="Chọn giống cây trồng"
                      >
                        {plants &&
                          plants.map((plant: any) => (
                            <Select.Option value={plant.id}>
                              {plant.name}
                            </Select.Option>
                          ))}
                      </Select>
                    </Flex>
                  </Form.Item>
                  <Form.Item label="Khu đất">
                    <Flex gap={10}>
                      <Select
                        onChange={(value) => {
                          setGainingPlan({
                            ...gainingPlan,
                            land_id: value,
                          });
                        }}
                        value={gainingPlan?.land_id}
                        key={"land_id"}
                        style={{ width: "100%" }}
                        placeholder="Chọn khu đất gieo trồng"
                      >
                        {yields &&
                          yields.map((yieldItem: any) => (
                            <Select.Option value={yieldItem.id}>
                              {yieldItem.name}
                            </Select.Option>
                          ))}
                      </Select>
                    </Flex>
                  </Form.Item>
                  <Form.Item label="Chuyên gia">
                    <Flex gap={10}>
                      <Select
                        onChange={(value) => {
                          setGainingPlan({
                            ...gainingPlan,
                            expert_id: value,
                          });
                        }}
                        value={gainingPlan?.expert_id}
                        key={"expert_id"}
                        style={{ width: "100%" }}
                        placeholder="Chọn chuyên gia"
                      >
                        {experts &&
                          experts.map((expert: any) => (
                            <Select.Option value={expert.id}>
                              {expert.name}
                            </Select.Option>
                          ))}
                      </Select>
                    </Flex>
                  </Form.Item>

                  <Form.Item
                    label="Sản lượng dự kiến"
                    rules={[
                      {
                        required: true,
                        message: "Nhập sản lượng dự kiến",
                      },
                    ]}
                  >
                    <Flex gap={10}>
                      <Input
                        onChange={(e) => {
                          setGainingPlan({
                            ...gainingPlan,
                            estimated_products: e.target.value,
                          });
                        }}
                        value={gainingPlan?.estimated_products}
                        key={"estimated_products"}
                        placeholder="Nhập sản lượng dự kiến"
                      />
                      <Select
                        value={gainingPlan?.estimated_unit || "kg"}
                        style={{ width: "100px" }}
                        key="estimated_unit"
                        onChange={(value) => {
                          setGainingPlan({
                            ...gainingPlan,
                            estimated_unit: value,
                          });
                        }}
                      >
                        <Select.Option value="kg">kg</Select.Option>
                        <Select.Option value="ton">ton</Select.Option>
                      </Select>
                    </Flex>
                  </Form.Item>
                  <Form.Item label="Ngày bắt đầu dự kiến">
                    <Flex gap={10}>
                      <DatePicker
                        value={dayjs(gainingPlan?.start_date)}
                        format="DD/MM/YYYY"
                        onChange={(value) => {
                          setGainingPlan({
                            ...gainingPlan,
                            start_date: dayjs(value).format("YYYY-MM-DD"),
                          });
                        }}
                        key={"start_date"}
                        placeholder="Ngày bắt đầu dự kiến"
                      />
                    </Flex>
                  </Form.Item>
                  <Form.Item label="Ngày kết thúc dự kiến">
                    <Flex gap={10}>
                      <DatePicker
                        value={dayjs(gainingPlan?.end_date)}
                        defaultValue={dayjs(
                          gainingPlan?.end_date || new Date()
                        )}
                        format="DD/MM/YYYY"
                        onChange={(value) => {
                          setGainingPlan({
                            ...gainingPlan,
                            end_date: value.format("YYYY-MM-DD"),
                          });
                        }}
                        key={"end_date"}
                        placeholder="Ngày kết thúc"
                      />
                    </Flex>
                  </Form.Item>
                  <Form.Item label="Mô tả">
                    <Flex gap={10}>
                      <Input.TextArea
                        onChange={(value) => {
                          setGainingPlan({
                            ...gainingPlan,
                            description: value.target.value,
                          });
                        }}
                        required
                        value={gainingPlan?.description}
                        rows={6}
                        key={"description"}
                        placeholder="Nhập mô tả"
                      />
                    </Flex>
                  </Form.Item>
                </Flex>
              </Card>
            </Flex>
          </Form>
        </>
      ),
    },
    {
      title: "2",
      content: (
        <>
          <Card
            style={{ minHeight: "600px" }}
            title="Lựa chọn nông dân"
            extra={
              <>
                <Button type="primary" color="primary" onClick={showModal}>
                  Thay đổi nông dân tham gia
                </Button>
              </>
            }
          >
            <Table
              columns={farm_columns}
              dataSource={chosenFarmers}
              rowKey="id"
            ></Table>
          </Card>
        </>
      ),
    },
    {
      title: "3",
      content: (
        <>
          <Card title="Phân bổ công việc" style={{ minHeight: "600px" }}>
            <Tabs
              defaultActiveKey={tab}
              tabPosition={"left"}
              style={{ minHeight: 220 }}
            >
              <Tabs.TabPane key="1" tab="Chăm sóc">
                <Table
                  pagination={{
                    pageSize: 10,
                  }}
                  columns={column_productive as ColumnsType<any>}
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
                  columns={column_harvesting as ColumnsType<any>}
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
                  columns={column_inspecting as ColumnsType<any>}
                  dataSource={inspectingTasks}
                  rowKey="id"
                  scroll={{ x: "max-content" }}
                ></Table>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </>
      ),
    },
    {
      title: "4",
      content: (
        <>
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
                          (yieldItem: any) =>
                            yieldItem.id === gainingPlan?.land_id
                        )?.name || "Không có dữ liệu"}
                      </Typography.Text>
                    </Space>
                    <Space align="start" style={{ marginTop: 12 }}>
                      <FieldTimeOutlined style={{ fontSize: 16 }} />
                      <Typography.Text strong>
                        Thời gian dự kiến
                      </Typography.Text>
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
                      <Typography.Text strong>
                        Sản lượng dự kiến:
                      </Typography.Text>
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
                defaultActiveKey={tab}
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
        </>
      ),
    },
  ];
  const back = useBack();
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const { token } = theme.useToken();

  const contentStyle: React.CSSProperties = {
    color: token.colorTextTertiary,
    marginTop: 16,
  };
  const [loading, setLoading] = useState(false);
  const handleDone = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/plans/gaining_plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // <-- Xác định kiểu dữ liệu là JSON
        },
        body: JSON.stringify({
          ...gainingPlan,
          productiveTasks,
          harvestingTasks,
          inspectingTasks,
        }),
      })
        .then((res) => res.json())
        .finally(() => setLoading(false));
      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        alert("Gaining successfully!");
      } else {
        console.error("Request failed with status:", response.status);
        alert("Failed to send data! Please try again");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred!");
    }
  };
  const validateAllTasks = () => {
    for (let task of productiveTasks) {
      if (!task.farmer_id) {
        alert(
          "Chưa chọn nông dân cho công việc chăm sóc cho công việc " +
            task.name +
            " #ID: " +
            task.id
        );
        return false;
      }
    }
    for (let task of harvestingTasks) {
      if (!task.farmer_id) {
        alert(
          "Chưa chọn nông dân cho công việc thu hoạch cho công việc " +
            task.name +
            " #ID: " +
            task.id
        );
        return false;
      }
    }
    for (let task of inspectingTasks) {
      if (!task.inspector_id) {
        alert(
          "Chưa chọn nhà kiểm định cho công việc kiểm định cho công việc " +
            task.name +
            " #ID: " +
            task.id
        );
        return false;
      }
    }
    return true;
  };
  return (
    <Drawer
      loading={loading}
      open
      title={
        <>
          <Steps
            style={{ marginTop: "20px" }}
            current={current}
            onChange={(value: any) => setCurrent(value)}
          >
            <Steps.Step key={1} title="Thông tin chung" />
            <Steps.Step key={2} title="Nông dân tham gia" />
            <Steps.Step key={3} title="Phân bổ công việc" />
            <Steps.Step key={4} title="Xác nhận" />
          </Steps>
        </>
      }
      width={"100%"}
      height={"100%"}
      onClose={back}
      footer={
        <>
          <Flex justify="end">
            {current > 0 && (
              <Button
                loading={loading}
                style={{ margin: "0 8px" }}
                onClick={() => prev()}
              >
                Previous
              </Button>
            )}
            {current < 3 && (
              <Button
                type="primary"
                onClick={() => {
                  if (current == 2) {
                    if (!validateAllTasks()) return;
                  }
                  next();
                }}
              >
                Next
              </Button>
            )}
            {current === 3 && (
              <Button type="primary" onClick={handleDone} loading={loading}>
                Done
              </Button>
            )}
          </Flex>
        </>
      }
    >
      <div style={contentStyle}>{steps[current].content}</div>
      <Modal
        title="Chọn nông dân"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Table dataSource={farmers} columns={farm_modals_columns}></Table>
      </Modal>
    </Drawer>
  );
};
