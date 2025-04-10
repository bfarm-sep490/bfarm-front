import { Tag } from "antd";

export type StatusType =
  | "PendingConfirmation"
  | "Cancel"
  | "Pending"
  | "Reject"
  | "Deposit"
  | "Paid"
  | "Forfeit";

const getStatusTagColor = (value: StatusType): string => {
  switch (value) {
    case "PendingConfirmation":
    case "Pending":
      return "orange";
    case "Cancel":
    case "Reject":
    case "Forfeit":
      return "red";
    case "Deposit":
      return "cyan";
    case "Paid":
      return "green";
    default:
      return "default";
  }
};

const getStatusTagValue = (value: StatusType): string => {
  switch (value) {
    case "PendingConfirmation":
      return "Chờ xác nhận";
    case "Cancel":
      return "Hủy bỏ";
    case "Pending":
      return "Đang chờ cọc";
    case "Reject":
      return "Từ chối";
    case "Deposit":
      return "Đã đặt cọc";
    case "Paid":
      return "Đã thanh toán";
    case "Forfeit":
      return "Mất tiền cọc";
    default:
      return "Không xác định";
  }
};

type StatusTagProps = {
  status: StatusType;
  className?: string;
};

export const OrderStatusTag: React.FC<StatusTagProps> = ({ status, className }) => {
  return (
    <Tag color={getStatusTagColor(status)} className={className}>
      {getStatusTagValue(status)}
    </Tag>
  );
};

export const getAllStatuses = (): StatusType[] => {
  return ["PendingConfirmation", "Cancel", "Pending", "Reject", "Deposit", "Paid", "Forfeit"];
};
