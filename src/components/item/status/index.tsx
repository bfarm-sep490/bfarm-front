import { IItem } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IItem["status"];
}

export const ItemStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "In-stock":
      return <Tag color="green">In Stock</Tag>;
    case "OutStock":
      return <Tag color="red">Out Stock</Tag>;
    case "Active":
      return <Tag color="default">Active</Tag>;
    default:
      return null;
  }
};
