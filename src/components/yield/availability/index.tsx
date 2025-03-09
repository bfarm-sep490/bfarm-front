import { Tag } from "antd";

interface Props {
  value: "Available" | "Unavailable";
}

export const YieldAvailabilityTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Available":
      return <Tag color="green">Available</Tag>;
    case "Unavailable":
      return <Tag color="red">Unavailablek</Tag>;
  }
};
