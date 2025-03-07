import { FertilizerType } from "@/interfaces";
import { Status } from "@googlemaps/react-wrapper";
import { Tag } from "antd";

interface Props {
  value: FertilizerType;
}

export const FertilizerTypeTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Đạm":
      return <Tag color="green">Đạm</Tag>;
    case "Kali":
      return <Tag color="orange">Kali</Tag>;
    case "Lân":
      return <Tag color="red">Lân</Tag>;
    case "Hữu cơ":
      return <Tag color="blue">Hữu cơ</Tag>;
    case "Vi sinh":
      return <Tag color="purple">Vi sinh</Tag>;
    default:
      return null;
  }
};
