import { ExpertStatus } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: boolean;
}

export const ExpertStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case true:
      return <Tag color="green">Hoạt động</Tag>;

    case false:
      return <Tag color="red">Không hoạt động</Tag>;
    default:
      return null;
  }
};
