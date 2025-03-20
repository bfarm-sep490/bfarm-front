import React, { useState } from "react";
import { useTable } from "@refinedev/antd";
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
        scroll={{ x: true }}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => <PaginationTotal total={total} entityName="plants" />,
        }}
      >
        <Table.Column title="ID" dataIndex="id" key="id" width={80} />
        <Table.Column
          title="Image"
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

        <Table.Column title="Plant Name" dataIndex="plant_name" key="plant_name" />

        <Table.Column
          title="Description"
          dataIndex="description"
          key="description"
          width={300}
          render={(value) => (
            <Typography.Paragraph ellipsis={{ rows: 2, tooltip: true }} style={{ marginBottom: 0 }}>
              {value}
            </Typography.Paragraph>
          )}
        />

        <Table.Column title="Quantity" dataIndex="quantity" key="quantity" />

        <Table.Column
          title="Base Price"
          dataIndex="base_price"
          key="base_price"
          render={(value) => `$${value.toFixed(2)}`}
        />

        <Table.Column title="Type" dataIndex="type" key="type" />

        <Table.Column title="Delta One" dataIndex="delta_one" key="delta_one" />

        <Table.Column title="Delta Two" dataIndex="delta_two" key="delta_two" />

        <Table.Column title="Delta Three" dataIndex="delta_three" key="delta_three" />

        <Table.Column
          title="Preservation Days"
          dataIndex="preservation_day"
          key="preservation_day"
        />

        <Table.Column
          title="Estimated Per One"
          dataIndex="estimated_per_one"
          key="estimated_per_one"
        />

        <Table.Column
          title="Status"
          dataIndex="status"
          key="status"
          width={120}
          render={(value) => <PlantStatusTag value={value} />}
        />

        <Table.Column
          title="Actions"
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
