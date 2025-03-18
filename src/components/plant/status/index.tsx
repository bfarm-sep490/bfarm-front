import { IPlant } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IPlant["status"];
}

export const PlantStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Available":
      return <Tag color="red">Available</Tag>;
    case "Maintenance":
      return <Tag color="green">Maintenance</Tag>;
    case "In-Use":
      return <Tag color="default">In-Use</Tag>;
    default:
      return null;
  }
};
