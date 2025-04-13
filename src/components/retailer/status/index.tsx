// components/retailers/RetailerStatusTag.tsx
import React from "react";
import { Tag } from "antd";

type RetailerStatusTagProps = {
  isActive: boolean;
};

export const RetailerStatusTag: React.FC<RetailerStatusTagProps> = ({ isActive }) => {
  return <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>;
};
