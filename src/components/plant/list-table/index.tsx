import React, { useState } from "react";
import { useTable } from "@refinedev/antd";
import { type HttpError, getDefaultFilter } from "@refinedev/core";
import { Table, Avatar, Button, Input, InputNumber, Typography, Tag, theme } from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { PaginationTotal } from "@/components/paginationTotal";
import { IPlant } from "@/interfaces";
import { PlantDrawerShow } from "../drawer-show";
import { PlantAvailabilityTag } from "../availability";

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

  const getGTTestKitColor = (color: string | null | undefined) => {
    const colorMap: Record<string, string> = {
      Blue: "blue",
      Yellow: "gold",
      Red: "red",
      Orange: "orange",
      Green: "green",
    };
    return colorMap[color || ""] || "default";
  };

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
            <InputNumber style={{ width: "100%" }} placeholder="Search ID" />
          )}
        />

        {/* ✅ Image */}
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

        {/* ✅ Name - Bộ lọc tìm kiếm */}
        <Table.Column
          title="Plant Name"
          dataIndex="plant_name"
          key="plant_name"
          filterIcon={(filtered) => (
            <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
          )}
          defaultFilteredValue={getDefaultFilter("plant_name", filters, "contains")}
          filterDropdown={(props) => <Input placeholder="Search name" />}
        />

        {/* ✅ Description */}
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

        {/* ✅ Quantity - Bộ lọc tìm kiếm */}
        <Table.Column
          title="Quantity"
          dataIndex="quantity"
          key="quantity"
          width={"auto"}
          filterIcon={(filtered) => (
            <SearchOutlined style={{ color: filtered ? token.colorPrimary : undefined }} />
          )}
          defaultFilteredValue={getDefaultFilter("quantity", filters, "eq")}
          filterDropdown={(props) => (
            <InputNumber placeholder="Search total quantity" style={{ width: "100%" }} />
          )}
          render={(value, record) => `${value} ${record.unit}`}
        />
        <Table.Column
          title="Availability"
          dataIndex="is_available"
          key="is_available"
          width={140}
          align="center"
          render={(value: boolean | string) => {
            const availability = value === true ? "Available" : "Unavailable";
            return <PlantAvailabilityTag value={availability} />;
          }}
        />

        {/* ✅ GT Test Kit Color */}
        <Table.Column
          title="GT Test Kit Color"
          dataIndex="gt_test_kit_color"
          key="gt_test_kit_color"
          width={120}
          align="center"
          render={(value) => <Tag color={getGTTestKitColor(value)}>{value || "-"}</Tag>}
        />

        {/* ✅ Actions */}
        <Table.Column
          title="Actions"
          key="actions"
          fixed="right"
          align="center"
          render={(_, record: IPlant) => (
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                console.log("Selected Plant ID:", record.id);
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
