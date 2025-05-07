import { useGo, useTranslate } from "@refinedev/core";
import { useTable, List, TagField, DateField, TextField } from "@refinedev/antd";
import { Table } from "antd";
import { StatusTag } from "../../components/caring-task/status-tag";
import "../../components/scheduler/index.css";
import { useNavigate } from "react-router";
export const PlanList = () => {
  const translate = useTranslate();
  const navigate = useNavigate();
  const { tableProps } = useTable({
    resource: "plans",
    syncWithLocation: true,
    queryOptions: {
      select: (data) => {
        const filteredData = data.data.filter((item: any) => item.status !== "Draft");
        return {
          ...data,
          data: filteredData,
          total: filteredData.length,
        };
      },
    },
  });
  const go = useGo();

  return (
    <List breadcrumb={false} title={translate("plans.plans")}>
      <Table
        onRow={(row) => ({
          onClick: () => {
            navigate(`/plans/${row.id}`);
          },
        })}
        rowHoverable
        {...tableProps}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={{
          ...tableProps.pagination,
          total: tableProps.dataSource?.length || 0,
        }}
      >
        <Table.Column
          dataIndex="id"
          title={translate("plans.fields.id", "ID")}
          render={(value, record) => {
            return <TextField value={`#${value}`} />;
          }}
        />
        <Table.Column dataIndex="plan_name" title={translate("plans.plan_name", "Tên kế hoạch")} />
        <Table.Column
          dataIndex={"plant_name"}
          title={translate("plans.plant_name", "Tên cây trồng")}
        />
        <Table.Column
          dataIndex="yield_name"
          title={translate("plans.yield_name", "Tên khu đất")}
          render={(value) => <TagField value={value} key={value} />}
        />
        <Table.Column
          dataIndex={["start_date"]}
          title={translate("plans.start_date", "Ngày bắt đầu")}
          render={(value: any) => <DateField value={value} format="DD/MM/YYYY" />}
        />
        <Table.Column
          dataIndex={["end_date"]}
          title={translate("plans.end_date", "Ngày kết thúc")}
          render={(value: any) => <DateField value={value} format="DD/MM/YYYY" />}
        />
        <Table.Column
          dataIndex="status"
          title={translate("plans.status", "Trạng thái")}
          render={(value: any) => <StatusTag status={value} />}
        />
        <Table.Column
          dataIndex="expert_name"
          title={translate("plans.expert_name", "Tên chuyên gia")}
          render={(value) => <TagField value={value} key={value} />}
        />
        <Table.Column
          dataIndex={["created_at"]}
          title={translate("plans.created_at", "Ngày tạo")}
          render={(value: any) => <DateField value={value} />}
        />
        <Table.Column
          dataIndex={["updated_at"]}
          title={translate("plans.updated_at", "Ngày cập nhập")}
          render={(value: any) => {
            return value ? <DateField value={value} /> : <TextField value="Chưa cập nhập" />;
          }}
        />
      </Table>
    </List>
  );
};
