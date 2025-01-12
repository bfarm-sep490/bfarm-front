import { Avatar, Typography } from "antd";
import type { IFertilizer } from "../../../interfaces";

interface Props {
  fertilizer?: IFertilizer;
}

export const FertilizerInfoSummary = ({ fertilizer }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "32px",
        flexDirection: "column",
        padding: "16px",
      }}
    >
  
      <div style={{ textAlign: "center" }}>
        {/* Display ID */}
        <Typography.Text type="secondary">
          {fertilizer?.id ? `#${fertilizer.id}` : "No ID"}
        </Typography.Text>

        {/* Display name */}
        <Typography.Title
          level={3}
          style={{
            margin: 0,
          }}
        >
          {fertilizer?.name || "No Name"}
        </Typography.Title>

        {/* Display type, quantity, and unit */}
        <Typography.Text type="secondary">
          {fertilizer?.type
            ? `${fertilizer.type} - ${fertilizer.quantity || 0} ${
                fertilizer.unit || "units"
              }`
            : "No Type"}
        </Typography.Text>
      </div>
    </div>
  );
};
