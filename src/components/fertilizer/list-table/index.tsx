import {
  type HttpError,
  getDefaultFilter,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import { FilterDropdown, NumberField, getDefaultSortOrder, useTable } from "@refinedev/antd";

import { Avatar, Button, Input, InputNumber, Select, Table, Tag, Typography, theme } from "antd";

import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { IFertilizer } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { FertilizerDrawerShow } from "@/components/fertilizer/drawer-show";
import { FertilizerTypeTag } from "../type";
import { FertilizerStatusTag } from "../status";
export const FertilizersListTable: React.FC = () => {
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<IFertilizer, HttpError>({
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
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => <PaginationTotal total={total} entityName="fertilizers" />,
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
        title="Image"
        dataIndex="image"
        key="image"
        render={(image: string) => <Avatar shape="square" src={image} alt="Fertilizer" />}
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
        title="Description"
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
        title="Available Quantity"
        dataIndex="available_quantity"
        key="available_quantity"
        align="right"
        sorter
        defaultSortOrder={getDefaultSortOrder("available_quantity", sorters)}
        render={(value: number) => (
          <NumberField
            value={value}
            options={{
              maximumFractionDigits: 2,
            }}
          />
        )}
      />

      <Table.Column
        title="Total Quantity"
        dataIndex="total_quantity"
        key="total_quantity"
        align="right"
        sorter
        defaultSortOrder={getDefaultSortOrder("total_quantity", sorters)}
        render={(value: number) => (
          <NumberField
            value={value}
            options={{
              maximumFractionDigits: 2,
            }}
          />
        )}
      />

      <Table.Column title="Unit" dataIndex="unit" key="unit" width={100} />

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
              {value}
            </Typography.Paragraph>
          )}
        />

      <Table.Column
        title="Type"
        dataIndex="type"
        key="type"
        width={120}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: "200px" }}
              mode="multiple"
              placeholder="Filter by type"
              allowClear
            >
              <Select.Option value="Organic">Organic</Select.Option>
              <Select.Option value="Chemical">Chemical</Select.Option>
              <Select.Option value="Mixed">Mixed</Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(value) => (
          <Tag color={value === "Organic" ? "green" : value === "Chemical" ? "red" : "blue"}>
            {value}
          </Tag>
        )}
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
