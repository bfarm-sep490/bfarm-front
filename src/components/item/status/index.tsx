import { IItem } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IItem["status"];
}

export const ItemStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "In-stock":
      return <Tag color="green">Còn hàng</Tag>;
    case "OutStock":
      return <Tag color="red">Hết hàng</Tag>;
    case "Active":
      return <Tag color="green">Hoạt động</Tag>;
    case "Inactive":
      return <Tag color="red">Không hoạt động</Tag>;
    default:
      return null;
  }
};
