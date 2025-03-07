import { ItemStatus } from "@/interfaces";
import { Status } from "@googlemaps/react-wrapper";
import { Tag } from "antd";

interface Props {
  value: ItemStatus;
}

export const ItemStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "In-stock":
      return <Tag color="green">In Stock</Tag>;
    case "Out-stock":
      return <Tag color="red">Out Stock</Tag>;
    case "Active":
      return <Tag color="default">Active</Tag>;
    default:
      return null;
  }
};
