import React from "react";
import { TextField, useTable } from "@refinedev/antd";
import { type HttpError, getDefaultFilter, useTranslate } from "@refinedev/core";
import { Table, Avatar, Button, Input, InputNumber, theme, Tag } from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { PaginationTotal } from "@/components/paginationTotal";
import { RetailerStatusTag } from "../status";
import { useNavigate } from "react-router-dom"; // Add this import
import "../../plan/detail/dashboard-problems/index.css";

interface IRetailer {
  id: number;
  email: string;
  name: string;
  phone: string;
  avatar_image?: string;
  dob?: string;
  is_active: boolean;
}

export const RetailersListTable: React.FC = () => {
  const { token } = theme.useToken();
  const { tableProps, filters } = useTable<IRetailer, HttpError>({
    resource: "retailers",
    filters: {
      initial: [
        { field: "id", operator: "eq", value: "" },
        { field: "name", operator: "contains", value: "" },
      ],
    },
  });

  const t = useTranslate();
  const navigate = useNavigate(); // Hook to navigate programmatically

  return (
    <Table
      onRow={(record) => ({
        onClick: () => {
          if (record.id) {
            navigate(`/retailers/${record.id}`);
          }
        },
      })}
      rowHoverable
      {...tableProps}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => <PaginationTotal total={total} entityName="retailers" />,
      }}
    >
      <Table.Column
        title={t("retailers.id")}
        dataIndex="id"
        key="id"
        width={80}
        filterIcon={(filtered) => (
          <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
        )}
        defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
        filterDropdown={() => (
          <InputNumber style={{ width: "100%" }} placeholder={t("retailers.searchId")} />
        )}
        render={(value) => <TextField value={`#${value}`}></TextField>}
      />

      <Table.Column
        title={t("retailers.avatar")}
        dataIndex="avatar_image"
        key="avatar_image"
        render={(url) => <Avatar src={url?.trim() ? url : "/images/default-avatar.png"} />}
      />

      <Table.Column
        title={t("retailers.name")}
        dataIndex="name"
        key="name"
        filterIcon={(filtered) => (
          <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
        )}
        defaultFilteredValue={getDefaultFilter("name", filters, "contains")}
        filterDropdown={() => (
          <Input style={{ width: "100%" }} placeholder={t("retailers.searchName")} />
        )}
      />

      <Table.Column title={t("retailers.email")} dataIndex="email" key="email" />
      <Table.Column title={t("retailers.phone")} dataIndex="phone" key="phone" />
      <Table.Column title={t("retailers.dob")} dataIndex="dob" key="dob" />

      <Table.Column
        title={t("retailers.is_active")}
        dataIndex="is_active"
        key="is_active"
        render={(isActive: boolean) => (
          <Tag
            color={isActive ? "success" : "error"}
            style={{ fontSize: "14px", padding: "4px 12px" }}
          >
            {isActive ? t("retailers.active") : t("retailers.inactive")}
          </Tag>
        )}
      />
    </Table>
  );
};
