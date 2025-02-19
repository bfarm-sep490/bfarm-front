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
          {task?.status !== "completed" && (
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
          <strong>#{task?.id}</strong> - {task?.name}
        </Typography.Title>

        <Divider />
        <Image.PreviewGroup items={task?.imageUrls || []}>
          <Image style={{ borderRadius: "10px" }} src={task?.imageUrls[0]} />
        </Image.PreviewGroup>
        <Typography.Title level={4}>Chi tiết vấn đề</Typography.Title>
        <List
          bordered
          dataSource={[
            {
              label: "Loại vấn đề",
              value: (
                <TagField
                  value={getTypeTagValue(task?.type)}
                  color={getTypeTagColor(task?.type)}
                />
              ),
            },
            {
              label: "Ngày phát hiện",
              value: <DateField value={task?.created_at} />,
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
        {task?.result ? (
          <Flex vertical gap={16}>
            <List
              bordered
              dataSource={[
                {
                  label: "Nội dung",
                  value: (
                    <Typography.Paragraph>{task?.result}</Typography.Paragraph>
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
