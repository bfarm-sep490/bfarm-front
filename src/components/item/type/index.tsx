import { IItem } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IItem["type"];
}

export const ItemtypeTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Uncountable":
      return <Tag color="green">Uncountable</Tag>;
    case "Countable":
      return <Tag color="red">Countable</Tag>;
    default:
      return null;
  }
};
