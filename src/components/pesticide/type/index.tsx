import { IPesticide } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IPesticide["type"];
}

export const PesticideTypeTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Organic":
      return <Tag color="green">Organic</Tag>;
    case "Chemical":
      return <Tag color="orange">Chemical</Tag>;
    case "Mineral":
      return <Tag color="red">Mineral</Tag>;
    default:
      return null;
  }
};
