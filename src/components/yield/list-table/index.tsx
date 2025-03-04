import React, { useEffect, useState, useCallback } from "react";
import { Table, Tag, Button, Typography, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useGo } from "@refinedev/core";
import { useLocation } from "react-router-dom";
import { axiosClient } from "@/lib/api/config/axios-client";
import { PaginationTotal } from "@/components/paginationTotal";
import { IYield } from "@/interfaces";
import { YieldDrawerShow } from "../drawer-show";
import { YieldDrawerForm } from "../drawer-form"; // Import form Create/Edit

export const YieldListTable: React.FC = () => {
  const go = useGo();
  const { pathname } = useLocation();

  // State lưu trữ dữ liệu từ API
  const [yields, setYields] = useState<IYield[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYieldId, setSelectedYieldId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false); // State mở form Create

  // ✅ Hàm fetch data có thể gọi lại sau khi Create/Edit
  const fetchYields = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/api/yields");
      if (response.data.status === 200 && Array.isArray(response.data.data)) {
        // Chuẩn hóa dữ liệu trước khi set vào state
        const formattedYields = response.data.data.map((item: any) => ({
          ...item,
          is_available: item.is_available ? "Available" : "Unavailable",
          size: item.size === "Nhỏ" ? "Small" : item.size === "Vừa" ? "Medium" : "Large",
        }));

        setYields(formattedYields);
      } else {
        setError("Không thể tải danh sách yields.");
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi tải danh sách yields.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Gọi fetch data khi component mount
  useEffect(() => {
    fetchYields();
  }, [fetchYields]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Trái cây":
        return "blue";
      case "Rau củ":
        return "green";
      default:
        return "default";
    }
  };

  if (loading) return <Spin size="large" className="flex justify-center" />;
  if (error) return <Typography.Text type="danger">{error}</Typography.Text>;

  return (
    <>
      <Table
        dataSource={yields}
        rowKey="id"
        scroll={{ x: true }}
        pagination={{
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="yields" />
          ),
        }}
      >
        <Table.Column title="ID" dataIndex="id" key="id" width={80} />
        <Table.Column title="Name" dataIndex="yield_name" key="name" />
        <Table.Column title="Description" dataIndex="description" key="description" width={300} />
        <Table.Column
          title="Availability"
          dataIndex="is_available"
          key="is_available"
          width={120}
          render={(value: string) => (
            <Tag color={value === "Available" ? "green" : "red"}>{value}</Tag>
          )}
        />
        <Table.Column title="Area" dataIndex="area" key="area" width={120} />
        <Table.Column title="Area Unit" dataIndex="area_unit" key="area_unit" width={120} />
        <Table.Column
          title="Type"
          dataIndex="type"
          key="type"
          width={120}
          render={(value: string) => <Tag color={getTypeColor(value)}>{value}</Tag>}
        />
        <Table.Column
          title="Size"
          dataIndex="size"
          key="size"
          width={120}
          render={(value: string) => <Tag color="blue">{value}</Tag>}
        />
        <Table.Column
          title="Actions"
          key="actions"
          fixed="right"
          align="center"
          render={(_, record: IYield) => (
            <Button icon={<EyeOutlined />} onClick={() => setSelectedYieldId(record.id.toString())} />
          )}
        />
      </Table>

      {/* Drawer hiển thị chi tiết */}
      {selectedYieldId && (
        <YieldDrawerShow id={selectedYieldId} onClose={() => setSelectedYieldId(null)} />
      )}

      {/* Drawer Create/Edit */}
      {isCreateOpen && (
        <YieldDrawerForm
          action="create"
          onClose={() => setIsCreateOpen(false)}
          onMutationSuccess={(newYield, isNew) => {
            setIsCreateOpen(false);

            setYields((prevYields) => {
              if (isNew) {
                return [...prevYields, newYield]; // ✅ Thêm dữ liệu mới vào bảng ngay lập tức
              } else {
                return prevYields.map((yieldItem) =>
                  yieldItem.id === newYield.id ? newYield : yieldItem
                ); // ✅ Cập nhật dữ liệu nếu chỉnh sửa
              }
            });
          }}
        />

      )}
    </>
  );
};
