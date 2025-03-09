import {
  type BaseKey,
  type HttpError,
  useGetToPath,
  useGo,
  useNavigation,
  useShow,
  useTranslate,
  useList,
  useUpdate, // Thêm hook useUpdate
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  List,
  Typography,
  theme,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined } from "@ant-design/icons";
import { IInspector, IInspectingForm } from "@/interfaces";
import { useState } from "react";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

const TaskStatusTag = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    Completed: "green",
    OnGoing: "blue",
    Pending: "gold",
    Draft: "gray",
    Cancel: "red",
  };

  return <Tag color={colorMap[status] || "gray"}>{status.toUpperCase()}</Tag>;
};

export const InspectorDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<IInspectingForm | null>(null); // Lưu task được chọn để chỉnh sửa
  const breakpoint = Grid.useBreakpoint();
  const [form] = Form.useForm(); // Form instance

  // Fetch dữ liệu của Inspector
  const { query: queryResult } = useShow<IInspector, HttpError>({
    resource: "inspector",
    id: props?.id,
  });

  // Fetch danh sách nhiệm vụ của Inspector (lọc theo `inspectorID`)
  const { data: taskData } = useList<IInspectingForm>({
    resource: "inspectingTask",
  });

  // Hook để cập nhật dữ liệu
  const { mutate: updateTask } = useUpdate<IInspectingForm>();

  const inspector = queryResult.data?.data;

  // Lọc chỉ các `inspectingTask` có `inspectorID` khớp với `inspector` hiện tại
  const inspectorTasks = taskData?.data.filter((task) => task.inspector_id === inspector?.id) || [];

  const handleDrawerClose = () => {
    if (props?.onClose) {
      props.onClose();
      return;
    }

    go({
      to: searchParams.get("to") ?? getToPath({ action: "list" }) ?? "",
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  // Xử lý khi nhấn nút "Complete"
  const handleEditClick = (task: IInspectingForm) => {
    setSelectedTask(task); // Lưu task được chọn
    form.setFieldsValue(task); // Đặt giá trị mặc định cho form
    setEditOpen(true); // Mở modal chỉnh sửa
  };

  // Xử lý khi nhấn nút "Save" trong modal chỉnh sửa
  const handleSave = () => {
    form.validateFields().then((values) => {
      if (selectedTask) {
        updateTask({
          resource: "inspectingTask",
          id: selectedTask.id,
          values: {
            ...selectedTask,
            ...values,
          },
        });
        setEditOpen(false); // Đóng modal sau khi lưu
      }
    });
  };

  return (
    <>
      <Drawer
        open={true}
        width={breakpoint.sm ? "500px" : "100%"}
        zIndex={1001}
        onClose={handleDrawerClose}
      >
        {/* Avatar + Name + Description */}
        <Flex vertical align="center" justify="center" style={{ padding: "16px" }}>
          <Avatar
            shape="square"
            style={{
              aspectRatio: 1,
              objectFit: "contain",
              width: "160px",
              height: "160px",
              borderRadius: "8px",
            }}
            src={inspector?.image_url || "/images/inspector-default-img.png"}
            alt={inspector?.name}
          />
          <Typography.Title level={4} style={{ marginTop: "12px" }}>
            {inspector?.name}
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ textAlign: "center", padding: "0 16px" }}>
            {inspector?.description}
          </Typography.Paragraph>
        </Flex>

        <Divider />

        {/* Hiển thị thông tin Inspector */}
        <List
          dataSource={[
            { label: "Account ID", value: inspector?.account_id },
            { label: "Address", value: inspector?.address },
          ]}
          renderItem={(data) => (
            <List.Item
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 16px",
              }}
            >
              <Typography.Text type="secondary">{data.label}: </Typography.Text>
              <Typography.Text strong>{data.value}</Typography.Text>
            </List.Item>
          )}
        />

        {/* Hiển thị các nhiệm vụ của Inspector này */}
        {inspectorTasks.length > 0 ? (
          <>
            <Divider>Inspecting Tasks</Divider>
            {inspectorTasks.map((task, index) => (
              <div key={task.id}>
                <Typography.Title level={5} style={{ padding: "0 16px", marginTop: "16px" }}>
                  {task.task_name}
                </Typography.Title>
                <List
                  dataSource={[
                    { label: "Task ID", value: task.id },
                    { label: "Plan ID", value: task.plan_id },
                    { label: "Task Name", value: task.task_name },
                    { label: "Task Type", value: task.task_type },
                    { label: "Description", value: task.description },
                    {
                      label: "Start Date",
                      value: new Date(task.start_date).toLocaleDateString(),
                    },
                    {
                      label: "End Date",
                      value: new Date(task.end_date).toLocaleDateString(),
                    },
                    {
                      label: "Completed Date",
                      value: task.completed_date
                        ? new Date(task.completed_date).toLocaleDateString()
                        : "N/A",
                    },
                    { label: "Result Content", value: task.result_content },
                    {
                      label: "Brix Point",
                      value: task.brix_point !== null ? `${task.brix_point}` : "N/A",
                    },
                    {
                      label: "Temperature (°C)",
                      value: `${task.temperature}°C`,
                    },
                    { label: "Humidity (%)", value: `${task.humidity}%` },
                    {
                      label: "Moisture (%)",
                      value: task.moisture !== null ? `${task.moisture}%` : "N/A",
                    },
                    { label: "Shell Color", value: task.shell_color || "N/A" },
                    {
                      label: "Test GT Kit Color",
                      value: task.test_gt_kit_color || "N/A",
                    },
                    {
                      label: "Inspecting Quantity",
                      value: `${task.inspecting_quantity} ${task.unit}`,
                    },
                    { label: "Issue Percent", value: `${task.issue_percent}%` },
                    {
                      label: "Can Harvest",
                      value: task.can_harvest ? "Yes" : "No",
                    },
                    {
                      label: "Status",
                      value: <TaskStatusTag status={task.status} />,
                    },
                    { label: "Inspector ID", value: task.inspector_id },
                    {
                      label: "Created At",
                      value: new Date(task.created_at).toLocaleString(),
                    },
                    {
                      label: "Updated At",
                      value: new Date(task.updated_at).toLocaleString(),
                    },
                  ]}
                  renderItem={(data) => (
                    <List.Item
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 16px",
                      }}
                    >
                      <Typography.Text type="secondary">{data.label}: </Typography.Text>
                      <Typography.Text strong>{data.value}</Typography.Text>
                    </List.Item>
                  )}
                />
                {index < inspectorTasks.length - 1 && <Divider style={{ margin: "8px 0" }} />}
                <Flex align="center" justify="flex-end" style={{ padding: "16px" }}>
                  <Button icon={<EditOutlined />} onClick={() => handleEditClick(task)}>
                    Complete
                  </Button>
                </Flex>
              </div>
            ))}
          </>
        ) : (
          <Typography.Text style={{ padding: "16px" }}>
            No tasks assigned to this inspector.
          </Typography.Text>
        )}
      </Drawer>

      <Modal
        title="Edit Task"
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        onOk={handleSave}
        zIndex={2000} // Đặt z-index cao hơn Drawer
        style={{ top: 20 }} // Điều chỉnh vị trí nếu cần
      >
        <Form form={form} layout="vertical">
          <Form.Item name="resultContent" label="Result Content">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="brixPoint" label="Brix Point">
            <InputNumber />
          </Form.Item>
          <Form.Item name="temperature" label="Temperature (°C)">
            <InputNumber />
          </Form.Item>
          <Form.Item name="humidity" label="Humidity (%)">
            <InputNumber />
          </Form.Item>
          <Form.Item name="moisture" label="Moisture (%)">
            <InputNumber />
          </Form.Item>
          <Form.Item name="shellColor" label="Shell Color">
            <Input />
          </Form.Item>
          <Form.Item name="testGTKitColor" label="Test GT Kit Color">
            <Input />
          </Form.Item>
          <Form.Item name="inspectingQuantity" label="Inspecting Quantity">
            <InputNumber />
          </Form.Item>
          <Form.Item name="issuePercent" label="Issue Percent">
            <InputNumber />
          </Form.Item>
          <Form.Item name="canHarvest" label="Can Harvest">
            <Select>
              <Select.Option value={true}>Yes</Select.Option>
              <Select.Option value={false}>No</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="OnGoing">OnGoing</Select.Option>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Draft">Draft</Select.Option>
              <Select.Option value="Cancel">Cancel</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
