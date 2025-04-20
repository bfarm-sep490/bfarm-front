import { IPesticide } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IPesticide["status"];
}

export const PesticideStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Limited Stock":
      return <Tag color="gray">Còn ít</Tag>;
    case "Out of Stock":
      return <Tag color="red">Hết hàng</Tag>;
    case "Available":
      return <Tag color="green">Hoạt động</Tag>;
    case "Unavailable":
      return <Tag color="red">Không hoạt động</Tag>;

    default:
      return null;
  }
};
