import { IItem } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IItem["type"];
}

export const ItemtypeTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Caring":
      return <Tag color="green">Caring</Tag>;
    case "Harvesting":
      return <Tag color="red">Harvesting</Tag>;
    case "Packaging":
      return <Tag color="yellow">Packaging</Tag>;
    default:
      return null;
  }
};
