import { IPesticide } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IPesticide["type"];
}

export const PesticideTypeTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Organic":
      return <Tag color="green">Hữu cơ</Tag>;
    case "Chemical":
      return <Tag color="orange">Hóa học</Tag>;
    case "Mineral":
      return <Tag color="red">Trộn</Tag>;
    default:
      return null;
  }
};
