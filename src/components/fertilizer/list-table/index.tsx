import React, { useState } from "react";
import { type HttpError, getDefaultFilter } from "@refinedev/core";
import { useTable } from "@refinedev/antd";
import {
  Avatar,
  Button,
  Input,
  InputNumber,
  Select,
  Table,
  Typography,
  theme,
} from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { IFertilizer } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { FertilizerDrawerShow } from "@/components/fertilizer/drawer-show";
import { FertilizerTypeTag } from "../type";
import { FertilizerStatusTag } from "../status";
export const FertilizersListTable: React.FC = () => {
  const { token } = theme.useToken();
  const { tableProps, filters } = useTable<IFertilizer, HttpError>({
    resource: "fertilizers",
    filters: {
      initial: [
        { field: "id", operator: "eq", value: "" },
        { field: "name", operator: "contains", value: "" },
        { field: "type", operator: "contains", value: "" },
        { field: "status", operator: "in", value: [] },
        { field: "available_quantity", operator: "eq", value: "" },
      ],
    },
  });

  const [selectedFertilizerId, setSelectedFertilizerId] = useState<
    string | undefined
  >(undefined);

  return (
    <>
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="fertilizers" />
          ),
        }}
      >
        <Table.Column
          title="ID"
          dataIndex="id"
          key="id"
          width={80}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{ color: filtered ? token.colorPrimary : undefined }}
            />
          )}
          defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
          filterDropdown={(props) => (
            <InputNumber
              addonBefore="#"
              style={{ width: "100%" }}
              placeholder="Search ID"
            />
          )}
          render={(value) => (
            <Typography.Text style={{ fontWeight: "bold" }}>
              #{value}
            </Typography.Text>
          )}
        />

        <Table.Column
          width={"auto"}
          title="Image"
          dataIndex="image"
          key="image"
          render={(image: string) => (
            <Avatar shape="square" src={image} alt="Fertilizer" />
          )}
        />

        <Table.Column
          title="Name"
          width={"auto"}
          dataIndex="name"
          key="name"
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{ color: filtered ? token.colorPrimary : undefined }}
            />
          )}
          defaultFilteredValue={getDefaultFilter("name", filters, "contains")}
          filterDropdown={(props) => <Input placeholder="Search name" />}
        />

        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
          width={300}
          render={(value) => (
            <Typography.Paragraph
              ellipsis={{ rows: 2, tooltip: true }}
              style={{ marginBottom: 0 }}
            >
              {value}
            </Typography.Paragraph>
          )}
        />

        <Table.Column
          title="Available Quantity"
          dataIndex="available_quantity"
          key="available_quantity"
          width={"auto"}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{ color: filtered ? token.colorPrimary : undefined }}
            />
          )}
          defaultFilteredValue={getDefaultFilter(
            "available_quantity",
            filters,
            "eq"
          )}
          filterDropdown={(props) => (
            <InputNumber
              placeholder="Search available quantity"
              style={{ width: "100%" }}
            />
          )}
          render={(value, record) => `${value} ${record.unit}`}
        />

        <Table.Column
          title="Total Quantity"
          dataIndex="total_quantity"
          key="total_quantity"
          width={"auto"}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{ color: filtered ? token.colorPrimary : undefined }}
            />
          )}
          defaultFilteredValue={getDefaultFilter(
            "total_quantity",
            filters,
            "eq"
          )}
          filterDropdown={(props) => (
            <InputNumber
              placeholder="Search total quantity"
              style={{ width: "100%" }}
            />
          )}
          render={(value, record) => `${value} ${record.unit}`}
        />

        <Table.Column
          title="Type"
          dataIndex="type"
          key="type"
          width={120}
          render={(value) => <FertilizerTypeTag value={value} />}
        />

        <Table.Column
          title="Status"
          dataIndex="status"
          key="status"
          width={120}
          render={(value) => <FertilizerStatusTag value={value} />}
        />

        <Table.Column
          title="Actions"
          key="actions"
          fixed="right"
          align="center"
          render={(_, record: IFertilizer) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => setSelectedFertilizerId(record.id.toString())}
            />
          )}
        />
      </Table>

      {selectedFertilizerId && (
        <FertilizerDrawerShow
          id={selectedFertilizerId}
          onClose={() => setSelectedFertilizerId(undefined)}
        />
      )}
    </>
  );
};
