import { IFertilizer } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IFertilizer["status"];
}

export const FertilizerStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Available":
      return <Tag color="green">Hoạt động</Tag>;
    case "Out of Stock":
      return <Tag color="red">Hết hàng</Tag>;
    case "Limited Stock":
      return <Tag color="gray">Còn ít</Tag>;
    case "Unavailable":
      return <Tag color="red">Không hoạt động</Tag>;
    default:
      return null;
  }
};
