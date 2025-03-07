import { FertilizerStatus } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: FertilizerStatus;
}

export const FertilizerStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Available":
      return <Tag color="green"> Available</Tag>;
    case "Unavailable":
      return <Tag color="red">Unavailable</Tag>;
    default:
      return null;
  }
};
