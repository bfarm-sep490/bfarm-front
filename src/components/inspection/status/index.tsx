import { IInspectingForm } from "@/interfaces";
import { Status } from "@googlemaps/react-wrapper";
import { Tag } from "antd";

interface InspectorAvailabilityTagProps {
  value: string;
}

export const InspectorAvailabilityTag: React.FC<InspectorAvailabilityTagProps> = ({ value }) => {
  switch (value) {
    case "Available":
      return <Tag color="green">In Stock</Tag>;
    case "Unavailable":
      return <Tag color="red">Out of Stock</Tag>;
  }
};
