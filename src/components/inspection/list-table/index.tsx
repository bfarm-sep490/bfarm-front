import React, { useState } from "react";
import { useTable } from "@refinedev/antd";
import { getDefaultFilter, type HttpError } from "@refinedev/core";
import { Table, Avatar, Button, Input, InputNumber, Typography, Space, theme } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "@/components/paginationTotal";
import { IInspectingForm } from "@/interfaces";
import { InspectionDrawerShow } from "../drawer-show";

export const InspectionListTable: React.FC = () => {
  const { token } = theme.useToken();

  const { tableProps, filters } = useTable<IInspectingForm, HttpError>({
    resource: "inspecting-forms",
    filters: {
      initial: [
        { field: "id", operator: "eq", value: "" },
        { field: "task_type", operator: "contains", value: "" },
      ],
    },
  });

  const [selectedInspectionId, setSelectedInspectionId] = useState<string | undefined>();

  return (
    <>
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => <PaginationTotal total={total} entityName="inspections" />,
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
          filterDropdown={(props) => (
            <InputNumber style={{ width: "100%" }} placeholder="Search ID" />
          )}
        />

        <Table.Column title="Plant Name" dataIndex="plan_name" key="plan_name" />

        <Table.Column
          title="Task Type"
          dataIndex="task_type"
          key="task_type"
          filterIcon={(filtered) => (
            <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
          )}
          defaultFilteredValue={getDefaultFilter("task_type", filters, "contains")}
          filterDropdown={(props) => <Input placeholder="Search Task Type" />}
        />

        <Table.Column title="Inspector ID" dataIndex="inspector_id" key="inspector_id" />

        <Table.Column title="Start Date" dataIndex="start_date" key="start_date" />

        <Table.Column
          title="Actions"
          key="actions"
          fixed="right"
          align="center"
          render={(_, record: IInspectingForm) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => setSelectedInspectionId(record.id.toString())}
            />
          )}
        />
      </Table>

      {selectedInspectionId && (
        <InspectionDrawerShow
          id={selectedInspectionId}
          onClose={() => setSelectedInspectionId(undefined)}
        />
      )}
    </>
  );
};
