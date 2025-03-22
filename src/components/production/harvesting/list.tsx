import React, { PropsWithChildren } from "react";
import { BaseRecord, useBack, useList, useTranslate } from "@refinedev/core";
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
import {
  Table,
  Space,
  Radio,
  Button,
  Breadcrumb,
  Typography,
  TableProps,
} from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { StatusTag } from "../../caring-task/status-tag";

export const HarvestingProductList = ({ children }: PropsWithChildren) => {
  const back = useBack();
  const navigate = useNavigate();
  const { id } = useParams();
  let resources = "harvesting-products";
  if (id) resources = `plans/${id}/harvesting-products`;
  const { tableProps } = useTable({
    resource: resources,
  });

  const translate = useTranslate();

  return (
    <>
      <List>
        <Table {...tableProps} rowKey="id" scroll={{ x: "max-content" }}>
          <Table.Column
            dataIndex="id"
            title={translate("ID")}
            render={(value) => (
              <TextField value={"#" + value} style={{ fontWeight: "bold" }} />
            )}
          />
          <Table.Column dataIndex="plan_name" title={translate("name")} />
          <Table.Column
            dataIndex="harvesting_date"
            title={translate("start_date")}
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            dataIndex="harvesting_quantity"
            title={"harvesting_quantity"}
            render={(value) => (
              <TextField value={value ? value : "Chưa thu hoạch"} />
            )}
          />
          <Table.Column
            dataIndex="available_harvesting_quantity"
            title={"available_harvesting_quantity"}
            render={(value) => (
              <TextField value={value ? value : "Chưa thu hoạch"} />
            )}
          />
          <Table.Column
            dataIndex="harvesting_unit"
            title={"harvesting_unit"}
            render={(value) => (
              <TextField value={value ? value : "Chưa thu hoạch"} />
            )}
          />
          <Table.Column
            dataIndex="expired_date"
            title={"expired_date"}
            render={(value) => (
              <TextField value={value ? value : "Chưa thu hoạch"} />
            )}
          />
          <Table.Column
            dataIndex="status"
            title={"status"}
            render={(value) => <StatusTag status={value} />}
          />

          <Table.Column
            title={translate("table.actions")}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <ShowButton hideText size="small" onClick={() => {}} />
              </Space>
            )}
          />
        </Table>
      </List>

      {children}
    </>
  );
};
