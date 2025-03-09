import { IYield } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IYield["size"];
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
