import { IItem } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IItem["type"];
}

export const ItemtypeTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Caring":
      return <Tag color="green">Chăm sóc</Tag>;
    case "Harvesting":
      return <Tag color="red">Thu hoạch</Tag>;
    case "Packaging":
      return <Tag color="yellow">Đóng gói</Tag>;
    default:
      return null;
  }
};
