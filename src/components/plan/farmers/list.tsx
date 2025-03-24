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
import { useLocation, useParams } from "react-router";
import { IFarmer } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";

export const FarmerListTableInPlan: React.FC = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();
  const { id } = useParams();
  const { tableProps, sorters, filters } = useTable<any, HttpError>({
    resource: `plans/${id}/farmers`,
  });

  return (
    <Table {...tableProps} rowKey="id" scroll={{ x: true }}>
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
      />

      <Table.Column
        title="Avatar"
        width={"auto"}
        dataIndex="avatar_image"
        key="avatar_image"
        render={(image: string) => (
          <Avatar shape="square" src={image} alt="Farmer" />
        )}
      />

      <Table.Column
        title="Name"
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
      />

      <Table.Column
        title="Tổng lượng công việc"
        dataIndex="total_tasks"
        key="total_tasks"
        width={"auto"}
      />
      <Table.Column
        title="Công việc đang thực thi"
        dataIndex="ongoing_tasks"
        key="ongoing_tasks"
        width={"auto"}
      />
      <Table.Column
        title="Công việc hoàn thành"
        dataIndex="complete_tasks"
        key="complete_tasks"
        width={"auto"}
      />
      <Table.Column
        title="Công việc huỷ bỏ"
        dataIndex="cancel_tasks"
        key="cancel_tasks"
        width={"auto"}
      />
      <Table.Column
        title="Status"
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
              <Select.Option value="Actived">Actived</Select.Option>
              <Select.Option value="UnActived">UnActived</Select.Option>
            </Select>
          </FilterDropdown>
        )}
      />

      <Table.Column
        title="Actions"
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
