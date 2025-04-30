import {
  type HttpError,
  getDefaultFilter,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import { DateField, FilterDropdown, TextField, useTable } from "@refinedev/antd";

import { Avatar, Button, Input, InputNumber, Select, Table, Tag, Typography, theme } from "antd";

import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router";
import { IExpert, IFertilizer } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { ExpertStatusTag } from "../status";

export const ExpertListTable: React.FC = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, filters } = useTable<IFertilizer, HttpError>({
    resource: "experts",

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
  const navigate = useNavigate();
  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => <PaginationTotal total={total} entityName="experts" />,
      }}
      onRow={(record) => ({
        onClick: () => {
          if (record.id) {
            navigate(`/experts/${record.id}`);
          }
        },
      })}
      rowHoverable
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
          <FilterDropdown {...props}>
            <InputNumber
              addonBefore="#"
              style={{ width: "100%" }}
              placeholder={t("experts.common.search_id", "Tìm ID")}
            />
          </FilterDropdown>
        )}
        render={(value) => <Typography.Text>{`#${value}`}</Typography.Text>}
      />

      <Table.Column
        title={t("experts.fields.avatar", "Ảnh đại diện")}
        dataIndex="avatar_image"
        key="avatar_image"
        render={(image: string) => <Avatar shape="square" src={image} alt="Expert" />}
      />

      <Table.Column
        title={t("experts.fields.name")}
        dataIndex="name"
        key="name"
        width={"auto"}
        filterIcon={(filtered) => (
          <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
        )}
        defaultFilteredValue={getDefaultFilter("name", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("experts.common.search_name", "Tìm tên")} />
          </FilterDropdown>
        )}
      />

      <Table.Column
        title={t("experts.fields.phone")}
        dataIndex="phone"
        key="phone"
        width={"auto"}
        render={(value) => (
          <Typography.Paragraph ellipsis={{ rows: 2, tooltip: true }} style={{ marginBottom: 0 }}>
            {value}
          </Typography.Paragraph>
        )}
      />

      <Table.Column
        title={t("experts.fields.email")}
        dataIndex="email"
        key="email"
        width={"auto"}
        filterIcon={(filtered) => (
          <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
        )}
        defaultFilteredValue={getDefaultFilter("email", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder={t("experts.common.search_email", "Tìm email")} />
          </FilterDropdown>
        )}
      />

      <Table.Column
        title={t("experts.fields.status")}
        dataIndex="is_active"
        key="is_active"
        width={"auto"}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: "200px" }}
              mode="multiple"
              placeholder={t("experts.common.filter_by_status", "Lọc theo trạng thái")}
              allowClear
            >
              <Select.Option value={true}>{t("experts.status.active", "Hoạt động")}</Select.Option>
              <Select.Option value={false}>
                {t("experts.status.inactive", "Không hoạt động")}
              </Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(value) => <ExpertStatusTag value={value} />}
      />

      <Table.Column
        title={t("experts.fields.created_at")}
        dataIndex="created_at"
        key="created_at"
        width={"auto"}
        render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
      />

      <Table.Column
        title={t("experts.fields.updated_at")}
        dataIndex="updated_at"
        key="updated_at"
        width={"auto"}
        render={(value) =>
          value ? (
            <DateField format="DD/MM/YYYY" value={value} />
          ) : (
            <TextField value={t("experts.fields.not_updated")} />
          )
        }
      />
    </Table>
  );
};
