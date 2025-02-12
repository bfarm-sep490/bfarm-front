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
  TextField,
  getDefaultSortOrder,
  useTable,
} from "@refinedev/antd";

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
import { useLocation } from "react-router";
import { IProductiveTask } from "../../../../../interfaces";
import { PaginationTotal } from "../../../../paginationTotal";
import { InspectingTaskDrawerShow } from "../drawer-show";
import { useState } from "react";

export const InspectingTaskListTable: React.FC = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<IProductiveTask, HttpError>(
    {
      resource: "productions",
      filters: {
        initial: [
          {
            field: "id",
            operator: "eq",
            value: undefined,
          },
          {
            field: "task_name",
            operator: "contains",
            value: undefined,
          },
          {
            field: "land_id",
            operator: "contains",
            value: undefined,
          },
          {
            field: "start_date",
            operator: "eq",
            value: undefined,
          },
          {
            field: "end_date",
            operator: "eq",
            value: undefined,
          },
          {
            field: "is_completed",
            operator: "eq",
            value: undefined,
          },
          {
            field: "is_available",
            operator: "eq",
            value: undefined,
          },
        ],
      },
    }
  );

  // State for Drawer Visibility
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  return (
    <>
      <Table
        style={{ width: "100%", height: "100%" }}
        {...tableProps}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="productions" />
          ),
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
              <InputNumber
                addonBefore="#"
                style={{ width: "100%" }}
                placeholder="Search ID"
              />
            </FilterDropdown>
          )}
        />

        <Table.Column
          title="Task name"
          dataIndex="task_name"
          key="task_name"
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
            />
          )}
          defaultFilteredValue={getDefaultFilter(
            "task_name",
            filters,
            "contains"
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search name" />
            </FilterDropdown>
          )}
        />

        <Table.Column
          title="Start Date"
          dataIndex="start_date"
          key="start_date"
          width={300}
          render={(value) => <DateField value={value} format="DD/MM/YYYY" />}
        />
        <Table.Column
          title="End Date"
          dataIndex="end_date"
          key="end_date"
          width={300}
          render={(value) => <DateField value={value} format="DD/MM/YYYY" />}
        />
        <Table.Column
          title="Task type"
          dataIndex="task_type"
          key="task_type"
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
            />
          )}
          render={(value) => <TextField value={value} />}
        />
        <Table.Column
          title="Is Completed"
          dataIndex="is_completed"
          key="is_completed"
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
            />
          )}
          render={(value) => (
            <Tag color={value ? "green" : "red"}>
              {value ? "Completed" : "Pending"}
            </Tag>
          )}
        />

        <Table.Column
          title="Is Available"
          dataIndex="is_available"
          key="is_available"
          width={120}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{
                color: filtered ? token.colorPrimary : undefined,
              }}
            />
          )}
          render={(value) => (
            <Tag color={value ? "blue" : "gray"}>
              {value ? "Available" : "Not Available"}
            </Tag>
          )}
        />

        <Table.Column
          title="Actions"
          key="actions"
          fixed="right"
          align="center"
          render={(_, record: IProductiveTask) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => setSelectedTaskId(record.id)}
            />
          )}
        />
      </Table>

      {selectedTaskId !== null && (
        <InspectingTaskDrawerShow
          productive_task_id={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </>
  );
};
