import { IFertilizer } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IFertilizer["status"];
}

export const FertilizerStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "InStock":
      return <Tag color="green">In Stock</Tag>;
    case "OutStock":
      return <Tag color="red">Out of Stock</Tag>;
    case "UnActived":
      return <Tag color="gray">Unactivated</Tag>;
    default:
      return null;
  }
};
