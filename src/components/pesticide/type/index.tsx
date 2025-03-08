import { IPesticide } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IPesticide["type"];
}

export const PesticideTypeTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Insecticide":
      return <Tag color="green">Trừ sâu</Tag>;
    case "Fungicide":
      return <Tag color="orange">Trừ nấm</Tag>;
    case "Herbicide":
      return <Tag color="red">Diệt cỏ</Tag>;
    case "Other":
      return <Tag color="blue">Trừ rầy</Tag>;
    default:
      return null;
  }
};
