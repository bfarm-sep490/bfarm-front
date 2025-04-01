import { IPlant } from "@/interfaces";
import { Tag } from "antd";

interface Props {
  value: IPlant["status"];
}

export const PlantStatusTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Active":
      return <Tag color="green">Hoạt động</Tag>;
    case "Inactive":
      return <Tag color="red">Không hoạt động</Tag>;

      return null;
  }
};
