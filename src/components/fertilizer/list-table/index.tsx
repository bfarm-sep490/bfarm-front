import { type HttpError, getDefaultFilter } from "@refinedev/core";
import { useTable } from "@refinedev/antd";
import { Avatar, Button, Input, InputNumber, Table, theme, Typography } from "antd";
import { IFertilizer } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { FertilizerStatusTag } from "../status";
import { useState } from "react";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { FertilizerTypeTag } from "../type";
import { FertilizerDrawerShow } from "../drawer-show";
import { useTranslation } from "react-i18next";

export const FertilizersListTable: React.FC = () => {
  const { token } = theme.useToken();
  const { tableProps, filters } = useTable<IFertilizer, HttpError>({
    resource: "fertilizers",
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

  const [selectedFertilizerId, setSelectedFertilizerId] = useState<string | undefined>(undefined);
  const { t } = useTranslation();

  return (
    <>
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName={t("fertilizers.entity")} />
          ),
        }}
        onRow={(record) => ({
          onClick: () => {
            if (record.id) {
              setSelectedFertilizerId(record.id.toString());
            }
          },
        })}
        rowHoverable
      >
        <Table.Column
          title={t("fertilizers.fields.id")}
          dataIndex="id"
          key="id"
          width={80}
          filterIcon={(filtered) => (
            <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
          )}
          defaultFilteredValue={getDefaultFilter("id", filters, "eq")}
          filterDropdown={() => (
            <InputNumber style={{ width: "100%" }} placeholder={t("fertilizers.filters.id")} />
          )}
          render={(value) => <Typography.Text>{`#${value}`}</Typography.Text>}
        />

        <Table.Column
          title={t("fertilizers.fields.image")}
          dataIndex="image"
          key="image"
          render={(image) => (
            <Avatar
              shape="square"
              src={image?.trim() ? image : "/images/default-image.png"}
              alt="Item"
            />
          )}
        />

        <Table.Column
          title={t("fertilizers.fields.name")}
          dataIndex="name"
          key="name"
          filterIcon={(filtered) => (
            <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
          )}
          defaultFilteredValue={getDefaultFilter("name", filters, "contains")}
          filterDropdown={() => <Input placeholder={t("fertilizers.filters.name")} />}
        />

        <Table.Column
          title={t("fertilizers.fields.description")}
          dataIndex="description"
          key="description"
          width={300}
          render={(value) => (
            <Typography.Paragraph ellipsis={{ rows: 2, tooltip: true }} style={{ marginBottom: 0 }}>
              {value}
            </Typography.Paragraph>
          )}
        />

        <Table.Column
          title={t("fertilizers.fields.quantity")}
          dataIndex="quantity"
          key="quantity"
          width={120}
          filterIcon={(filtered) => (
            <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
          )}
          defaultFilteredValue={getDefaultFilter("quantity", filters, "eq")}
          filterDropdown={() => (
            <InputNumber
              placeholder={t("fertilizers.filters.quantity")}
              style={{ width: "100%" }}
            />
          )}
          render={(value, record) => `${value} ${record.unit}`}
        />

        <Table.Column
          title={t("fertilizers.fields.type")}
          dataIndex="type"
          key="type"
          width={140}
          render={(value) => <FertilizerTypeTag value={value} />}
        />

        <Table.Column
          title={t("fertilizers.fields.status")}
          dataIndex="status"
          key="status"
          width={120}
          render={(value) => <FertilizerStatusTag value={value} />}
        />
      </Table>
      {selectedFertilizerId && (
        <FertilizerDrawerShow
          id={selectedFertilizerId}
          onClose={() => setSelectedFertilizerId(undefined)}
        />
      )}
    </>
  );
};
