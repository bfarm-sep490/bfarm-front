import { FarmerStatus } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: FarmerStatus;
}

export const FarmerStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Active":
      return <Tag color="green">Hoạt động</Tag>;

    case "Inactive":
      return <Tag color="red">Không hoạt động</Tag>;
    default:
      return null;
  }
};
