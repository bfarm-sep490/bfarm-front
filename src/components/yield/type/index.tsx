import { IYield } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IYield["type"];
}

export const YieldTypeTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Đất xám":
      return <Tag color="green">Đất xám</Tag>;
    case "Đất cát":
      return <Tag color="orange">Đất cát</Tag>;
    case "Đất đỏ":
      return <Tag color="red">Đất đỏ</Tag>;
    case "Đất đen":
      return <Tag color="blue">Đất đen</Tag>;
    case "Đất phèn":
      return <Tag color="purple">Đất phèn</Tag>;
    case "Đất chua":
      return <Tag color="grey">Đất chua</Tag>;
    case "Đất hữu cơ":
      return <Tag color="grey">Đất hữu cơ</Tag>;
    default:
      return null;
  }
};
