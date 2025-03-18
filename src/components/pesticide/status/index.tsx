import { IPesticide } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IPesticide["status"];
}

export const PesticideStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Limited Stock":
      return <Tag color="green">Limited Stock</Tag>;
    case "Out of Stock":
      return <Tag color="red">Out of Stock</Tag>;
    case "Available":
      return <Tag color="gray">Available</Tag>;
    default:
      return null;
  }
};
