import {
  FieldTimeOutlined,
  GoldOutlined,
  GroupOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Area } from "@ant-design/plots";
import { DateField } from "@refinedev/antd";
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
import dayjs from "dayjs";
import { set } from "lodash";
import { title } from "process";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
type LayoutType = Parameters<typeof Form>[0]["layout"];

export const ApprovalingPlanDrawer = () => {
  const { id } = useParams();
  const [current, setCurrent] = React.useState(0);
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");
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
  ////////////////////////////////
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
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
    const farmers = gainingQuery[0].data;
    if (farmers) {
      setFarmers(farmers);
    }
    const productiveTasks = gainingQuery[1].data;
    if (productiveTasks) {
      setProductiveTasks(productiveTasks);
    }
    const harvestingTasks = gainingQuery[2].data;
    if (harvestingTasks) {
      setHarvestingTasks(harvestingTasks);
    }
    const inspectingTasks = gainingQuery[3].data;
    if (inspectingTasks) {
      setInspectingTasks(inspectingTasks);
    }
    const inspectors = gainingQuery[4].data;
    if (inspectors) {
      setinspectors(inspectors);
    }
    const plants = gainingQuery[5].data;
    if (plants) {
      setPlants(plants);
    }
    const experts = gainingQuery[6].data;
    if (experts) {
      setExperts(experts);
    }
    const yields = gainingQuery[7].data;
    if (yields) {
      setYields(yields);
    }
  }, [gainingQuery]);

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
        <DateField value={record?.start_date} format="DD-MM-YYYY" />
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text: any, record: any) => (
        <DateField value={record?.end_date} format="DD-MM-YYYY" />
      ),
    },
    {
      title: "Loại chăm sóc",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Lựa chọn nông dân",
      render: (text: any, record: any) => (
        <Select
          onChange={(value) => {
            const newInspectingTasks = inspectingTasks.map((task: any) => {
              if (task.id === record.id) {
                return {
                  ...task,
                  farmer_id: value,
                };
              }
              return task;
            });
            setProductiveTasks(newInspectingTasks);
          }}
          style={{ width: "200px" }}
        >
          {chosenFarmers.map((farmer: any) => (
            <Select.Option value={farmer.id}>{farmer.name}</Select.Option>
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
        <DateField value={record?.start_date} format="DD-MM-YYYY" />
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text: any, record: any) => (
        <DateField value={record?.end_date} format="DD-MM-YYYY" />
      ),
    },
    {
      title: "Lựa chọn nông dân",
      render: (text: any, record: any) => (
        <Select
          onChange={(value) => {
            const newInspectingTasks = inspectingTasks.map((task: any) => {
              if (task.id === record.id) {
                return {
                  ...task,
                  farmer_id: value,
                };
              }
              return task;
            });
            setHarvestingTasks(newInspectingTasks);
          }}
          style={{ width: "200px" }}
        >
          {chosenFarmers.map((chosenFarmer: any) => (
            <Select.Option value={chosenFarmer.id}>
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
        <DateField value={record?.start_date} format="DD-MM-YYYY" />
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text: any, record: any) => (
        <DateField value={record?.end_date} format="DD-MM-YYYY" />
      ),
    },
    {
      title: "Lựa chọn nhà kiểm định",
      render: (text: any, record: any) => (
        <Select
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
            setInspectingTasks(newInspectingTasks);
          }}
          style={{ width: "200px" }}
        >
          {inspectors.map((inspector: any) => (
            <Select.Option value={inspector.id}>{inspector.name}</Select.Option>
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
          value={record.chosen}
          onChange={(e) => {
            if (e.target.checked) {
              setChosenFarmers([...chosenFarmers, { ...record, chosen: true }]);
            } else {
              setChosenFarmers(
                chosenFarmers.filter((farmer: any) => farmer.id !== record.id)
              );
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
          <Flex justify="center" about="center">
            <Card>
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
                      {plants.map((plant: any) => (
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
                      {yields.map((yieldItem: any) => (
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
                      {experts.map((expert: any) => (
                        <Select.Option value={expert.id}>
                          {expert.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Flex>
                </Form.Item>

                <Form.Item label="Sản lượng dự kiến">
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
                      value={gainingPlan?.estimated_unit}
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
                <Form.Item label="Thời gian dự kiến">
                  <Flex gap={10}>
                    <DatePicker
                      defaultValue={dayjs(gainingPlan?.start_date)}
                      format="DD-MM-YYYY"
                      onChange={(value) => {
                        setGainingPlan({
                          ...gainingPlan,
                          start_date: value.format("YYYY-MM-DD"),
                        });
                      }}
                      key={"start_date"}
                      placeholder="Ngày bắt đầu"
                    />
                    -
                    <DatePicker
                      defaultValue={dayjs(gainingPlan?.end_date)}
                      format="DD-MM-YYYY"
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
                      value={gainingPlan?.description}
                      rows={6}
                      key={"description"}
                      placeholder="Nhập sản lượng dự kiến"
                    />
                  </Flex>
                </Form.Item>
              </Flex>
            </Card>
          </Flex>
        </>
      ),
    },
    {
      title: "2",
      content: (
        <>
          <Card
            style={{ height: "600px" }}
            title="Lựa chọn nông dân"
            extra={
              <>
                <Button type="primary" color="primary" onClick={showModal}>
                  Thêm nhân viên
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
          <Card title="Phân bổ công việc" style={{ height: "600px" }}>
            <Tabs
              defaultActiveKey={tab}
              tabPosition={"left"}
              style={{ height: 220 }}
            >
              <Tabs.TabPane key="1" tab="Chăm sóc">
                <Table
                  columns={column_productive}
                  dataSource={productiveTasks}
                  rowKey="id"
                ></Table>
              </Tabs.TabPane>
              <Tabs.TabPane key="2" tab="Thu hoạch">
                <Table
                  columns={column_harvesting}
                  dataSource={harvestingTasks}
                  rowKey="id"
                ></Table>
              </Tabs.TabPane>
              <Tabs.TabPane key="3" tab="Kiểm định">
                <Table
                  columns={column_inspecting}
                  dataSource={inspectingTasks}
                  rowKey="id"
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
          <Flex vertical justify="center" about="center">
            <Card>
              <Typography.Title level={4}></Typography.Title>

              <Row gutter={[16, 16]}>
                <Col>
                  <Flex vertical gap={16} style={{ flex: 1 }}>
                    <Space align="start" style={{ marginTop: 12 }}>
                      <UserOutlined style={{ fontSize: 16 }} />
                      <Typography.Text strong>Cây trồng:</Typography.Text>
                      <Typography.Text></Typography.Text>
                    </Space>

                    <Space align="start" style={{ marginTop: 12 }}>
                      <GoldOutlined style={{ fontSize: 16 }} />
                      <Typography.Text strong>Khu đất:</Typography.Text>
                      <Typography.Text></Typography.Text>
                    </Space>
                    <Space align="start" style={{ marginTop: 12 }}>
                      <FieldTimeOutlined style={{ fontSize: 16 }} />
                      <Typography.Text strong>
                        Thời gian dự kiến
                      </Typography.Text>
                      <Typography.Text></Typography.Text>
                    </Space>
                    <Space align="start" style={{ marginTop: 12 }}>
                      <GroupOutlined style={{ fontSize: 16 }} />
                      <Typography.Text strong>
                        Sản lượng dự kiến:
                      </Typography.Text>
                      <Typography.Text></Typography.Text>
                    </Space>

                    <Space align="start" style={{ marginTop: 12 }}>
                      <FieldTimeOutlined style={{ fontSize: 16 }} />
                      <Typography.Text strong>Chuyên gia:</Typography.Text>
                      <Typography.Text></Typography.Text>
                    </Space>
                  </Flex>
                </Col>
                <Col xs={24} md={12}>
                  <Typography.Text></Typography.Text>
                </Col>
              </Row>
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

  return (
    <Drawer
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
              <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                Previous
              </Button>
            )}
            {current < 4 && (
              <Button type="primary" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === 4 && <Button type="primary">Done</Button>}
          </Flex>
        </>
      }
    >
      <div style={contentStyle}>{steps[current].content}</div>
      <Modal title="Chọn nhân viên tham gia" open={open} onOk={handleOk}>
        <Table dataSource={farmers} columns={farm_modals_columns}></Table>
      </Modal>
    </Drawer>
  );
};
