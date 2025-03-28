import {
  type HttpError,
  getDefaultFilter,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";
import {
  DateField,
  FilterDropdown,
  NumberField,
  TextField,
  getDefaultSortOrder,
  useTable,
} from "@refinedev/antd";

import {
  Avatar,
  Button,
  Input,
  InputNumber,
  Select,
  Table,
  Tag,
  Typography,
  theme,
} from "antd";

import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";
import { IExpert, IFertilizer } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { ExpertStatusTag } from "../status";

export const ExpertListTable: React.FC = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<IFertilizer, HttpError>({
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

  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="experts" />
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
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <InputNumber
              addonBefore="#"
              style={{ width: "100%" }}
              placeholder="Search ID"
            />
          </FilterDropdown>
        )}
        render={(value) => (
          <Typography.Text style={{ fontWeight: "bold" }}>
            #{value}
          </Typography.Text>
        )}
      />

      <Table.Column
        width={"auto"}
        title={t("expert.avatar", "Ảnh đại diện")}
        dataIndex="avatar_image"
        key="avatar_image"
        render={(image: string) => (
          <Avatar shape="square" src={image} alt="Expert" />
        )}
      />

      <Table.Column
        title={t("exper.expert_name", "Tên chuyên gia")}
        width={"auto"}
        dataIndex="name"
        key="name"
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("name", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder="Search name" />
          </FilterDropdown>
        )}
      />

      <Table.Column
        title={t("expert.phone", "Số điện thoại")}
        width={"auto"}
        dataIndex="phone"
        key="phone"
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
        title={t("expert.email", "Email")}
        dataIndex="email"
        key="email"
        width={"auto"}
        filterIcon={(filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? token.colorPrimary : undefined,
            }}
          />
        )}
        defaultFilteredValue={getDefaultFilter("email", filters, "contains")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder="Search email" />
          </FilterDropdown>
        )}
      />

      <Table.Column
        title={t("expert.status", "Trạng thái")}
        dataIndex="status"
        key="status"
        width={"auto"}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              style={{ width: "200px" }}
              mode="multiple"
              placeholder="Filter by status"
              allowClear
            >
              <Select.Option value="Active">Actived</Select.Option>
              <Select.Option value="Inactive">UnActived</Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(value) => <ExpertStatusTag value={value} />}
      />

      <Table.Column
        title={t("expert.created_at", "Ngày tạo")}
        width={"auto"}
        dataIndex="created_at"
        key="created_at"
        render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
      />
      <Table.Column
        title={t("expert.updated_at", "Ngày cập nhập")}
        dataIndex="updated_at"
        key="updated_at"
        width={"auto"}
        render={(value) =>
          value ? (
            <DateField format="DD/MM/YYYY" value={value} />
          ) : (
            <TextField value={"Chưa cập nhập"} />
          )
        }
      />
      <Table.Column
        title={t("expert.actions", "Hành động")}
        key="actions"
        fixed="right"
        align="center"
        render={(_, record: IExpert) => (
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              go({
                to: `${showUrl("experts", record.id)}`,
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
