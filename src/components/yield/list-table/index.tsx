/* eslint-disable prettier/prettier */
import { type HttpError, getDefaultFilter } from "@refinedev/core";
import { useTable } from "@refinedev/antd";
import {
  Avatar,
  Button,
  Input,
  InputNumber,
  Table,
  theme,
  Typography,
} from "antd";
import { PaginationTotal } from "@/components/paginationTotal";
import { useState } from "react";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { YieldStatusTag } from "../status";
import { YieldTypeTag } from "../type";
import { YieldDrawerShow } from "../drawer-show";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import "../../plan/detail/dashboard-problems/index.css";
export const YieldListTable: React.FC = () => {
  const { token } = theme.useToken();
  const { tableProps, filters } = useTable<any, HttpError>({
    resource: "yields",
    filters: {
      initial: [
        { field: "id", operator: "eq", value: "" },
        { field: "yield_name", operator: "contains", value: "" },
        { field: "type", operator: "contains", value: "" },
        { field: "status", operator: "in", value: [] },
        { field: "area", operator: "eq", value: "" },
      ],
    },
  });

  const [selectedYieldId, setSelectedYieldId] = useState<string | undefined>(
    undefined
  );
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <Table
        onRow={(row) => ({
          className: "hover-attribute",
          onClick: () => {
            navigate(`/yield/${row.id}`);
          },
        })}
        {...tableProps}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="yields" />
          ),
        }}
      >
        <Table.Column
          title="ID"
          dataIndex="id"
          key="id"
          width={80}
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{ color: filtered ? token.colorPrimary : undefined }}
            />
          )}
          defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
          filterDropdown={() => (
            <InputNumber
              style={{ width: "100%" }}
              placeholder={t("yield.search.id")}
            />
          )}
          render={(value) => <Typography.Text>{`#${value}`}</Typography.Text>}
        />

        <Table.Column
          title={t("yield.landName")}
          dataIndex="yield_name"
          key="yield_name"
          filterIcon={(filtered) => (
            <SearchOutlined
              style={{ color: filtered ? token.colorPrimary : undefined }}
            />
          )}
          defaultFilteredValue={getDefaultFilter(
            "yield_name",
            filters,
            "contains"
          )}
          filterDropdown={() => <Input placeholder={t("yield.search.name")} />}
        />

        <Table.Column
          title={t("yield.area")}
          dataIndex="area"
          key="area"
          width={120}
          render={(value, record) => `${value} ${record.area_unit}`}
        />

        <Table.Column
          title={t("yield.description")}
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
          title={t("yield.soilType")}
          dataIndex="type"
          key="type"
          width={120}
        />

        <Table.Column
          title={t("yield.status")}
          dataIndex="status"
          key="status"
          width={120}
          render={(value) => <YieldStatusTag value={value} />}
        />
      </Table>
    </>
  );
};
