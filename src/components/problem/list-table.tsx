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
} from "@refinedev/antd";
import { Table, Space, Radio, Button, Breadcrumb, Typography } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";

const getTypeTagColor = (value: string) => {
  switch (value) {
    case "Weather":
      return "green";
    case "Fungus":
      return "#CC33FF";
    case "Nutrients":
      return "#550000";
    case "Light":
      return "yellow";
    case "Water":
      return "blue";

    case "Pest":
      return "yellow";
    default:
      return "default";
  }
};

const getTypeTagValue = (value: string) => {
  switch (value) {
    case "Weather":
      return "Thời tiết";
    case "Nutrients":
      return "Dinh dưỡng";
    case "Fungus":
      return "Nấm mốc";
    case "Light":
      return "Ánh sáng";
    case "Water":
      return "Thiếu nước";
    case "Fertilizing":
      return "Bón phân";
    case "Pest":
      return "Sâu bệnh";
    default:
      return "Không xác định";
  }
};

const getStatusTagColor = (value: string) => {
  switch (value) {
    case "Pending":
      return "blue";
    case "Resolved":
      return "green";
    case "Cancelled":
      return "red";

    default:
      return "default";
  }
};

const getStatusTagValue = (value: string) => {
  switch (value) {
    case "Pending":
      return "Đợi xác nhận";
    case "Resolved":
      return "Hoàn thành";
    case "Cancelled":
      return "Hủy bỏ";

    default:
      return "Không xác định";
  }
};
export const ProblemListInProblem = ({ children }: PropsWithChildren) => {
  const { id } = useParams();
  const translate = useTranslate();
  const { tableProps } = useTable({
    syncWithLocation: true,
    resource: `problems`,
  });

  const navigate = useNavigate();

  return (
    <>
      <List>
        <Table {...tableProps} rowKey="id" scroll={{ x: "max-content" }}>
          <Table.Column dataIndex="id" title={translate("ID")} />
          <Table.Column dataIndex="problem_name" title={translate("name")} />
          <Table.Column
            dataIndex="date"
            title={"Ngày phát sinh"}
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            dataIndex="problem_type"
            title={translate("problem_type")}
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

          <Table.Column
            title={translate("table.actions")}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <ShowButton
                  hideText
                  size="small"
                  onClick={() => navigate(`/problems/${record.id}`)}
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
