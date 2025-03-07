import { ItemStatus, ItemType, PesticideType } from "@/interfaces";
import { Status } from "@googlemaps/react-wrapper";
import { Tag } from "antd";

interface Props {
  value: PesticideType;
}

export const PesticideTypeTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Trừ sâu":
      return <Tag color="green">Trừ sâu</Tag>;
    case "Trừ nấm":
      return <Tag color="orange">Trừ nấm</Tag>;
    case "Diệt cỏ":
      return <Tag color="red">Diệt cỏ</Tag>;
    case "Trừ rầy":
      return <Tag color="blue">Trừ rầy</Tag>;
    case "Trừ bọ xít":
      return <Tag color="purple">Trừ bọ xít</Tag>;
    default:
      return null;
  }
};
