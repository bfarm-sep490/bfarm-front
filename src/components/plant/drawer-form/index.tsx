import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { type BaseKey, useApiUrl, useGetToPath, useGo } from "@refinedev/core";
import axios from "axios";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Grid,
  Button,
  Flex,
  Avatar,
  Spin,
  message,
  Drawer,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

type Props = {
  id?: BaseKey;
  action: "edit" | "create";
  open?: boolean;
  onClose?: () => void;
  onMutationSuccess?: () => void;
};
export enum PlantType {
  Cruciferous = "Rau họ thập tự",
  Onion = "Hành",
  Leafy = "Rau ăn lá",
  FruitVeg = "Rau ăn quả",
  RootVeg = "Rau ăn củ",
  Mushroom = "Nấm",
  MixedVeg = "Rau củ quả",
  DriedVeg = "Rau khô",
}

export const PlantDrawerForm = (props: Props) => {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } = useDrawerForm<any>({
    resource: "plants",
    id: props?.id,
    action: props.action,
    redirect: false,
    queryOptions: {
      enabled: props.action === "edit",
      onSuccess: (data) => {
        if (data?.data?.image_url) {
          setPreviewImage(data.data.image_url);
          formProps.form.setFieldsValue({
            ...data?.data,
          });
        }
      },
    },
    onMutationSuccess: () => {
      props.onMutationSuccess?.();
    },
  });

  const onDrawerClose = () => {
    close();
    if (props?.onClose) {
      props.onClose();
      return;
    }
    go({
      to: searchParams.get("to") ?? getToPath({ action: "list" }) ?? "",
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  const uploadImage = async ({ onSuccess, onError, file }: any) => {
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const response = await axios.post(`${apiUrl}/plants/images/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status === 200 && response.data.data?.length) {
        const uploadedImageUrl = response.data.data[0];
        setPreviewImage(uploadedImageUrl);
        onSuccess(uploadedImageUrl);
        formProps.form.setFieldValue("image_url", uploadedImageUrl);
      } else {
        throw new Error(response.data.message || "Upload failed.");
      }
    } catch (error) {
      message.error("Image upload failed.");
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Drawer
      {...drawerProps}
      open={true}
      title={props.action === "edit" ? "Chỉnh Sửa" : "Thêm Mới"}
      width={breakpoint.sm ? "400px" : "100%"}
      onClose={onDrawerClose}
    >
      <Spin spinning={formLoading}>
        <Form {...formProps} layout="vertical">
          <Form.Item name="image_url" valuePropName="file">
            <Upload.Dragger
              name="file"
              customRequest={uploadImage}
              maxCount={1}
              accept=".png,.jpg,.jpeg"
              showUploadList={false}
            >
              <Flex vertical align="center" justify="center">
                <Avatar
                  shape="square"
                  src={previewImage || "/images/plant-default-img.png"}
                  alt="Ảnh cây trồng"
                  style={{ width: "100%", height: "100%" }}
                />
                <Button icon={<UploadOutlined />} disabled={uploading} style={{ marginTop: 16 }}>
                  {uploading ? "Đang tải lên..." : "Tải ảnh lên"}
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item
            label="Tên cây trồng"
            name="plant_name"
            rules={[{ required: true, message: "Vui lòng nhập tên cây trồng!" }]}
          >
            <Input placeholder="Nhập tên cây trồng" />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập số lượng" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả" />
          </Form.Item>

          <Form.Item
            label="Giá cơ bản"
            name="base_price"
            rules={[{ required: true, message: "Vui lòng nhập giá cơ bản!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập giá cơ bản" />
          </Form.Item>

          <Form.Item
            label="Loại"
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
          >
            <Select placeholder="Chọn loại cây">
              {Object.values(PlantType).map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Delta 1" name="delta_one">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập Delta 1" />
          </Form.Item>

          <Form.Item label="Delta 2" name="delta_two">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập Delta 2" />
          </Form.Item>

          <Form.Item label="Delta 3" name="delta_three">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập Delta 3" />
          </Form.Item>

          <Form.Item label="Số ngày bảo quản" name="preservation_day">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập số ngày bảo quản" />
          </Form.Item>

          <Form.Item label="Ước lượng theo một đơn vị" name="estimated_per_one">
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Nhập lượng ước tính mỗi đơn vị"
            />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="Available">Có sẵn</Select.Option>
              <Select.Option value="Out of Stock">Hết hàng</Select.Option>
              <Select.Option value="Limited Stock">Còn ít</Select.Option>
            </Select>
          </Form.Item>

          <Flex justify="space-between" style={{ paddingTop: 16 }}>
            <Button onClick={onDrawerClose}>Hủy</Button>
            <SaveButton {...saveButtonProps} htmlType="submit" type="primary">
              Lưu
            </SaveButton>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
