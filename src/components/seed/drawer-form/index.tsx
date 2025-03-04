import { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Grid,
  Button,
  Flex,
  Avatar,
  Spin,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Drawer } from "../../drawer";
import { SaveButton } from "@refinedev/antd";
import { axiosClient } from "@/lib/api/config/axios-client";
import { useGetToPath, useGo } from "@refinedev/core";
import { useSearchParams } from "react-router";
import axios from "axios";
import { ISeed } from "@/interfaces";

type Props = {
  id?: string;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: (updatedPlant: ISeed, isNew: boolean) => void;
};



export const SeedDrawerForm = ({ id, action, onClose, onMutationSuccess }: Props) => {
  const [form] = Form.useForm();
  const breakpoint = Grid.useBreakpoint();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();

  useEffect(() => {
    if (id && action === "edit") {
      fetchPlantDetails();
    }
  }, [id, action]);

  const fetchPlantDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`/api/plants/${id}`);
      if (response.data.status === 200) {
        const plantData = response.data.data;

        console.log("🚀 Dữ liệu lấy từ API:", plantData);

        form.setFieldsValue({
          plant_name: plantData.plant_name,
          description: plantData.description,
          quantity: plantData.quantity,
          unit: plantData.unit,
          min_temp: plantData.min_temp,
          max_temp: plantData.max_temp,
          min_humid: plantData.min_humid,
          max_humid: plantData.max_humid,
          min_moisture: plantData.min_moisture,
          max_moisture: plantData.max_moisture,
          min_brix_point: plantData.min_brix_point,
          max_brix_point: plantData.max_brix_point,

          // ✅ Thêm Fertilizer
          min_fertilizer: plantData.min_fertilizer,
          max_fertilizer: plantData.max_fertilizer,
          fertilizer_unit: plantData.fertilizer_unit,

          // ✅ Thêm Pesticide
          min_pesticide: plantData.min_pesticide,
          max_pesticide: plantData.max_pesticide,
          pesticide_unit: plantData.pesticide_unit,

          gt_test_kit_color: plantData.gt_test_kit_color,
          is_available: plantData.is_available ? "Available" : "Not Available",
        });

        setImageUrl(plantData.image_url);
      } else {
        message.error("Không thể tải thông tin cây trồng.");
      }
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };


  const handleUpload = async ({ file }: any) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axiosClient.post("/api/plants/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === 200) {
        setImageUrl(response.data.image_url);
        form.setFieldsValue({ image_url: response.data.image_url });
        message.success("Tải ảnh lên thành công!");
      } else {
        message.error("Lỗi khi tải ảnh lên.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Lỗi từ server:", error.response?.data || error.message);
      } else {
        console.error("Lỗi từ server:", error);
      }
      const errorMessage = (error as any).response?.data?.message || "Lỗi không xác định. Vui lòng kiểm tra lại.";
      message.error(errorMessage);
    }
  };
  const validateMinMax = (minField: string, maxField: string, label: string) => {
    const minValue = Number(form.getFieldValue(minField));
    const maxValue = Number(form.getFieldValue(maxField));

    console.log(`Kiểm tra ${label}: Min = ${minValue}, Max = ${maxValue}`);

    if (isNaN(minValue) || isNaN(maxValue)) {
      message.error(`${label}: Dữ liệu không hợp lệ!`);
      return false;
    }

    if (maxValue <= minValue) {
      message.error(`${label}: Giá trị Max phải lớn hơn Min!`);
      return false;
    }

    return true;
  };
  const onFinish = async (values: any) => {
    setLoading(true);
    const payload = {
        id,
        plant_name: values.plant_name?.trim() || "Unnamed Plant",
        description: values.description?.trim() || "No description",
        is_available: values.is_available === "Available",
        quantity: Number(values.quantity) || 0,
        unit: values.unit || "unit",
        min_temp: Number(values.min_temp),
        max_temp: Number(values.max_temp),
        min_humid: Number(values.min_humid),
        max_humid: Number(values.max_humid),
        min_moisture: Number(values.min_moisture),
        max_moisture: Number(values.max_moisture),
        min_brix_point: Number(values.min_brix_point),
        max_brix_point: Number(values.max_brix_point),
        min_fertilizer: Number(values.min_fertilizer),
        max_fertilizer: Number(values.max_fertilizer),
        min_pesticide: Number(values.min_pesticide),
        max_pesticide: Number(values.max_pesticide),
        fertilizer_unit: values.fertilizer_unit || "kg",
        pesticide_unit: values.pesticide_unit || "ml",
        gt_test_kit_color: values.gt_test_kit_color || "Green",
        image_url: imageUrl || "https://example.com/default-image.jpg",
    };

    try {
        let response;
        let isNew = action !== "edit"; 
        if (action === "edit") {
            response = await axiosClient.put(`/api/plants/${id}`, payload);
        } else {
            response = await axiosClient.post("/api/plants", payload);
        }

        if (response.data.status === 200) {
            message.success(action === "edit" ? "Cập nhật thành công!" : "Tạo mới thành công!");

            // ✅ Gọi `onMutationSuccess` để cập nhật UI ngay lập tức
            onMutationSuccess?.(response.data.data, isNew);

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


  // Hàm kiểm tra cho Form.Item rules
  const validateMaxField = (minField: string) => ({
    validator(_: any, value: any) {
      const minValue = form.getFieldValue(minField);
      if (minValue !== undefined && value !== undefined && value <= minValue) {
        return Promise.reject(new Error(`Giá trị (max) phải lớn hơn giá trị (min)`));
      }
      return Promise.resolve();
    },
  });

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
    <Drawer open={true} title={action === "edit" ? "Edit Plant" : "Add Plant"} width={breakpoint.sm ? "400px" : "100%"} onClose={onDrawerClose}>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Image Upload */}
          <Form.Item label="Image">
            <Upload.Dragger name="file" beforeUpload={() => false} maxCount={1} accept="image/*" customRequest={handleUpload} showUploadList={false}>
              <Flex vertical align="center" justify="center">
                <Avatar shape="square" size={120} src={imageUrl || "/images/plant-default-img.png"} />
                <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>Upload Image</Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>

          {/* Text Inputs */}
          <Form.Item label="Plant Name" name="plant_name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true }]}><Input.TextArea rows={3} /></Form.Item>
          <Form.Item label="Quantity" name="quantity" rules={[{ required: true }]}><InputNumber /></Form.Item>
          <Form.Item label="Unit" name="unit" rules={[{ required: true }]}><Input /></Form.Item>
          {/* Select Fields */}
          <Form.Item label="Availability" name="is_available" rules={[{ required: true }]}><Select options={[{ label: "Available", value: "Available" }, { label: "Not Available", value: "Not Available" }]} /></Form.Item>

          {/* Temperature */}
          <Form.Item label="Temperature">
            <Flex gap={8}>
              <Form.Item name="min_temp" noStyle>
                <InputNumber placeholder="Min" />
              </Form.Item>
              <Form.Item name="max_temp" noStyle rules={[validateMaxField("min_temp")]}>
                <InputNumber placeholder="Max" />
              </Form.Item>
            </Flex>
          </Form.Item>

          {/* Humidity */}
          <Form.Item label="Humidity">
            <Flex gap={8}>
              <Form.Item name="min_humid" noStyle>
                <InputNumber placeholder="Min" />
              </Form.Item>
              <Form.Item name="max_humid" noStyle rules={[validateMaxField("min_humid")]}>
                <InputNumber placeholder="Max" />
              </Form.Item>
            </Flex>
          </Form.Item>

          {/* Moisture */}
          <Form.Item label="Moisture">
            <Flex gap={8}>
              <Form.Item name="min_moisture" noStyle>
                <InputNumber placeholder="Min" />
              </Form.Item>
              <Form.Item name="max_moisture" noStyle rules={[validateMaxField("min_moisture")]}>
                <InputNumber placeholder="Max" />
              </Form.Item>
            </Flex>
          </Form.Item>

          {/* Brix Point */}
          <Form.Item label="Brix Point">
            <Flex gap={8}>
              <Form.Item name="min_brix_point" noStyle>
                <InputNumber placeholder="Min" />
              </Form.Item>
              <Form.Item name="max_brix_point" noStyle rules={[validateMaxField("min_brix_point")]}>
                <InputNumber placeholder="Max" />
              </Form.Item>
            </Flex>
          </Form.Item>

          {/* Fertilizer - with kg or ha options */}
          <Form.Item label="Fertilizer">
            <Flex gap={8}>
              <Form.Item name="min_fertilizer" noStyle>
                <InputNumber placeholder="Min" />
              </Form.Item>
              <Form.Item name="max_fertilizer" noStyle rules={[validateMaxField("min_fertilizer")]}>
                <InputNumber placeholder="Max" />
              </Form.Item>
              <Form.Item name="fertilizer_unit" noStyle>
                <Select
                  style={{ width: 80 }}
                  options={[
                    { label: "kg", value: "kg" },
                    { label: "ha", value: "ha" },
                  ]}
                  placeholder="Unit"
                />
              </Form.Item>
            </Flex>
          </Form.Item>

          {/* Pesticide */}
          <Form.Item label="Pesticide">
            <Flex gap={8}>
              <Form.Item name="min_pesticide" noStyle>
                <InputNumber placeholder="Min" />
              </Form.Item>
              <Form.Item name="max_pesticide" noStyle rules={[validateMaxField("min_pesticide")]}>
                <InputNumber placeholder="Max" />
              </Form.Item>
              <Form.Item name="pesticide_unit" noStyle>
                <Select
                  style={{ width: 80 }}
                  options={[
                    { label: "L", value: "L" },
                    { label: "ml", value: "ml" },
                  ]}
                  placeholder="Unit"
                />
              </Form.Item>
            </Flex>
          </Form.Item>

          {/* GT Test Kit Color */}
          <Form.Item label="GT Test Kit Color" name="gt_test_kit_color">
            <Select
              options={[
                { label: "Green", value: "Green" },
                { label: "Yellow", value: "Yellow" },
                { label: "Red", value: "Red" },
                { label: "Orange", value: "Orange" },
              ]}
            />
          </Form.Item>
          <Flex align="center" justify="space-between">
            <Button onClick={onDrawerClose}>Cancel</Button>
            <SaveButton htmlType="submit" type="primary">Save</SaveButton>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
