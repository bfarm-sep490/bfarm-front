import React from "react";
import { BaseRecord, useGo, useTranslate } from "@refinedev/core";
import {
  useTable,
  List,
  ShowButton,
  TagField,
  DateField,
  EditButton,
} from "@refinedev/antd";
import { Table, Space } from "antd";

export const PlanList = () => {
  const translate = useTranslate();
  const { tableProps } = useTable({
    syncWithLocation: true,
  });
  const go = useGo();

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={translate("plans.fields.id")} />
        <Table.Column dataIndex="name" title={translate("plans.fields.name")} />
        <Table.Column
          dataIndex={["seed", "name"]}
          title={translate("plans.fields.seed")}
        />
        <Table.Column
          dataIndex="land"
          title={translate("plans.fields.land")}
          render={(value) => <TagField value={value?.name} key={value?.name} />}
        />
        <Table.Column
          dataIndex={["start_date"]}
          title={translate("plans.fields.start_date")}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          dataIndex="status"
          title={translate("plans.fields.status")}
        />
        <Table.Column
          dataIndex="expert"
          title={translate("plans.fields.expert")}
          render={(value) => <TagField value={value?.name} key={value?.name} />}
        />
        <Table.Column
          dataIndex={["created_at"]}
          title={translate("plans.fields.created_at")}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          dataIndex={["updated_at"]}
          title={translate("plans.fields.updated_at")}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          title={translate("table.actions")}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
