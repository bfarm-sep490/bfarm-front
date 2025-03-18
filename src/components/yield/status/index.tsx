import { IYield } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IYield["status"];
}

export const YieldStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Available":
      return <Tag color="green">Available</Tag>;
    case "Maintenance":
      return <Tag color="red">Maintenance</Tag>;
    case "In-Use":
      return <Tag color="gray">In-Use</Tag>;
    default:
      return null;
  }
};
