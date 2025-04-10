/* eslint-disable prettier/prettier */
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
  TextField,
  useTable,
} from "@refinedev/antd";

import {
  Avatar,
  Button,
  Input,
  InputNumber,
  Select,
  Table,
  Typography,
  theme,
} from "antd";

import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";
import { IFarmer } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { FarmerStatusTag } from "../status";

export const FarmerListTable: React.FC = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<any, HttpError>({
    resource: "farmers",
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
  const translate = useTranslate();

  return (
    <Table
      {...tableProps}
      rowKey="id"
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="farmers" />
        ),
      }}
    >
      <Table.Column
        title="ID"
        dataIndex="id"
        key="id"
        width={"auto"}
        render={(value) => (
          <Typography.Text style={{ fontWeight: "bold" }}>
            #{value}
          </Typography.Text>
        )}
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
              placeholder="Tìm ID"
            />
          </FilterDropdown>
        )}
      />

      <Table.Column
        title={translate("farmer.avatar", "Ảnh đại diện")}
        width={"auto"}
        dataIndex="avatar_image"
        key="avatar_image"
        render={(image: string) => (
          <Avatar shape="square" src={image} alt="Farmer" />
        )}
      />

      <Table.Column
        title={translate("farmer_name", "Tên nông dân")}
        dataIndex="name"
        key="name"
        width={"auto"}
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
        title={translate("farmer.phone", "Số điện thoại")}
        dataIndex="phone"
        key="phone"
        width={"auto"}
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
        title={translate("farmer.email", "Email")}
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
        title={translate("farmer.status", "Trạng thái")}
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
              <Select.Option value="Actived">Hoạt động</Select.Option>
              <Select.Option value="UnActived">Không hoạt động</Select.Option>
            </Select>
          </FilterDropdown>
        )}
        render={(value) => <FarmerStatusTag value={value} />}
      />
      <Table.Column
        title={translate("farmer.created_at", "Ngày tạo")}
        dataIndex="created_at"
        key="created_at"
        width={120}
        render={(value) => <DateField value={value} />}
      />
      <Table.Column
        title={translate("farmer.updated_at", "Ngày cập nhật")}
        dataIndex="updated_at"
        key="updated_at"
        width={"auto"}
        render={(value) =>
          value ? (
            <DateField value={value} format="DD/MM/YYYY" />
          ) : (
            <TextField
              value={translate("farmer.not_updated", "Chưa cập nhật")}
            />
          )
        }
      />

      <Table.Column
        title={translate("fertilizers.actions", "Hành động")}
        key="actions"
        fixed="right"
        align="center"
        render={(_, record: IFarmer) => (
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              go({
                to: `${showUrl("farmers", record.id)}`,
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
