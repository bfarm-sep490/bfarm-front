import { YieldSize } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: YieldSize;
}

export const YieldSizeTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Nhỏ":
      return <Tag color="green">Nhỏ</Tag>;
    case "Vừa":
      return <Tag color="orange">Vừa</Tag>;
    case "Lớn":
      return <Tag color="red">Lớn</Tag>;
    default:
      return null;
  }
};
