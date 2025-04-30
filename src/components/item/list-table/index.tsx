import React, { useState } from "react";
import { useTable } from "@refinedev/antd";
import { type HttpError, getDefaultFilter, useTranslate } from "@refinedev/core";
import { Table, Avatar, Button, Input, InputNumber, Typography, theme } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "@/components/paginationTotal";
import { IItem } from "@/interfaces";
import { ItemDrawerShow } from "../drawer-show";
import { ItemStatusTag } from "../status";
import { ItemtypeTag } from "../type";

export const ItemsListTable: React.FC = () => {
  const { token } = theme.useToken();
  const { tableProps, filters } = useTable<IItem, HttpError>({
    resource: "items",
    filters: {
      initial: [
        { field: "id", operator: "eq", value: "" },
        { field: "name", operator: "contains", value: "" },
        { field: "status", operator: "in", value: [] },
      ],
    },
  });

  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();

  const t = useTranslate();

  return (
    <>
      <Table
        onRow={(record) => ({
          onClick: () => {
            if (record.id) {
              setSelectedItemId(record.id.toString());
            }
          },
        })}
        rowHoverable
        {...tableProps}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => <PaginationTotal total={total} entityName="items" />,
        }}
      >
        <Table.Column
          title={t("items.id")}
          dataIndex="id"
          key="id"
          width={80}
          filterIcon={(filtered) => (
            <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
          )}
          defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
          filterDropdown={(props) => (
            <InputNumber style={{ width: "100%" }} placeholder={t("items.searchId")} />
          )}
          render={(value) => <Typography.Text>{`#${value}`}</Typography.Text>}
        />

        <Table.Column
          title={t("items.image")}
          dataIndex="image"
          key="image"
          render={(image) => (
            <Avatar
              shape="square"
              src={image?.trim() ? image : "/images/default-image.png"}
              alt="Item"
            />
          )}
        />

        <Table.Column
          title={t("items.name")}
          dataIndex="name"
          key="name"
          filterIcon={(filtered) => (
            <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
          )}
          defaultFilteredValue={getDefaultFilter("name", filters, "contains")}
          filterDropdown={(props) => <Input placeholder={t("items.searchName")} />}
        />

        <Table.Column
          title={t("items.description")}
          dataIndex="description"
          key="description"
          width={300}
          render={(value) => (
            <Typography.Paragraph ellipsis={{ rows: 2, tooltip: true }} style={{ marginBottom: 0 }}>
              {value}
            </Typography.Paragraph>
          )}
        />

        <Table.Column
          title={t("items.quantity")}
          dataIndex="quantity"
          key="quantity"
          width={"auto"}
          filterIcon={(filtered) => (
            <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
          )}
          defaultFilteredValue={getDefaultFilter("quantity", filters, "eq")}
          filterDropdown={(props) => (
            <InputNumber placeholder={t("items.searchQuantity")} style={{ width: "100%" }} />
          )}
          render={(value, record) => `${value} ${record.unit}`}
        />

        <Table.Column
          title={t("items.type")}
          dataIndex="type"
          key="type"
          width={120}
          render={(value) => <ItemtypeTag value={value} />}
        />

        <Table.Column
          title={t("items.status")}
          dataIndex="status"
          key="status"
          width={120}
          render={(value) => <ItemStatusTag value={value} />}
        />
      </Table>
      {selectedItemId && (
        <ItemDrawerShow id={selectedItemId} onClose={() => setSelectedItemId(undefined)} />
      )}
    </>
  );
};
