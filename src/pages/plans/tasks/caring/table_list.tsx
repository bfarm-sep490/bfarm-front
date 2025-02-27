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
  TextField,
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
    case "Planting":
      return "green";
    case "Nurturing":
      return "#550000";
    case "Watering":
      return "blue";
    case "Fertilizing":
      return "orange";

    case "Pesticiding":
      return "yellow";
    default:
      return "default";
  }
};

const getTypeTagValue = (value: string) => {
  switch (value) {
    case "Planting":
      return "Gieo hạt";
    case "Nurturing":
      return "Chăm sóc";
    case "Watering":
      return "Tưới nước";
    case "Fertilizing":
      return "Bón phân";
    case "Setup":
      return "Lắp đặt";
    case "Pesticiding":
      return "Phun thuốc";
    default:
      return "Không xác định";
  }
};

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
    resource: "caring-tasks",
  });

  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

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
            dataIndex="task_type"
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
          <Table.Column title={translate("farmer_id")} dataIndex="farmer_id" />
          <Table.Column title={translate("plan_id")} dataIndex="plan_id" />
          <Table.Column
            title={translate("create_at")}
            dataIndex="create_at"
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            title={translate("update_at")}
            dataIndex="update_at"
            render={(value) =>
              value ? (
                <DateField format="DD/MM/YYYY" value={value} />
              ) : (
                <TextField value={"Chưa cập nhập"} />
              )
            }
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
