import { InspectorAvailability } from "@/interfaces";
import { Status } from "@googlemaps/react-wrapper";
import { Tag } from "antd";


interface Props {
  value: InspectorAvailability;
}

export const InspectorAvailabilityTag: React.FC<Props> = ({ value }) => {
  switch (value) {
    case "Available":
      return <Tag color="green">In Stock</Tag>;
    case "Unavailable":
      return <Tag color="red">Out of Stock</Tag>;
  }
};