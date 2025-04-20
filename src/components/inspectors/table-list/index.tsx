import {
  type HttpError,
  getDefaultFilter,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import { DateField, FilterDropdown, TextField, useTable } from "@refinedev/antd";

import { Avatar, Button, Input, InputNumber, Select, Table, Typography, theme } from "antd";

import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";
import { PaginationTotal } from "@/components/paginationTotal";
import { FarmerStatusTag } from "@/components/farmer";
import { useTranslation } from "react-i18next";

export const InspectorListTable: React.FC = () => {
  const { token } = theme.useToken();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<any, HttpError>({
    resource: "inspectors",
    filters: {
      initial: [
        {
          field: "id",
          operator: "eq",
          value: "",
        },
        {
          field: "name",
          operator: "contains",
          value: "",
        },
        {
          field: "phone",
          operator: "contains",
          value: "",
        },
        {
          field: "status",
          operator: "in",
          value: [],
        },
        {
          field: "email",
          operator: "contains",
          value: "",
        },
      ],
    },
  });
  const { t } = useTranslation();
  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => <PaginationTotal total={total} entityName={t("inspectors.title")} />,
      }}
    >
      <Table.Column
        title="ID"
        dataIndex="id"
        key="id"
        width="auto"
        render={(value) => (
          <Typography.Text style={{ fontWeight: "bold" }}>#{value}</Typography.Text>
        )}
        filterIcon={(filtered) => (
          <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
        )}
        defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <InputNumber
              addonBefore="#"
              style={{ width: "100%" }}
              placeholder={t("inspectors.search_id")}
            />
          </FilterDropdown>
        )}
      />

      <Table.Column
        title={t("inspectors.avatar")}
        width="auto"
        dataIndex="image_url"
        key="image_url"
        render={(image: string) => <Avatar shape="square" src={image} alt="Inspector" />}
      />

      <Table.Column
        title={t("inspectors.name")}
        dataIndex="name"
        key="name"
        width="auto"
        filterIcon={(filtered) => (
          <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
        )}
        defaultFilteredValue={getDefaultFilter("name", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("inspectors.search_name")} />
          </FilterDropdown>
        )}
      />

      <Table.Column
        title={t("inspectors.phone")}
        dataIndex="phone"
        key="phone"
        width="auto"
        render={(value) => (
          <Typography.Paragraph ellipsis={{ rows: 2, tooltip: true }} style={{ marginBottom: 0 }}>
            {value}
          </Typography.Paragraph>
        )}
      />

      <Table.Column
        title={t("inspectors.email")}
        dataIndex="email"
        key="email"
        width="auto"
        filterIcon={(filtered) => (
          <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
        )}
        defaultFilteredValue={getDefaultFilter("email", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("inspectors.search_email")} />
          </FilterDropdown>
        )}
      />

      <Table.Column
        title={t("inspectors.status")}
        dataIndex="is_active"
        key="is_active"
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: "200px" }}
              mode="multiple"
              placeholder={t("inspectors.filter_status")}
              allowClear
            >
              <Select.Option value={true}>{t("status.actived")}</Select.Option>
              <Select.Option value={false}>{t("status.unactived")}</Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(value) => <FarmerStatusTag value={value} />}
      />

      <Table.Column
        title={t("inspectors.created_at")}
        dataIndex="created_at"
        key="created_at"
        width={120}
        render={(value) => <DateField value={value} />}
      />

      <Table.Column
        title={t("inspectors.updated_at")}
        dataIndex="updated_at"
        key="updated_at"
        width="auto"
        render={(value) =>
          value ? (
            <DateField value={value} format="DD/MM/YYYY" />
          ) : (
            <TextField value={t("inspectors.not_updated")} />
          )
        }
      />

      <Table.Column
        title={t("inspectors.actions")}
        key="actions"
        fixed="right"
        align="center"
        render={(_, record: any) => (
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              go({
                to: `/inspectors/${record.id}`,
                query: {
                  to: pathname,
                },
                options: {
                  keepQuery: true,
                },
                type: "replace",
              });
            }}
          />
        )}
      />
    </Table>
  );
};
