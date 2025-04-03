import React, { useState } from "react";
import { useTable } from "@refinedev/antd";
import { type HttpError, getDefaultFilter } from "@refinedev/core";
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

  return (
    <>
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => <PaginationTotal total={total} entityName="items" />,
        }}
      >
        <Table.Column
          title="ID"
          dataIndex="id"
          key="id"
          width={80}
          filterIcon={(filtered) => (
            <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
          )}
          defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
          filterDropdown={(props) => <InputNumber style={{ width: "100%" }} placeholder="Tìm ID" />}
        />

        <Table.Column
          title="Hình ảnh"
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
          title="Tên vật tư"
          dataIndex="name"
          key="name"
          filterIcon={(filtered) => (
            <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
          )}
          defaultFilteredValue={getDefaultFilter("name", filters, "contains")}
          filterDropdown={(props) => <Input placeholder="Search name" />}
        />

        <Table.Column
          title="Mô tả"
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
          title="Số lượng"
          dataIndex="quantity"
          key="quantity"
          width={"auto"}
          filterIcon={(filtered) => (
            <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
          )}
          defaultFilteredValue={getDefaultFilter("quantity", filters, "eq")}
          filterDropdown={(props) => (
            <InputNumber placeholder="Search total quantity" style={{ width: "100%" }} />
          )}
          render={(value, record) => `${value} ${record.unit}`}
        />

        <Table.Column
          title="Loại vật tư"
          dataIndex="type"
          key="type"
          width={120}
          render={(value) => <ItemtypeTag value={value} />}
        />

        <Table.Column
          title="Trạng thái"
          dataIndex="status"
          key="status"
          width={120}
          render={(value) => <ItemStatusTag value={value} />}
        />

        <Table.Column
          title="Actions"
          key="actions"
          fixed="right"
          align="center"
          render={(_, record: IItem) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => setSelectedItemId(record.id.toString())}
            />
          )}
        />
      </Table>

      {selectedItemId && (
        <ItemDrawerShow id={selectedItemId} onClose={() => setSelectedItemId(undefined)} />
      )}
    </>
  );
};
