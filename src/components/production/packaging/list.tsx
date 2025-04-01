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
import { Table, Space, Radio, Button, Breadcrumb, Typography, TableProps } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { StatusTag } from "../../caring-task/status-tag";

export const PackagedProductList = ({ children }: PropsWithChildren) => {
  const back = useBack();
  const navigate = useNavigate();
  const { id } = useParams();

  const { tableProps } = useTable({
    resource: `packaging-products`,
    filters: {
      initial: [
        {
          field: "plan_id",
          operator: "eq",
          value: id ?? "",
        },
      ],
    },
  });

  const translate = useTranslate();

  return (
    <>
      <List>
        <Table {...tableProps} rowKey="id" scroll={{ x: "max-content" }}>
          <Table.Column
            dataIndex="id"
            title={translate("ID")}
            render={(value) => <TextField value={"#" + value} style={{ fontWeight: "bold" }} />}
          />
          <Table.Column dataIndex="plan_name" title={translate("plan_name", "Tên kế hoạch")} />
          <Table.Column
            dataIndex="packaging_date"
            title={translate("packaging_date", "Ngày đóng gói")}
            render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
          />
          <Table.Column
            dataIndex="plant_name"
            title={translate("plant_name", "Tên cây trồng")}
            render={(value) => <TextField value={value ? value : "Chưa thu hoạch"} />}
          />
          <Table.Column
            dataIndex="expired_date"
            title={translate("expired_date", "Ngày hết hạn")}
            render={(value) => <TextField value={value ? value : "Chưa thu hoạch"} />}
          />
          <Table.Column
            dataIndex="quantity_per_pack"
            title={translate("quantity_per_pack", "Số lượng mỗi gói")}
            render={(value) => <TextField value={value ? value + " kg" : "Chưa thu hoạch"} />}
          />

          <Table.Column
            dataIndex="pack_quantity"
            title={translate("pack_quantity", "Số lượng gói")}
            render={(value) => <TextField value={value ? value : "Chưa thu hoạch"} />}
          />
          <Table.Column
            dataIndex="status"
            title={translate("status", "Trạng thái")}
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
