import React, { useState } from "react";
import { type HttpError, getDefaultFilter } from "@refinedev/core";
import { useTable } from "@refinedev/antd";
import {
  Avatar,
  Button,
  Input,
  InputNumber,
  Table,
  Typography,
  theme,
} from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { IPesticide } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { PesticideDrawerShow } from "@/components/pesticide/drawer-show";
import { PesticideStatusTag } from "../status";
import { PesticideTypeTag } from "../type";

export const PesticidesListTable: React.FC = () => {
  const { token } = theme.useToken();
  const { tableProps, filters } = useTable<IPesticide, HttpError>({
    resource: "pesticides",
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

  const [selectedPesticideId, setSelectedPesticideId] = useState<
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
            <PaginationTotal total={total} entityName="pesticides" />
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
          title="Ảnh"
          dataIndex="image"
          key="image"
          render={(image: string) => (
            <Avatar shape="square" src={image} alt="Pesticide" />
          )}
        />

        <Table.Column
          title="Tên thuốc"
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
          title="Mô tảtả"
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
          title="Số lượng"
          dataIndex="quantity"
          key="quantity"
          width={"auto"}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{ color: filtered ? token.colorPrimary : undefined }}
            />
          )}
          defaultFilteredValue={getDefaultFilter("quantity", filters, "eq")}
          filterDropdown={(props) => (
            <InputNumber
              placeholder="Search total quantity"
              style={{ width: "100%" }}
            />
          )}
          render={(value, record) => `${value} ${record.unit}`}
        />

        <Table.Column
          title="Loại thuốc"
          dataIndex="type"
          key="type"
          width={120}
          render={(value) => <PesticideTypeTag value={value} />}
        />

        <Table.Column
          title="Trạng thái"
          dataIndex="status"
          key="status"
          width={120}
          render={(value) => <PesticideStatusTag value={value} />}
        />

        <Table.Column
          title="Hành động"
          key="actions"
          fixed="right"
          align="center"
          render={(_, record: IPesticide) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => setSelectedPesticideId(record.id.toString())}
            />
          )}
        />
      </Table>

      {selectedPesticideId && (
        <PesticideDrawerShow
          id={selectedPesticideId}
          onClose={() => setSelectedPesticideId(undefined)}
        />
      )}
    </>
  );
};
