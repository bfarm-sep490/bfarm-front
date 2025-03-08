import { IFertilizer } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IFertilizer["type"];
}

export const FertilizerTypeTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Organic":
      return <Tag color="green">Organic</Tag>;
    case "Chemical":
      return <Tag color="orange">Chemical</Tag>;
    case "Mixed":
      return <Tag color="red">Mixed</Tag>;
    default:
      return null;
  }
};
