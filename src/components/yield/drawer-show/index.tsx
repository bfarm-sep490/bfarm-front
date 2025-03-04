import { useState, useEffect } from "react";
import {
  Button,
  Divider,
  Flex,
  Typography,
  theme,
  Spin,
  Grid,
  message,
  Tag,
  Modal,
} from "antd";

import { Drawer } from "../../drawer";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { axiosClient } from "@/lib/api/config/axios-client";
import { IYield } from "@/interfaces";
import { YieldDrawerForm } from "../drawer-form"; // Import form chỉnh sửa

type Props = {
  id?: string;
  onClose?: () => void;
};

export const YieldDrawerShow = ({ id, onClose }: Props) => {
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const [yieldData, setYieldData] = useState<IYield | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false); // State mở form edit

  useEffect(() => {
    if (!id) return;
    fetchYield();
  }, [id]); // 🔥 Khi id thay đổi, load lại dữ liệu mới

  const fetchYield = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get(`/api/yields/${id}`);
      if (response.data.status === 200) {
        const data = response.data.data;

        console.log("🚀 Dữ liệu lấy từ API:", data);

        // Cập nhật dữ liệu mới sau khi fetch
        setYieldData({
          ...data,
          is_available: data.is_available ? "Available" : "Unavailable",
        });
      } else {
        setError("Không thể tải thông tin yield.");
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      message.error("ID không hợp lệ.");
      return;
    }

    try {
      const response = await axiosClient.delete(`/api/yields/${id}`);
      if (response.status === 200 || response.status === 204) {
        message.success("Xóa yield thành công");
        onClose?.();
      } else {
        message.error(`Lỗi: ${response.statusText}`);
      }
    } catch (err: any) {
      console.error("Lỗi xóa yield:", err.response || err);
      message.error("Không thể xóa yield. Vui lòng thử lại.");
    }
  };

  const handleUpdateSuccess = (updatedYield: IYield) => {
    console.log("🔥 Cập nhật dữ liệu sau khi edit:", updatedYield);
    setYieldData({
      ...updatedYield,
      is_available: updatedYield.is_available ? "Available" : "Unavailable",
    });
    setEditOpen(false);
  };

  if (loading) {
    return (
      <Drawer open={!!id} width={breakpoint.sm ? "400px" : "100%"} onClose={onClose}>
        <Flex justify="center" align="center" style={{ height: "100%" }}>
          <Spin size="large" />
        </Flex>
      </Drawer>
    );
  }

  if (error) {
    return (
      <Drawer open={!!id} width={breakpoint.sm ? "400px" : "100%"} onClose={onClose}>
        <Typography.Text type="danger">{error}</Typography.Text>
      </Drawer>
    );
  }

  return (
    <>
      <Drawer open={!!id} width={breakpoint.sm ? "400px" : "100%"} onClose={onClose}>
        <Flex vertical style={{ backgroundColor: token.colorBgContainer, padding: 16 }}>
          <Typography.Title level={4}>{yieldData?.yield_name}</Typography.Title>
          <Typography.Paragraph type="secondary">
            {yieldData?.description}
          </Typography.Paragraph>

          <Divider style={{ margin: "12px 0" }} />

          <Flex vertical gap={8}>
            <Typography.Text>
              <strong>Diện tích:</strong> {yieldData?.area} {yieldData?.area_unit}
            </Typography.Text>
            <Typography.Text>
              <strong>Loại:</strong> {yieldData?.type}
            </Typography.Text>
            <Typography.Text>
              <strong>Kích thước:</strong> {yieldData?.size}
            </Typography.Text>
            <Typography.Text>
              <strong>Trạng thái:</strong>{" "}
              {yieldData?.is_available ? (
                <Tag color={yieldData.is_available === "Available" ? "green" : "red"}>
                  {yieldData.is_available}
                </Tag>
              ) : (
                <Tag color="default">Không xác định</Tag>
              )}
            </Typography.Text>
          </Flex>
        </Flex>

        {/* Đổi vị trí nút Delete và Edit */}
        <Flex align="center" justify="space-between" style={{ padding: "16px" }}>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => setDeleteModalOpen(true)}>
            Delete
          </Button>
          <Button icon={<EditOutlined />} onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        </Flex>
      </Drawer>

      {/* Hiển thị form chỉnh sửa khi nhấn Edit */}
      {editOpen && (
        <YieldDrawerForm
          id={id}
          action="edit"
          onClose={() => {
            setEditOpen(false);
            fetchYield(); // 🔥 Refetch lại dữ liệu để đảm bảo cập nhật mới nhất
          }}
          onMutationSuccess={handleUpdateSuccess} // ✅ Cập nhật dữ liệu ngay lập tức
        />
      )}

      {/* Modal xác nhận xóa */}
      <Modal
        title={
          <Flex align="center" gap={8}>
            <ExclamationCircleOutlined style={{ color: "red" }} />
            <span>Bạn có chắc chắn muốn xóa yield này?</span>
          </Flex>
        }
        open={deleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        okText="Xóa"
        okType="danger"
        cancelText="Hủy"
      >
        <Typography.Paragraph>Thao tác này không thể hoàn tác.</Typography.Paragraph>
      </Modal>
    </>
  );
};
