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
      return "Không xác định";
  }
};

const getStatusTagColor = (value: string) => {
  switch (value) {
    case "pending":
      return "blue";
    case "completed":
      return "green";
    case "cancelled":
      return "red";
    case "inprogress":
      return "#003399";
    default:
      return "default";
  }
};

const getStatusTagValue = (value: string) => {
  switch (value) {
    case "pending":
      return "Đợi xác nhận";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Hủy bỏ";
    case "inprogress":
      return "Trong quá trình";
    case "notstart":
      return "Chưa bắt đầu";
    default:
      return "Không xác định";
  }
};

export const ProductiveTaskShow = () => {
  const { taskId } = useParams();
  const { query: queryResult } = useShow<any>({
    resource: "productive-tasks",
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
    setDataVattu(task ? task[mode + "s"] : []);
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
          {task?.status !== "completed" && (
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
          <strong>#{task?.id}</strong> - {task?.name}
        </Typography.Title>

        <Divider />
        <Typography.Title level={4}>Kết quả</Typography.Title>
        {task?.result_content ? (
          <Flex vertical gap={16}>
            {task.images?.length > 0 && (
              <Image.PreviewGroup items={task?.images || []}>
                <Image
                  loading="lazy"
                  style={{ borderRadius: "10px" }}
                  src={task?.images[0]}
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
          <Typography.Text type="secondary">Không có kết quả.</Typography.Text>
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
                  value={getTypeTagValue(task?.type)}
                  color={getTypeTagColor(task?.type)}
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
            { label: "ID Nông dân", value: task?.farmer_id },
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
