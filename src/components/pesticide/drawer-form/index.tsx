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
  open: boolean;
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

  const title = props.action === "edit" ? "Edit Pesticide" : "Add Pesticide";

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
                  alt="Pesticide Image"
                />
                <Button icon={<UploadOutlined />} style={{ marginTop: 16 }} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload Image"}
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Enter name!" }]}>
            <Input placeholder="Enter pesticide name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Enter description!" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter pesticide description" />
          </Form.Item>

          <Form.Item
            label="Available Quantity"
            name="available_quantity"
            rules={[{ required: true, message: "Enter available quantity!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter available quantity" />
          </Form.Item>

          <Form.Item
            label="Total Quantity"
            name="total_quantity"
            rules={[{ required: true, message: "Enter total quantity!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter total quantity" />
          </Form.Item>

          <Form.Item label="Unit" name="unit" rules={[{ required: true, message: "Enter unit!" }]}>
            <Input placeholder="ml, l, kg, g" />
          </Form.Item>

          <Form.Item label="Type" name="type" rules={[{ required: true, message: "Enter type!" }]}>
            <Select placeholder="Select type">
              <Select.Option value="Trừ sâu">Trừ sâu</Select.Option>
              <Select.Option value="Trừ nấm">Trừ nấm</Select.Option>
              <Select.Option value="Diệt cỏ">Diệt cỏ</Select.Option>
              <Select.Option value="Trừ rầy">Trừ rầy</Select.Option>
              <Select.Option value="Trừ bọ xít">Trừ bọ xít</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="Available">Available</Select.Option>
              <Select.Option value="UnAvailable">UnAvailable</Select.Option>
            </Select>
          </Form.Item>

          <Flex justify="space-between" style={{ paddingTop: 16 }}>
            <Button onClick={onDrawerClose}>Cancel</Button>
            <SaveButton {...saveButtonProps} htmlType="submit" type="primary">
              Save
            </SaveButton>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
