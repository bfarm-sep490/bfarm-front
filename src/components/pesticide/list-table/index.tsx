/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { type HttpError, getDefaultFilter } from "@refinedev/core";
import { useTable } from "@refinedev/antd";
import {
  Avatar,
  Button,
  Input,
  InputNumber,
  Table,
  Typography,
  theme,
} from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { IPesticide } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { PesticideDrawerShow } from "@/components/pesticide/drawer-show";
import { PesticideStatusTag } from "../status";
import { PesticideTypeTag } from "../type";
import { useTranslation } from "react-i18next";

export const PesticidesListTable: React.FC = () => {
  const { token } = theme.useToken();
  const { tableProps, filters } = useTable<IPesticide, HttpError>({
    resource: "pesticides",
    filters: {
      initial: [
        { field: "id", operator: "eq", value: "" },
        { field: "name", operator: "contains", value: "" },
        { field: "type", operator: "contains", value: "" },
        { field: "status", operator: "in", value: [] },
        { field: "available_quantity", operator: "eq", value: "" },
      ],
    },
  });

  const [selectedPesticideId, setSelectedPesticideId] = useState<
    string | undefined
  >(undefined);

  const { t } = useTranslation();

  return (
    <>
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="pesticides" />
          ),
        }}
        onRow={(record) => ({
          onClick: () => {
            setSelectedPesticideId(record?.id ? String(record.id) : undefined);
          },
        })}
        rowHoverable
      >
        <Table.Column
          title={t("pesticides.fields.id")}
          dataIndex="id"
          key="id"
          width={80}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{ color: filtered ? token.colorPrimary : undefined }}
            />
          )}
          defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
          filterDropdown={(props) => (
            <InputNumber
              addonBefore="#"
              style={{ width: "100%" }}
              placeholder={t("pesticides.fields.searchById")}
            />
          )}
          render={(value) => <Typography.Text>{`#${value}`}</Typography.Text>}
        />

        <Table.Column
          width={"auto"}
          title={t("pesticides.fields.image")}
          dataIndex="image"
          key="image"
          render={(image: string) => (
            <Avatar
              shape="square"
              src={image}
              alt={t("pesticides.fields.imageAlt")}
            />
          )}
        />

        <Table.Column
          title={t("pesticides.fields.name")}
          width={"auto"}
          dataIndex="name"
          key="name"
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{ color: filtered ? token.colorPrimary : undefined }}
            />
          )}
          defaultFilteredValue={getDefaultFilter("name", filters, "contains")}
          filterDropdown={(props) => (
            <Input placeholder={t("pesticides.fields.searchByName")} />
          )}
        />

        <Table.Column
          title={t("pesticides.fields.description")}
          dataIndex="description"
          key="description"
          width={300}
          render={(value) => (
            <Typography.Paragraph
              ellipsis={{ rows: 2, tooltip: true }}
              style={{ marginBottom: 0 }}
            >
              {value}
            </Typography.Paragraph>
          )}
        />

        <Table.Column
          title={t("pesticides.fields.quantity")}
          dataIndex="quantity"
          key="quantity"
          width={"auto"}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{ color: filtered ? token.colorPrimary : undefined }}
            />
          )}
          defaultFilteredValue={getDefaultFilter("quantity", filters, "eq")}
          filterDropdown={(props) => (
            <InputNumber
              placeholder={t("pesticides.fields.searchByQuantity")}
              style={{ width: "100%" }}
            />
          )}
          render={(value, record) => `${value} ${record.unit}`}
        />

        <Table.Column
          title={t("pesticides.fields.type")}
          dataIndex="type"
          key="type"
          width={120}
          render={(value) => <PesticideTypeTag value={value} />}
        />

        <Table.Column
          title={t("pesticides.fields.status")}
          dataIndex="status"
          key="status"
          width={120}
          render={(value) => <PesticideStatusTag value={value} />}
        />
      </Table>

      {selectedPesticideId && (
        <PesticideDrawerShow
          id={selectedPesticideId}
          onClose={() => setSelectedPesticideId(undefined)}
        />
      )}
    </>
  );
};
