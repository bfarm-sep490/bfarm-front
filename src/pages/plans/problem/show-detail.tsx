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
    case "Weather":
      return "green";
    case "Fungus":
      return "#CC33FF";
    case "Nutrients":
      return "#550000";
    case "Light":
      return "yellow";
    case "Water":
      return "blue";
    case "fertilizing":
      return "orange";
    case "Pest":
      return "yellow";
    default:
      return "default";
  }
};

const getTypeTagValue = (value: string) => {
  switch (value) {
    case "Weather":
      return "Thời tiết";
    case "Nutrients":
      return "Dinh dưỡng";
    case "Fungus":
      return "Nấm mốc";
    case "Light":
      return "Ánh sáng";
    case "Water":
      return "Thiếu nước";
    case "Fertilizing":
      return "Bón phân";
    case "Pest":
      return "Sâu bệnh";
    default:
      return "Không xác định";
  }
};

const getStatusTagColor = (value: string) => {
  switch (value) {
    case "Pending":
      return "blue";
    case "Resolved":
      return "green";
    case "Cancelled":
      return "red";

    default:
      return "default";
  }
};

const getStatusTagValue = (value: string) => {
  switch (value) {
    case "Pending":
      return "Đợi xác nhận";
    case "Resolved":
      return "Hoàn thành";
    case "Cancelled":
      return "Hủy bỏ";

    default:
      return "Không xác định";
  }
};

export const ProblemShow = () => {
  const { problemId } = useParams();
  const { query: queryResult } = useShow<any>({
    resource: "problems",
    id: problemId,
  });

  const [open, setOpen] = useState(true);
  const back = useBack();
  const breakpoint = { sm: window.innerWidth > 576 };
  const { data } = queryResult;
  const task = data?.data;

  return (
    <Drawer
      open={open}
      width={breakpoint.sm ? "736px" : "100%"}
      onClose={back}
      title={
        <>
          {task?.status === "Pending" && (
            <Flex justify="end">
              <Space>
                <Button color="danger" variant="solid">
                  Hủy bỏ
                </Button>
                <Button color="primary" variant="solid">
                  Đồng ý
                </Button>
              </Space>
            </Flex>
          )}
        </>
      }
    >
      <Flex vertical gap={24} style={{ padding: "32px" }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          <strong>#{task?.id}</strong> - {task?.problem_name}
        </Typography.Title>

        <Divider />
        <Image.PreviewGroup items={task?.problem_images || []}>
          <Image
            loading="lazy"
            style={{ borderRadius: "10px" }}
            src={task?.problem_images?.[0]}
          />
        </Image.PreviewGroup>
        <Typography.Title level={4}>Chi tiết vấn đề</Typography.Title>
        <List
          bordered
          dataSource={[
            {
              label: "Loại vấn đề",
              value: (
                <TagField
                  value={getTypeTagValue(task?.problem_type)}
                  color={getTypeTagColor(task?.problem_type)}
                />
              ),
            },
            {
              label: "Ngày phát hiện",
              value: <DateField value={task?.date} />,
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
            {
              label: "Mô tả vấn đề",
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
        <Typography.Title level={4}>Kết quả</Typography.Title>
        {task?.result_content && task?.status === "Resolved" ? (
          <Flex vertical gap={16}>
            <List
              bordered
              dataSource={[
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
      </Flex>
    </Drawer>
  );
};
