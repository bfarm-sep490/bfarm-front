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
  Tag,
  Typography,
  theme,
} from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { IYield } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { YieldDrawerShow } from "@/components/yield/drawer-show";
import { YieldTypeTag } from "../type";
import { YieldSizeTag } from "../size";
import { YieldAvailabilityTag } from "../availability";

export const YieldListTable: React.FC = () => {
  const { token } = theme.useToken();
  const { tableProps, filters } = useTable<IYield, HttpError>({
    resource: "yields",
    filters: {
      initial: [
        { field: "id", operator: "eq", value: "" },
        { field: "yield_name", operator: "contains", value: "" },
        { field: "type", operator: "contains", value: "" },
        { field: "is_available", operator: "in", value: [] },
        { field: "area", operator: "eq", value: "" },
      ],
    },
  });

  const [selectedYieldId, setSelectedYieldId] = useState<string | undefined>(
    undefined
  );

  return (
    <>
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="yields" />
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
          title="Yield Name"
          dataIndex="yield_name"
          key="yield_name"
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{ color: filtered ? token.colorPrimary : undefined }}
            />
          )}
          defaultFilteredValue={getDefaultFilter(
            "yield_name",
            filters,
            "contains"
          )}
          filterDropdown={(props) => <Input placeholder="Search yield name" />}
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
          title="Area"
          dataIndex="area"
          key="area"
          width={"auto"}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{ color: filtered ? token.colorPrimary : undefined }}
            />
          )}
          defaultFilteredValue={getDefaultFilter("area", filters, "eq")}
          filterDropdown={(props) => (
            <InputNumber placeholder="Search area" style={{ width: "100%" }} />
          )}
          render={(value, record) => `${value} ${record.area_unit}`}
        />

        <Table.Column
          title="Type"
          dataIndex="type"
          key="type"
          width={120}
          render={(value) => <YieldTypeTag value={value} />}
        />

        <Table.Column
          title="Size"
          dataIndex="size"
          key="type"
          width={120}
          render={(value) => <YieldSizeTag value={value} />}
        />
        <Table.Column
          title="Status"
          dataIndex="is_available"
          key="is_available"
          width={"auto"}
          render={(is_available: boolean) => (
            <Typography.Text>
              {is_available ? (
                <Tag color="green">Available</Tag>
              ) : (
                <Tag color="red">Unavailable</Tag>
              )}
            </Typography.Text>
          )}
        />
        {/* <Table.Column
          title="Status"
          dataIndex="is_available"
          key="is_available"
          width={120}
          render={(value) => <YieldAvailabilityTag value={value} />}
        /> */}

        <Table.Column
          title="Actions"
          key="actions"
          fixed="right"
          align="center"
          render={(_, record: IYield) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => setSelectedYieldId(record.id.toString())}
            />
          )}
        />
      </Table>

      {selectedYieldId && (
        <YieldDrawerShow
          id={selectedYieldId}
          onClose={() => setSelectedYieldId(undefined)}
        />
      )}
    </>
  );
};
