import { IFertilizer } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IFertilizer["status"];
}

export const FertilizerStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Available":
      return <Tag color="green">Available</Tag>;
    case "Out of Stock":
      return <Tag color="red">Out of Stock</Tag>;
    case "Limited Stock":
      return <Tag color="gray">Limited Stock</Tag>;
    default:
      return null;
  }
};
