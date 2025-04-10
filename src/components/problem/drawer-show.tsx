import { DateField, TagField, TextField, Title, useModalForm } from "@refinedev/antd";
import {
  useShow,
  useNavigation,
  useBack,
  useUpdate,
  useTranslate,
  useGetIdentity,
  useApiUrl,
  useNotification,
  useCustomMutation,
  useList,
} from "@refinedev/core";
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
  theme,
  Card,
  Form,
  Modal,
  Spin,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ReportProblemModal } from "./report-modals";
import { ProblemStatusTag } from "./status-tag";
import { CaringModal } from "@/pages/problems/create-caring";
import { StatusTag } from "../caring-task/status-tag";
import { CaringTypeTag } from "../caring-task/type-tag";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { AssignTaskModal } from "../plan/assign-tasks-modal";

export const ProblemShowInProblem = () => {
  const { id } = useParams();
  const { query: queryResult } = useShow<any>({
    resource: "problems",
    id,
  });
  const {
    data: taskData,
    isLoading,
    refetch: tasksRefetch,
  } = useList({
    resource: "caring-tasks",
    filters: [{ field: "problem_id", operator: "eq", value: id }],
  });
  const [taskId, setTaskId] = useState<number | undefined>(undefined);
  const [openAssignTasks, setOpenAssignTasks] = useState(false);
  const { token } = theme.useToken();
  const [open, setOpen] = useState(false);
  const back = useBack();
  const breakpoint = { sm: window.innerWidth > 576 };
  const { data } = queryResult;
  const task = data?.data;
  const tasks = taskData?.data;
  const columns = [
    {
      title: "Tên hoạt động",
      dataIndex: "task_name",
      key: "task_name",
    },
    {
      title: "Loại công việc",
      dataIndex: "task_type",
      key: "task_type",
      render: (value: any) => <CaringTypeTag status={value} />,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (value: any) => <DateField value={value} />,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (value: any) => <DateField value={value} />,
    },
    {
      title: "Nông dân",
      dataIndex: "farmer_information.farmer_name",
      key: "farmer_name",
      render: (value: any) => <TextField value={value ? value : "Chưa xác định"} />,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",

      render: (value: any) => <StatusTag status={value} />,
    },
    {
      title: "Hoạt động",
      dataIndex: "actions",
      key: "actions",
      fixed: "right" as const,
      render: (value: any, record: any) => (
        <>
          <DeleteOutlined />
          <EditOutlined
            onClick={() => {
              setTaskId(record?.id);
              setOpen(true);
            }}
          />
        </>
      ),
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultReportStatus, setDefaultReportStatus] = useState("Resovled");
  return (
    <>
      <Drawer
        open={true}
        width={breakpoint.sm ? "60%" : "100%"}
        onClose={back}
        style={{ background: token.colorBgLayout }}
        headerStyle={{
          background: token.colorBgContainer,
        }}
        title={
          <>
            <CaringModal
              refetch={tasksRefetch}
              planId={task?.plan_id}
              problemId={task?.id}
              open={open}
              taskId={taskId}
              onClose={() => setOpen(false)}
            />
            <AssignTaskModal
              open={openAssignTasks}
              onClose={() => setOpenAssignTasks(false)}
              planId={task?.plan_id}
              problemId={task?.id}
              refetch={tasksRefetch}
              type="Draft"
            />
            <Flex justify="space-between">
              <Typography.Title level={4}>Chi tiết vấn đề</Typography.Title>

              <Space>
                {task?.status === "Pending" && (
                  <>
                    {" "}
                    <Button
                      color="danger"
                      variant="solid"
                      onClick={() => {
                        setDefaultReportStatus("Cancelled");
                        setIsModalOpen(true);
                      }}
                    >
                      Hủy bỏ
                    </Button>
                    <Button
                      color="primary"
                      variant="solid"
                      onClick={() => {
                        setDefaultReportStatus("Resolved");
                        setIsModalOpen(true);
                      }}
                    >
                      Đồng ý
                    </Button>
                  </>
                )}
              </Space>
            </Flex>
          </>
        }
      >
        <Flex vertical gap={24} style={{ padding: "32px" }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            <strong>#{task?.id}</strong> - {task?.problem_name}
          </Typography.Title>

          <Image.PreviewGroup items={task?.problem_images?.map((x: any) => x?.url) || []}>
            <Image
              loading="lazy"
              style={{ borderRadius: "10px" }}
              src={task?.problem_images?.[0]?.url}
            />
          </Image.PreviewGroup>
          <Divider />

          <Typography.Title level={4}>Kết quả</Typography.Title>
          {task?.result_content && task?.status === "Resolved" ? (
            <Flex vertical gap={16}>
              <List
                style={{ backgroundColor: token.colorBgContainer }}
                bordered
                dataSource={[
                  {
                    label: "Nội dung",
                    value: <Typography.Paragraph>{task?.result_content}</Typography.Paragraph>,
                  },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Typography.Text strong>{item.label}:</Typography.Text> {item.value}
                  </List.Item>
                )}
              />
            </Flex>
          ) : (
            <Typography.Text type="secondary">Chưa có kết quả.</Typography.Text>
          )}
          <Divider />
          <Typography.Title level={4}>Nội dung</Typography.Title>
          <List
            style={{ backgroundColor: token.colorBgContainer }}
            bordered
            dataSource={[
              {
                label: "Nông dân",
                value: <TextField value={task?.farmer_name} />,
              },
              {
                label: "Kế hoạch",
                value: <TextField value={task?.plan_name} />,
              },
              {
                label: "Ngày phát hiện",
                value: <DateField value={task?.created_date} />,
              },

              {
                label: "Trạng thái",
                value: <ProblemStatusTag status={task?.status} />,
              },
              {
                label: "Mô tả vấn đề",
                value: <Typography.Paragraph>{task?.description}</Typography.Paragraph>,
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text strong>{item.label}:</Typography.Text> {item.value}
              </List.Item>
            )}
          />
          <Divider />
          <Typography.Title level={4}>Hoạt động</Typography.Title>
          <Card
            style={{ borderRadius: "10px" }}
            title={
              <>
                <Flex vertical={false} gap={16} justify="space-between">
                  <Typography.Title level={5}>Danh sách hoạt động</Typography.Title>
                  {task?.status === "Pending" && (
                    <Flex gap={10}>
                      <Button
                        onClick={() => {
                          setOpenAssignTasks(true);
                        }}
                      >
                        Gán công việc
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          setTaskId(undefined);
                          setOpen(true);
                        }}
                      >
                        Thêm hoạt động
                      </Button>
                    </Flex>
                  )}
                </Flex>
              </>
            }
          >
            <Table
              loading={isLoading}
              columns={columns}
              dataSource={tasks}
              scroll={{ x: "max-content" }}
            ></Table>
          </Card>
          <ReportProblemModal
            close={() => {
              setIsModalOpen(false);
            }}
            open={isModalOpen}
            status={defaultReportStatus}
          />
        </Flex>{" "}
      </Drawer>
    </>
  );
};
