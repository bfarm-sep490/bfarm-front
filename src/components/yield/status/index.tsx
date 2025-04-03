import { IYield } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IYield["status"];
}

export const YieldStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Available":
      return <Tag color="green">Hoạt động</Tag>;
    case "Unavailable":
      return <Tag color="red">Không hoạt động</Tag>;
    case "In-Use":
      return <Tag color="blue">Đang sử dụng</Tag>;
    default:
      return null;
  }
};
