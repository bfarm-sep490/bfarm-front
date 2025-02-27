import { ExpertStatus } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: ExpertStatus;
}

export const ExpertStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Active":
      return <Tag color="green">Hoạt động</Tag>;

    case "Inactive":
      return <Tag color="red">Không hoạt động</Tag>;
    default:
      return null;
  }
};
