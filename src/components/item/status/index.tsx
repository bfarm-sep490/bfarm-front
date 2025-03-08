import { IItem } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IItem["status"];
}

export const ItemStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "InStock":
      return <Tag color="green">In Stock</Tag>;
    case "OutStock":
      return <Tag color="red">Out Stock</Tag>;
    case "UnActived":
      return <Tag color="default">UnActived</Tag>;
    default:
      return null;
  }
};
