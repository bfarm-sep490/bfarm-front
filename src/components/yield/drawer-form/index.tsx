import { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Grid,
  Button,
  Flex,
  Spin,
  message,
} from "antd";
import { Drawer } from "../../drawer";
import { SaveButton } from "@refinedev/antd";
import { axiosClient } from "@/lib/api/config/axios-client";
import { useGetToPath, useGo } from "@refinedev/core";
import { useSearchParams } from "react-router";
import { IYield } from "@/interfaces";

type Props = {
  id?: string;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: (updatedYield: IYield, isNew: boolean) => void;
};

export const YieldDrawerForm = ({ id, action, onClose, onMutationSuccess }: Props) => {
  const [form] = Form.useForm();
  const breakpoint = Grid.useBreakpoint();
  const [loading, setLoading] = useState(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  useEffect(() => {
    if (id && action === "edit") {
      fetchYieldDetails();
    }
  }, [id, action]);

  const fetchYieldDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/api/yields/${id}`);
      if (response.data.status === 200) {
        const yieldData = response.data.data;

        console.log("🚀 Dữ liệu lấy từ API:", yieldData);

        form.setFieldsValue({
          yield_name: yieldData.yield_name,
          area_unit: yieldData.area_unit,
          area: yieldData.area,
          description: yieldData.description,
          type: yieldData.type,
          is_available: yieldData.is_available ? "Available" : "Unavailable",
          size: yieldData.size, // ✅ Giữ nguyên dữ liệu API
        });
      } else {
        message.error("Không thể tải thông tin sản lượng.");
      }
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);

    // 🔥 Chuyển đổi dữ liệu đúng định dạng API yêu cầu
    const payload = {
      id: action === "edit" ? id : undefined, // ID chỉ gửi khi chỉnh sửa
      yield_name: values.yield_name?.trim(),
      area_unit: values.area_unit,
      area: Number(values.area),
      description: values.description?.trim(),
      type: values.type,
      is_available: values.is_available === "Available", // ✅ Chuyển thành boolean đúng
      size: values.size, // ✅ Giữ nguyên giá trị API
    };

    try {
      let response;
      let isNew = action !== "edit";
      if (action === "edit") {
        response = await axiosClient.put(`/api/yields/${id}`, payload);
      } else {
        response = await axiosClient.post("/api/yields", payload);
      }

      if (response.data.status === 200) {
        message.success(action === "edit" ? "Cập nhật thành công!" : "Tạo mới thành công!");

        const formattedYield = {
          ...response.data.data,
          is_available: response.data.data.is_available ? "Available" : "Unavailable",
          size: response.data.data.size, // ✅ Giữ nguyên giá trị từ API
        };

        onMutationSuccess?.(formattedYield, isNew);
        onDrawerClose();
      } else {
        message.error(response.data.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  const onDrawerClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    go({
      to: searchParams.get("to") ?? getToPath({ action: "list" }) ?? "",
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  return (
    <Drawer open={true} title={action === "edit" ? "Edit Yield" : "Add Yield"} width={breakpoint.sm ? "400px" : "100%"} onClose={onDrawerClose}>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Text Inputs */}
          <Form.Item label="Yield Name" name="yield_name" rules={[{ required: true, message: "Tên sản lượng là bắt buộc" }]}>
            <Input placeholder="Nhập tên sản lượng" />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: "Mô tả là bắt buộc" }]}>
            <Input.TextArea rows={3} placeholder="Nhập mô tả" />
          </Form.Item>

          {/* Area */}
          <Form.Item label="Area (sq. meters)" name="area" rules={[{ required: true, message: "Diện tích là bắt buộc" }]}>
            <InputNumber min={1} style={{ width: "100%" }} placeholder="Nhập diện tích" />
          </Form.Item>
          <Form.Item label="Area Unit" name="area_unit" rules={[{ required: true }]}>
            <Select options={[{ label: "Hectare", value: "hectare" }, { label: "Acre", value: "acre" }]} placeholder="Chọn đơn vị diện tích" />
          </Form.Item>

          {/* Type */}
          <Form.Item label="Yield Type" name="type" rules={[{ required: true }]}>
            <Select options={[{ label: "Trái cây", value: "Trái cây" }, { label: "Rau củ", value: "Rau củ" }]} placeholder="Chọn loại sản lượng" />
          </Form.Item>

          {/* Availability */}
          <Form.Item label="Availability" name="is_available" rules={[{ required: true }]}>
            <Select options={[{ label: "Available", value: "Available" }, { label: "Unavailable", value: "Unavailable" }]} placeholder="Chọn trạng thái" />
          </Form.Item>

          {/* Size */}
          <Form.Item label="Size" name="size" rules={[{ required: true }]}>
            <Select options={[{ label: "Nhỏ", value: "Nhỏ" }, { label: "Vừa", value: "Vừa" }, { label: "Lớn", value: "Lớn" }]} placeholder="Chọn kích thước" />
          </Form.Item>

          <Flex align="center" justify="space-between" style={{ marginTop: 16 }}>
            <Button onClick={onDrawerClose}>Cancel</Button>
            <SaveButton htmlType="submit" type="primary">Save</SaveButton>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
