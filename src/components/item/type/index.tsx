import { ItemStatus, ItemType } from "@/interfaces";
import { Status } from "@googlemaps/react-wrapper";
import { Tag } from "antd";

interface Props {
  value: ItemType;
}

export const ItemtypeTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Caring":
      return <Tag color="green">Caring</Tag>;
    case "Harvesting":
      return <Tag color="red">Harvesting</Tag>;
    case "Packaging":
      return <Tag color="default">Packaging</Tag>;
    default:
      return null;
  }
};
