import { Tag } from "antd";
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

type StatusTagProps = {
  status: "Completed" | "Cancelled" | "Ongoing" | "Pending";
};

export const StatusTag = (props: StatusTagProps) => {
  return (
    <Tag color={getStatusTagColor(props?.status)}>
      {" "}
      {getStatusTagValue(props?.status)}
    </Tag>
  );
};
