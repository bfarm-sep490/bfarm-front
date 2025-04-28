/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { DateField, useTable } from "@refinedev/antd";
import { type HttpError, useTranslate } from "@refinedev/core";
import { Table, theme, Typography } from "antd";

export const BactchListTable: React.FC = () => {
  const { token } = theme.useToken();
  const { tableProps, filters } = useTable<any, HttpError>({
    resource: "product-pickup-batches",
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

        <Table.Column
          title={"ID sản phẩm"}
          dataIndex="product_id"
          key="product_id"
        />

        <Table.Column title={"Số lượng"} dataIndex="quantity" key="quantity" />
        <Table.Column
          title={"Ngày bàn giao"}
          dataIndex={"created_date"}
          key="created_date"
          render={(value) => (
            <DateField value={value} format="hh:mm DD/MM/YYYY" />
          )}
        />
      </Table>
    </>
  );
};
