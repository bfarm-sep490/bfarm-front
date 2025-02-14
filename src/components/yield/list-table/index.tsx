import { type HttpError, useGo, useNavigation, useTranslate } from "@refinedev/core";
import { FilterDropdown, useTable, NumberField } from "@refinedev/antd";
import { Button, Input, Table, Tag, Typography, theme, Spin } from "antd";
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";
import { IYield, YieldType, YieldAvailability, YieldSize } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { useEffect, useState } from "react";

export const YieldsListTable: React.FC = () => {
  const { token } = theme.useToken();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { tableProps, sorters, filters } = useTable<IYield, HttpError>({
    resource: "yield", // Ensure this matches your API resource name
    filters: {
      initial: [
        { field: "name", operator: "contains", value: "" },
        { field: "description", operator: "contains", value: "" },
      ],
    },
  });

  // Check if data is loading
  const isLoading = tableProps.loading;

  useEffect(() => {
    console.log("YieldsListTable mounted");
    console.log("Raw Table Data:", tableProps?.dataSource);

    return () => console.log("YieldsListTable unmounted");
  }, []);

  // Ensure dataSource is properly formatted
  const dataSource = tableProps?.dataSource ?? [];

  // Color functions for Type, Availability, and Size
  const getTypeColor = (type?: YieldType) => {
    const colorMap: Record<YieldType, string> = {
      "Đất Thịt": "brown",
      "Đất Mùn": "green",
    };
    return type ? colorMap[type] || "default" : "default";
  };

  const getAvailabilityColor = (status?: YieldAvailability) => {
    return status === "Available" ? "green" : "red";
  };

  const getSizeColor = (size?: YieldSize) => {
    const colorMap: Record<YieldSize, string> = {
      Small: "blue",
      Medium: "orange",
      Large: "purple",
    };
    return size ? colorMap[size] || "default" : "default";
  };

  const handleRowClick = (record: IYield) => {
    go({
      to: `${showUrl("yield", record.id.toString())}`,
      query: { to: pathname },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
        <Spin size="large" tip="Loading yields data..." />
      </div>
    );
  }

  return (
    <Table
      {...tableProps}
      dataSource={dataSource}
      rowKey={(record) => record.id?.toString() || Math.random().toString()}
      scroll={{ x: true }}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => <PaginationTotal total={total} entityName="yields" />,
      }}
    >
      <Table.Column
        title="ID"
        dataIndex="id"
        key="id"
        width={80}
        align="center"
        render={(value) => <Typography.Text strong>#{value ?? "-"}</Typography.Text>}
      />
      <Table.Column
        title="Name"
        dataIndex="name"
        key="name"
        align="left"
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder="Search name" />
          </FilterDropdown>
        )}
      />
      <Table.Column
        title="Description"
        dataIndex="description"
        key="description"
        width={250}
        render={(value) => <Typography.Paragraph ellipsis={{ rows: 2, tooltip: value }}>{value || "-"}</Typography.Paragraph>}
      />
      <Table.Column
        title="Area"
        dataIndex="Area"
        key="Area"
        width={140}
        align="right"
        sorter
        render={(value: number, record) => (
          <Typography.Text>
            <NumberField value={value} /> {record.AreaUnit}
          </Typography.Text>
        )}
      />
      <Table.Column
        title="Availability"
        dataIndex="isAvailable"
        key="isAvailable"
        width={140}
        align="center"
        render={(value: YieldAvailability) => (
          <Tag icon={value === "Available" ? <CheckCircleOutlined /> : <CloseCircleOutlined />} color={getAvailabilityColor(value)}>
            {value}
          </Tag>
        )}
      />
      <Table.Column
        title="Size"
        dataIndex="size"
        key="size"
        width={120}
        align="center"
        render={(value) => <Tag color={getSizeColor(value)}>{value ?? "-"}</Tag>}
      />
      <Table.Column
        title="Type"
        dataIndex="type"
        key="type"
        width={120}
        align="center"
        render={(value) => <Tag color={getTypeColor(value)}>{value ?? "-"}</Tag>}
      />
      <Table.Column
        title="Actions"
        key="actions"
        fixed="right"
        align="center"
        render={(_, record: IYield) => <Button icon={<EyeOutlined />} onClick={() => handleRowClick(record)} />}
      />
    </Table>
  );
};
