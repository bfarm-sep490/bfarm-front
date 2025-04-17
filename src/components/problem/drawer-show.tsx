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
  useOne,
  useDelete,
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
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ReportProblemModal } from "./report-modals";
import { ProblemStatusTag } from "./status-tag";
import { StatusTag } from "../caring-task/status-tag";
import { CaringTypeTag } from "../caring-task/type-tag";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DiffOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { AssignTaskModal } from "../plan/detail/assign-tasks-modal";
import TaskModal from "../task-create-update";

type ProblemShowInProblemProps = {
  problemId?: number;
  open?: boolean;
  onClose?: () => void;
  refetch?: () => void;
};

export const ProblemShowInProblem = (props: ProblemShowInProblemProps) => {
  const { id } = useParams();
  const [isAbilityToReport, setIsAbilityToReport] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<number | undefined>(undefined);
  const [openAssignTasks, setOpenAssignTasks] = useState(false);
  const { token } = theme.useToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultReportStatus, setDefaultReportStatus] = useState("Resovle");
  const [selectTaskId, setSelectTaskId] = useState<number | undefined>(undefined);
  const [methodTask, setMethodTask] = useState<"create" | "edit">("create");
  const screens = Grid.useBreakpoint();
  const isLargeScreen = screens?.sm ?? false;
  const [open, setOpen] = useState(false);
  const back = useBack();
  const [api, contextHolder] = notification.useNotification();
  const {
    data: queryResult,
    refetch: problemRefetch,
    isLoading: problemLoading,
  } = useOne<any>({
    resource: "problems",
    id: props?.problemId ?? id,
    queryOptions: {
      enabled: !!(props?.open ?? id),
    },
  });
  const {
    data: taskData,
    isLoading: taskLoading,
    refetch: tasksRefetch,
  } = useList({
    resource: "caring-tasks",
    filters: [{ field: "problem_id", operator: "eq", value: id }],
    queryOptions: {
      enabled: !!(props?.open ?? id),
      onSuccess(data) {
        if (data?.data !== null) {
          data?.data?.forEach((x) => {
            if (x?.farmer_id === null) {
              setIsAbilityToReport(true);
              return;
            }
          });
        }
      },
    },
  });

  const task = queryResult?.data;
  const tasks = taskData?.data;
  const { mutate } = useDelete();

  const hanldeDeleteTask = (taskId: number) => {
    mutate(
      {
        resource: "caring-tasks",
        id: taskId,
      },
      {
        onSuccess: (data) => {
          if (data?.data !== null) {
            api.error({
              message: "Lỗi vui lòng thử lại",
              description: data?.data as unknown as string,
            });
            return;
          }
          tasksRefetch();
          problemRefetch();
        },
        onError: (error) => {
          api.error({
            message: "Có lỗi xảy ra",
            description: error?.message || "Vui lòng thử lại sau",
            placement: "top",
          });
        },
      },
    );
  };
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
      render: (value: any) => <DateField format={"hh:mm DD/MM/YYYY"} value={value} />,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (value: any) => <DateField format={"hh:mm DD/MM/YYYY"} value={value} />,
    },
    {
      title: "Nông dân",
      dataIndex: "farmer_id",
      key: "farmer_name",
      render: (value: any, record: any) => (
        <TextField
          value={
            record?.farmer_information?.find((x: any) => x.farmer_id === value)?.farmer_name ||
            "Chưa xác định"
          }
        />
      ),
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
        <Flex gap={10}>
          {record?.status === "Draft" && (
            <DeleteOutlined style={{ color: "red" }} onClick={() => hanldeDeleteTask(record?.id)} />
          )}
          {record?.status === "Draft" && (
            <EditOutlined
              style={{ color: "green" }}
              onClick={() => {
                setSelectTaskId(record?.id);
                setMethodTask("edit");
                setOpen(true);
              }}
            />
          )}
        </Flex>
      ),
    },
  ];
  useEffect(() => {
    if (props?.open === true) {
      problemRefetch();
      tasksRefetch();
    } else {
      setIsAbilityToReport(true);
      setIsModalOpen(false);
      setOpen(false);
      setOpenAssignTasks(false);
      setTaskId(undefined);
      setDefaultReportStatus("Complete");
    }
  }, [props?.open]);
  return (
    <>
      <Drawer
        loading={problemLoading}
        open={props?.open ?? true}
        width={isLargeScreen ? "60%" : "100%"}
        onClose={props?.onClose ?? back}
        style={{ background: token.colorBgLayout }}
        headerStyle={{
          background: token.colorBgContainer,
        }}
        title={
          <>
            <Flex justify="space-between">
              <Typography.Title level={4}>Chi tiết vấn đề: {task?.problem_name}</Typography.Title>
              <Flex>
                {task?.status === "Pending" && (
                  <Space>
                    {" "}
                    <Button
                      color="danger"
                      variant="solid"
                      onClick={() => {
                        setDefaultReportStatus("Cancel");
                        setIsModalOpen(true);
                      }}
                      icon={<CloseCircleOutlined />}
                    >
                      Hủy bỏ
                    </Button>
                    <Button
                      color="primary"
                      variant="solid"
                      onClick={() => {
                        setDefaultReportStatus("Resolve");
                        setIsModalOpen(true);
                      }}
                      icon={<CheckCircleOutlined />}
                    >
                      Đồng ý
                    </Button>
                  </Space>
                )}
              </Flex>
            </Flex>
          </>
        }
      >
        {contextHolder}
        <TaskModal
          onClose={() => setOpen(false)}
          visible={open}
          action={methodTask}
          planId={task?.plan_id}
          status="Draft"
          taskType={"caring"}
          taskId={selectTaskId}
          problemId={task?.id}
          refetch={tasksRefetch}
        />
        <AssignTaskModal
          open={openAssignTasks}
          onClose={() => setOpenAssignTasks(false)}
          planId={task?.plan_id}
          problemId={task?.id}
          refetch={tasksRefetch}
          type="Draft"
        />
        <Flex vertical gap={24} style={{ padding: "32px" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Hình ảnh
          </Typography.Title>
          {task?.problem_images?.length > 0 ? (
            <Image.PreviewGroup items={task?.problem_images?.map((x: any) => x?.url) || []}>
              <Flex vertical={false} gap={16} justify="center">
                <Image
                  width={"60%"}
                  height={"60%"}
                  loading="lazy"
                  style={{ borderRadius: "10px" }}
                  src={task?.problem_images?.[0]?.url}
                />
              </Flex>
            </Image.PreviewGroup>
          ) : (
            <Typography.Text type="secondary">Không có hình ảnh.</Typography.Text>
          )}
          <Divider />
          {task?.status !== "Pending" && (
            <>
              <Typography.Title level={4}>Kết quả</Typography.Title>
              {task?.result_content ? (
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
            </>
          )}
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
                value: <DateField format={"hh:mm DD/MM/YYYY"} value={task?.created_date} />,
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
                </Flex>
              </>
            }
          >
            {task?.status === "Pending" && (
              <Flex gap={4} justify="end">
                <Button
                  icon={<DiffOutlined />}
                  onClick={() => {
                    setOpenAssignTasks(true);
                  }}
                >
                  Phân việc
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setSelectTaskId(undefined);
                    setMethodTask("create");
                    setOpen(true);
                  }}
                  icon={<PlusCircleOutlined />}
                >
                  Thêm
                </Button>
              </Flex>
            )}
            <Table
              style={{ marginTop: 8 }}
              loading={taskLoading}
              columns={columns}
              dataSource={tasks}
              scroll={{ x: "max-content" }}
            ></Table>
          </Card>
          <ReportProblemModal
            problem_id={(props?.problemId ? props?.problemId : id) as number}
            refetch={() => {
              tasksRefetch();
              problemRefetch();
              if (props?.refetch) props?.refetch();
            }}
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
