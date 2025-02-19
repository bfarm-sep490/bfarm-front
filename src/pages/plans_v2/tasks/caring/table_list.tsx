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
  Title,
} from "@refinedev/antd";
import { Table, Space, Radio, Button, Breadcrumb } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Typography } from "antd/lib";

type TypeProps = {
  type: "productive" | "harvesting" | "inspecting";
};

const getTypeTagColor = (value: string) => {
  switch (value) {
    case "planting":
      return "green";
    case "nurturing":
      return "#550000";
    case "watering":
      return "blue";
    case "fertilizing":
      return "orange";
    case "pestcontrol":
      return "yellow";
    default:
      return "default";
  }
};
const getTypeTagValue = (value: string) => {
  switch (value) {
    case "planting":
      return "Gieo hạt";
    case "nurturing":
      return "Chăm sóc";
    case "watering":
      return "Tưới nước";
    case "fertilizing":
      return "Bón phân";
    case "pestcontrol":
      return "Phun thuốc";
    default:
      return "default";
  }
};
const getStatusTagColor = (value: string) => {
  switch (value) {
    case "pending":
      return "blue";
    case "completed":
      return "green";
    case "cancelled":
      return "red";
    case "inprogress":
      return "#003399";

    default:
      return "default";
  }
};
const getStatusTagValue = (value: string) => {
  switch (value) {
    case "pending":
      return "Đợi xác nhận";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Hủy bỏ";
    case "inprogress":
      return "Trong quá trình";
    case "notstart":
      return "Chưa bắt đầu";
    default:
      return "default";
  }
};
type Props = {
  tableProps: any;
};
export const productive_table = () => {};
export const TaskList = ({ children, type }: PropsWithChildren & TypeProps) => {
  const back = useBack();
  const navigate = useNavigate();
  const { id } = useParams();
  const resource =
    type === "productive"
      ? "productive-tasks"
      : type === "harvesting"
      ? "harvesting-tasks"
      : "inspecting-tasks";

  const translate = useTranslate();
  const { tableProps } = useTable({
    syncWithLocation: true,
    resource: resource,
  });

  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <>
      <List>
        <Table {...tableProps} rowKey="id" scroll={{ x: "max-content" }}>
          <Table.Column dataIndex="id" title={translate("ID")} />
          <Table.Column dataIndex="name" title={translate("name")} />
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
            dataIndex="type"
            title={translate("type")}
            render={(value) => (
              <TagField
                value={getTypeTagValue(value)}
                color={getTypeTagColor(value)}
              />
            )}
          />
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
          <Table.Column dataIndex="land_id" title={translate("land_id")} />
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
                    navigate(`/plans/${id}/productive-tasks/${record.id}`)
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
