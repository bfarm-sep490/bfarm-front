import { DateField, TagField, Title } from "@refinedev/antd";
import { useShow, useNavigation, useBack } from "@refinedev/core";
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
} from "antd";
import { useState } from "react";
import { useParams } from "react-router";

const getTypeTagColor = (value: string) => {
  switch (value) {
    case "Planting":
      return "green";
    case "Nurturing":
      return "#550000";
    case "Watering":
      return "blue";
    case "Fertilizing":
      return "orange";
    case "Pesticiding":
      return "yellow";
    default:
      return "default";
  }
};

const getTypeTagValue = (value: string) => {
  switch (value) {
    case "Planting":
      return "Gieo hạt";
    case "Nurturing":
      return "Chăm sóc";
    case "Watering":
      return "Tưới nước";
    case "Fertilizing":
      return "Bón phân";
    case "Setup":
      return "Lắp đặt";
    case "Pesticiding":
      return "Phun thuốc";
    default:
      return "Không xác định";
  }
};

const getStatusTagColor = (value: string) => {
  switch (value) {
    case "Pending":
      return "orange";
    case "Completed":
      return "green";
    case "Cancelled":
      return "red";
    case "Ongoing":
      return "blue";
    default:
      return "default";
  }
};

const getStatusTagValue = (value: string) => {
  switch (value) {
    case "Pending":
      return "Đợi xác nhận";
    case "Completed":
      return "Hoàn thành";
    case "Cancelled":
      return "Hủy bỏ";
    case "Ongoing":
      return "Trong quá trình";

    default:
      return "Không xác định";
  }
};

export const ProductiveTaskShow = () => {
  const { taskId } = useParams();
  const { query: queryResult } = useShow<any>({
    resource: "caring-tasks",
    id: taskId,
  });
  const [dataVattu, setDataVattu] = useState<any>([]);
  const [modeVattu, setModeVattu] = useState<
    "fertilizer" | "pesticide" | "item"
  >("fertilizer");
  const [open, setOpen] = useState(true);
  const back = useBack();
  const breakpoint = { sm: window.innerWidth > 576 };
  const { data } = queryResult;
  const task = data?.data;

  const handleModeChange = (mode: "fertilizer" | "pesticide" | "item") => {
    setModeVattu(mode);
    setDataVattu(task ? task["care_" + mode + "s"] : []);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Đơn vị", dataIndex: "unit", key: "unit" },
  ];

  return (
    <Drawer
      open={open}
      width={breakpoint.sm ? "736px" : "100%"}
      onClose={back}
      title={
        <>
          {task?.status !== "Completed" && (
            <Flex justify="end">
              <Space>
                <Button color="danger" variant="solid">
                  Hủy bỏ
                </Button>
                <Button color="primary" variant="solid">
                  Thay đổi
                </Button>
              </Space>
            </Flex>
          )}
        </>
      }
    >
      <Flex vertical gap={24} style={{ padding: "32px" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          <strong>#{task?.id}</strong> - {task?.task_name}
        </Typography.Title>

        <Divider />
        <Typography.Title level={4}>Kết quả</Typography.Title>
        {task?.status === "Completed" ? (
          <Flex vertical gap={16}>
            {task.images?.length > 0 && (
              <Image.PreviewGroup items={task?.images || []}>
                <Image
                  loading="lazy"
                  style={{ borderRadius: "10px" }}
                  src={task?.care_images?.[0]}
                />
              </Image.PreviewGroup>
            )}
            <List
              bordered
              dataSource={[
                {
                  label: "Ngày hoàn thành",
                  value: <DateField value={task?.completed_at} />,
                },
                {
                  label: "Nội dung",
                  value: (
                    <Typography.Paragraph>
                      {task?.result_content}
                    </Typography.Paragraph>
                  ),
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
        ) : (
          <Typography.Text type="secondary">Chưa có kết quả.</Typography.Text>
        )}

        <Divider />
        <Typography.Title level={4}>Chi tiết công việc</Typography.Title>
        <List
          bordered
          dataSource={[
            {
              label: "Loại công việc",
              value: (
                <TagField
                  value={getTypeTagValue(task?.task_type)}
                  color={getTypeTagColor(task?.task_type)}
                />
              ),
            },
            {
              label: "Ngày bắt đầu",
              value: <DateField value={task?.start_date} />,
            },
            {
              label: "Ngày kết thúc",
              value: <DateField value={task?.end_date} />,
            },
            {
              label: "Trạng thái",
              value: (
                <TagField
                  value={getStatusTagValue(task?.status)}
                  color={getStatusTagColor(task?.status)}
                />
              ),
            },
            { label: "Mức độ ưu tiên", value: task?.priority },
            { label: "Nông dân thực hiện", value: task?.farmer_id },
            { label: "Kế hoạch", value: task?.plan_id },
            {
              label: "Vấn đề liên quan",
              value: task?.problem_id || "Không liên hệ tới vấn đề nào",
            },
            {
              label: "Mô tả công việc",
              value: (
                <Typography.Paragraph>{task?.description}</Typography.Paragraph>
              ),
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
        <Typography.Title level={4}>
          Phân bón / Thuốc trừ sâu / Vật tư
        </Typography.Title>
        <Radio.Group
          value={modeVattu}
          onChange={(e) => handleModeChange(e.target.value)}
        >
          <Radio.Button value="fertilizer">Phân bón</Radio.Button>
          <Radio.Button value="pesticide">Thuốc trừ sâu</Radio.Button>
          <Radio.Button value="item">Vật tư</Radio.Button>
        </Radio.Group>
        <Table
          pagination={{ pageSize: 5 }}
          bordered
          columns={columns}
          dataSource={dataVattu}
        ></Table>
      </Flex>
    </Drawer>
  );
};
