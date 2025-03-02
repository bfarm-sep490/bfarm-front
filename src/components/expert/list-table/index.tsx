import {
  type HttpError,
  getDefaultFilter,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import {
  DateField,
  FilterDropdown,
  NumberField,
  getDefaultSortOrder,
  useTable,
} from "@refinedev/antd";

import { Avatar, Button, Input, InputNumber, Select, Table, Tag, Typography, theme } from "antd";

import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";
import { IExpert, IFertilizer } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { ExpertStatusTag } from "../status";

export const ExpertListTable: React.FC = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<IFertilizer, HttpError>({
    resource: "experts",
    filters: {
      initial: [
        {
          field: "id",
          operator: "eq",
          value: "",
        },
        {
          field: "name",
          operator: "contains",
          value: "",
        },
        {
          field: "phone",
          operator: "contains",
          value: "",
        },
        {
          field: "status",
          operator: "in",
          value: [],
        },
        {
          field: "email",
          operator: "contains",
          value: "",
        },
      ],
    },
  });

  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => <PaginationTotal total={total} entityName="experts" />,
      }}
    >
      <Table.Column
        title="ID"
        dataIndex="id"
        key="id"
        width={80}
        render={(value) => <Typography.Text>#{value}</Typography.Text>}
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <InputNumber addonBefore="#" style={{ width: "100%" }} placeholder="Search ID" />
          </FilterDropdown>
        )}
      />

      <Table.Column
        title="Avatar"
        dataIndex="avatar"
        key="avatar"
        render={(image: string) => <Avatar shape="square" src={image} alt="Expert" />}
      />

      <Table.Column
        title="Name"
        dataIndex="name"
        key="name"
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("name", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder="Search name" />
          </FilterDropdown>
        )}
      />

      <Table.Column
        title="Phone"
        dataIndex="phone"
        key="phone"
        width={300}
        render={(value) => (
          <Typography.Paragraph ellipsis={{ rows: 2, tooltip: true }} style={{ marginBottom: 0 }}>
            {value}
          </Typography.Paragraph>
        )}
      />
      <Table.Column
        title="DOB"
        dataIndex="DOB"
        key="DOB"
        width={300}
        render={(value) => <DateField value={value} format="DD/MM/YYYY" />}
      />

      <Table.Column
        title="Email"
        dataIndex="email"
        key="email"
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("email", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder="Search email" />
          </FilterDropdown>
        )}
      />

      <Table.Column
        title="Status"
        dataIndex="status"
        key="status"
        width={120}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: "200px" }}
              mode="multiple"
              placeholder="Filter by status"
              allowClear
            >
              <Select.Option value="Actived">Actived</Select.Option>
              <Select.Option value="UnActived">UnActived</Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(value) => <ExpertStatusTag value={value} />}
      />

      <Table.Column
        title="Actions"
        key="actions"
        fixed="right"
        align="center"
        render={(_, record: IExpert) => (
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              go({
                to: `${showUrl("experts", record.id)}`,
                query: {
                  to: pathname,
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
          />
        )}
      />
    </Table>
  );
};
