import { PesticideStatus } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: PesticideStatus;
}

export const PesticideStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Available":
      return <Tag color="green">Available</Tag>;
    case "UnAvailable":
      return <Tag color="red">UnAvailable</Tag>;
    default:
      return null;
  }
};
