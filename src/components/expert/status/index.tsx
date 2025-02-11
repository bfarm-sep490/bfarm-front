import { ExpertStatus } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: ExpertStatus;
}

export const ExpertStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Actived":
      return <Tag color="green">Actived</Tag>;

    case "UnActived":
      return <Tag color="red">Unactived</Tag>;
    default:
      return null;
  }
};
