import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { type BaseKey, useApiUrl, useGetToPath, useGo } from "@refinedev/core";
import axios from "axios";
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
  Drawer,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { IPesticide } from "@/interfaces";

type Props = {
  id?: BaseKey;
  action?: "edit" | "create";
  open?: boolean;
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const PesticideDrawerForm = (props: Props) => {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } = useDrawerForm<IPesticide>(
    {
      resource: "pesticides",
      id: props?.id,
      action: props.action ?? "create",
      redirect: false,
      queryOptions: {
        enabled: props.action === "edit",
        onSuccess: (data) => {
          if (data?.data?.image) {
            setPreviewImage(data.data.image);
          }
          formProps.form.setFieldsValue(data?.data);
        },
      },
      onMutationSuccess: () => {
        props.onMutationSuccess?.();
      },
    },
  );

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

  useEffect(() => {
    if (props.action === "edit" && formProps.form) {
      const currentImage = formProps.form.getFieldValue("image");
      if (currentImage) {
        setPreviewImage(currentImage);
      }
    }
  }, [props.action, formProps.form]);

  const uploadImage = async ({ onSuccess, onError, file }: any) => {
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const response = await axios.post(`${apiUrl}/pesticides/images/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === 200 && response.data.data?.length) {
        const uploadedImageUrl = response.data.data[0];
        setPreviewImage(uploadedImageUrl);
        onSuccess(uploadedImageUrl);
        formProps.form.setFieldValue("image", uploadedImageUrl);
      } else {
        throw new Error(response.data.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Image upload failed.");
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  const title = props.action === "edit" ? "Chỉnh Sửa" : "Thêm Mới";

  return (
    <Drawer
      {...drawerProps}
      open={true}
      title={title}
      width={breakpoint.sm ? "400px" : "100%"}
      onClose={onDrawerClose}
    >
      <Spin spinning={formLoading}>
        <Form
          form={formProps?.form}
          layout="vertical"
          onFinish={formProps?.onFinish}
          onValuesChange={formProps?.onValuesChange}
        >
          <Form.Item name="image" valuePropName="file">
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
                  style={{
                    aspectRatio: 1,
                    objectFit: "contain",
                    width: previewImage ? "100%" : "80px",
                    height: previewImage ? "100%" : "80px",
                  }}
                  src={previewImage || "/images/pesticide-default-img.png"}
                  alt="Ảnh thuốc trừ sâu"
                />
                <Button icon={<UploadOutlined />} style={{ marginTop: 16 }} disabled={uploading}>
                  {uploading ? "Đang tải lên..." : "Tải ảnh lên"}
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item
            label="Tên thuốc"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input placeholder="Nhập tên thuốc trừ sâu" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả thuốc trừ sâu" />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập tổng số lượng" />
          </Form.Item>

          <Form.Item
            label="Đơn vị"
            name="unit"
            rules={[{ required: true, message: "Vui lòng nhập đơn vị!" }]}
          >
            <Input placeholder="ml, l, kg, g" />
          </Form.Item>

          <Form.Item
            label="Loại"
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
          >
            <Select placeholder="Chọn loại">
              <Select.Option value="Organic">Hữu cơ</Select.Option>
              <Select.Option value="Chemical">Hóa học</Select.Option>
              <Select.Option value="Mineral">Khoáng chất</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="Limited Stock">Còn ít</Select.Option>
              <Select.Option value="Out of Stock">Hết hàng</Select.Option>
              <Select.Option value="Available">Có sẵn</Select.Option>
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
