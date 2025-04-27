import React from "react";
import { DateField, TextField, useTable } from "@refinedev/antd";
import { getDefaultFilter, type HttpError, useGo, useTranslate } from "@refinedev/core";
import { Table, Button, Input, InputNumber, Typography, theme, Space } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "@/components/paginationTotal";
import { IInspectingForm } from "@/interfaces";
import { useNavigate, useParams } from "react-router";
import { OrderStatusTag } from "../order-status";
import "../../plan/detail/dashboard-problems/index.css";

export const OrderListTable: React.FC = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const go = useGo();
  const { id } = useParams();
  const { tableProps, filters, setFilters } = useTable({
    resource: "orders",
    filters: {
      initial: [{ field: "plan_id", operator: "eq", value: id ?? "" }],
    },
  });
  const translate = useTranslate();
  return (
    <Table
      onRow={(record) => ({
        className: "hover-attribute",
        onClick: () => {
          if (record.id) {
            navigate(`/orders/${record.id}`);
          }
        },
      })}
      {...tableProps}
      rowKey="id"
      scroll={{ x: "max-content" }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => <PaginationTotal total={total} entityName="inspections" />,
      }}
    >
      <Table.Column
        title="ID"
        dataIndex="id"
        key="id"
        width={80}
        filterIcon={(filtered) => (
          <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
        )}
        defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
        filterDropdown={(props) => (
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Tìm ID"
            onChange={(value) => setFilters([{ field: "id", operator: "eq", value }])}
          />
        )}
      />

      <Table.Column
        title={translate("retailer_name", "Tên người mua lẻ")}
        dataIndex="retailer_name"
        key="retailer_name"
      />
      <Table.Column
        title={translate("plant_name", "Giống cây")}
        dataIndex="plant_name"
        key="plant_name"
        render={(value) => <TextField value={value ? value : "Chưa xác định giống cây"} />}
      />
      <Table.Column
        title={translate("packaging_type_name", "Loại bao bì")}
        dataIndex="packaging_type_name"
        key="packaging_type_name"
      />

      <Table.Column
        title={translate("deposit_price", "Tiền đặt cọc")}
        dataIndex="deposit_price"
        key="deposit_price"
        render={(value) => <TextField value={value ? value + " vnd" : "Chưa đặt cọc"} />}
      />
      <Table.Column title={translate("phone", "Điện thoại")} dataIndex="phone" key="phone" />
      <Table.Column
        title={translate("preorder_quantity", "Đặt trước")}
        dataIndex="preorder_quantity"
        key="preorder_quantity"
        render={(value) => (
          <TextField value={value ? value + " kg" : "Chưa xác định số lượng đặt trước"} />
        )}
      />
      <Table.Column
        title={translate("estimate_pick_up_date", "Dự kiến lấy hàng")}
        dataIndex="estimate_pick_up_date"
        key="estimate_pick_up_date"
        render={(value) => <DateField value={value} format="DD/MM/YYYY" />}
      />
      <Table.Column
        title={translate("created_at", "Ngày tạo")}
        dataIndex="created_at"
        key="created_at"
        render={(value) => <DateField value={value} format="DD/MM/YYYY" />}
      />

      <Table.Column
        title={translate("Status", "Trạng thái")}
        dataIndex="status"
        key="status"
        render={(value) => <OrderStatusTag status={value} />}
      />
    </Table>
  );
};
