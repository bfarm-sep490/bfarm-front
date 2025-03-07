import { FertilizerType, YieldType } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: YieldType;
}

export const YieldTypeTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Lúa":
      return <Tag color="green">Lúa</Tag>;
    case "Rau":
      return <Tag color="orange">Rau</Tag>;
    case "Tổng hợp":
      return <Tag color="red">Tổng hợp</Tag>;
    case "Trái cây":
      return <Tag color="blue">Trái cây</Tag>;
    case "Ngô":
      return <Tag color="purple">Ngô</Tag>;
    case "Khác":
      return <Tag color="grey">Khác</Tag>;
    default:
      return null;
  }
};
