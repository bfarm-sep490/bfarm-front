import { IPesticide } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IPesticide["status"];
}

export const PesticideStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "InStock":
      return <Tag color="green">In Stock</Tag>;
    case "OutStock":
      return <Tag color="red">Out of Stock</Tag>;
    case "UnActived":
      return <Tag color="gray">UnActived</Tag>;
    default:
      return null;
  }
};
