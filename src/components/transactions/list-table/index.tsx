import React from "react";
import { DateField, useTable } from "@refinedev/antd";
import { type HttpError, useTranslate } from "@refinedev/core";
import { Table, Typography, theme } from "antd";

export const TransactionListTable: React.FC = () => {
  const { token } = theme.useToken();
  const { tableProps, filters } = useTable<any, HttpError>({
    resource: "transactions",
  });

  const t = useTranslate();

  return (
    <>
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          pageSize: 10,
        }}
      >
        <Table.Column
          title={"#ID"}
          dataIndex="id"
          key="id"
          width={80}
          render={(value) => <Typography.Text>{`#${value}`}</Typography.Text>}
        />

        <Table.Column title={"ID Đơn hàng"} dataIndex="order_id" key="order_id" />

        <Table.Column title={"Mã đơn hàng"} dataIndex="order_code" key="order_code" />

        <Table.Column title={"Nội dung giao dịch"} dataIndex="content" key="content" />

        <Table.Column title={"Số tiền"} dataIndex="price" key="price" />

        <Table.Column title={"Loại giao dịch"} dataIndex="type" key="type" width={120} />

        <Table.Column title={"Trạng thái"} dataIndex="status" key="status" width={120} />

        <Table.Column
          title={"Ngày giao dịch"}
          key="payment_date"
          render={(value) => <DateField value={value} format="hh:mm DD/MM/YYYY" />}
        />
      </Table>
    </>
  );
};
