import React, { useState } from "react";
import { TextField, useTable } from "@refinedev/antd";
import { type HttpError } from "@refinedev/core";
import { Table, Avatar, Button, Typography, Tag, theme } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { PaginationTotal } from "@/components/paginationTotal";
import { IPlant } from "@/interfaces";
import { PlantDrawerShow } from "../drawer-show";
import { PlantStatusTag } from "../status";

export const PlantsListTable: React.FC = () => {
  const { token } = theme.useToken();

  const { tableProps, filters } = useTable<IPlant, HttpError>({
    resource: "plants",
    filters: {
      initial: [
        { field: "id", operator: "eq", value: "" },
        { field: "plant_name", operator: "contains", value: "" },
        { field: "quantity", operator: "eq", value: "" },
      ],
    },
  });

  const [selectedPlantId, setSelectedPlantId] = useState<number | undefined>();

  return (
    <>
      <Table
        {...tableProps}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => <PaginationTotal total={total} entityName="plants" />,
        }}
      >
        <Table.Column title="ID" dataIndex="id" key="id" width={80} />
        <Table.Column
          title="Ảnh"
          dataIndex="image_url"
          key="image_url"
          render={(image) => (
            <Avatar
              shape="square"
              src={image?.trim() ? image : "/images/plant-default-img.png"}
              alt="Plant"
            />
          )}
        />
        <Table.Column title="Tên giống" dataIndex="plant_name" key="plant_name" />

        <Table.Column
          title="Mô tả"
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
          title={<div style={{ whiteSpace: "nowrap", textAlign: "center" }}>Số lượng</div>}
          dataIndex="quantity"
          key="quantity"
          width={100}
        />

        <Table.Column
          title="Giá cơ bản"
          dataIndex="base_price"
          key="base_price"
          render={(value) => `${value.toFixed(2)} VND`}
        />

        <Table.Column title="Loại cây" dataIndex="type" key="type" />

        <Table.Column
          title="Số ngày bảo quản"
          dataIndex="preservation_day"
          key="preservation_day"
          render={(value) => <TextField value={value + " ngày"} />}
        />

        <Table.Column
          title="Sản lượng dự kiến"
          dataIndex="estimated_per_one"
          key="estimated_per_one"
          render={(value) => <TextField value={value + " kg"} />}
        />

        <Table.Column
          title="Trạng thái"
          dataIndex="status"
          key="status"
          width={120}
          render={(value) => <PlantStatusTag value={value} />}
        />

        <Table.Column
          fixed="right"
          title="Hành động"
          key="actions"
          fixed="right"
          align="center"
          render={(_, record: IPlant) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedPlantId(record.id);
              }}
            />
          )}
        />
      </Table>

      {selectedPlantId && (
        <PlantDrawerShow id={selectedPlantId} onClose={() => setSelectedPlantId(undefined)} />
      )}
    </>
  );
};
