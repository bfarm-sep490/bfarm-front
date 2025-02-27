import React, { PropsWithChildren } from "react";
import { BaseRecord, useBack, useTranslate } from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  ImageField,
  TagField,
  EmailField,
  DateField,
  TextField,
} from "@refinedev/antd";
import { Table, Space, Radio, Button, Breadcrumb, Typography } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";

const getStatusTagColor = (value: string) => {
  switch (value) {
    case "Pending":
      return "orange";
    case "Completed":
      return "green";
    case "Cancelled":
      return "red";
    case "Ongoing":
      return "blue";
    default:
      return "default";
  }
};

const getStatusTagValue = (value: string) => {
  switch (value) {
    case "Pending":
      return "Đợi xác nhận";
    case "Completed":
      return "Hoàn thành";
    case "Cancelled":
      return "Hủy bỏ";
    case "Ongoing":
      return "Trong quá trình";

    default:
      return "Không xác định";
  }
};
type Props = {
  tableProps: any;
};
export const HarvestedTaskList = ({ children }: PropsWithChildren) => {
  const back = useBack();
  const navigate = useNavigate();
  const { id } = useParams();
  const resource = "harvesting-tasks";

  const translate = useTranslate();
  const { tableProps } = useTable({
    syncWithLocation: true,
    resource: resource,
  });

  return (
    <>
      <List>
        <Table {...tableProps} rowKey="id" scroll={{ x: "max-content" }}>
          <Table.Column dataIndex="id" title={translate("ID")} />
          <Table.Column dataIndex="task_name" title={translate("name")} />
          <Table.Column
            dataIndex="start_date"
            title={translate("start_date")}
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            dataIndex="end_date"
            title={translate("end_date")}
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            dataIndex="harvested_quantity"
            title={"harvested_quantity"}
          />
          <Table.Column dataIndex="harvested_unit" title={"unit"} />
          <Table.Column
            dataIndex="status"
            title={"status"}
            render={(value) => (
              <TagField
                value={getStatusTagValue(value)}
                color={getStatusTagColor(value)}
              />
            )}
          />
          <Table.Column title={translate("farmer_id")} dataIndex="farmer_id" />
          <Table.Column title={translate("plan_id")} dataIndex="plan_id" />
          <Table.Column
            title={translate("created_at")}
            dataIndex="created_at"
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            title={translate("updated_at")}
            dataIndex="updated_at"
            render={(value) => value ? <DateField format="DD/MM/YYYY" value={value} /> : <TextField value={"Chưa cập nhập lần nào"} />}
          />
          <Table.Column
            title={translate("updated_at")}
            dataIndex="updated_at"
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            title={translate("table.actions")}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <ShowButton
                  hideText
                  size="small"
                  onClick={() =>
                    navigate(`/plans/${id}/harvesting-tasks/${record.id}`)
                  }
                />
              </Space>
            )}
          />
        </Table>
      </List>

      {children}
    </>
  );
};
