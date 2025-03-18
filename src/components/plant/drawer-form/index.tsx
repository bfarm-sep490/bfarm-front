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
      title={props.action === "edit" ? "Edit Plant" : "Add Plant"}
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
                  alt="Plant Image"
                  style={{ width: "100%", height: "100%" }}
                />
                <Button icon={<UploadOutlined />} disabled={uploading} style={{ marginTop: 16 }}>
                  {uploading ? "Uploading..." : "Upload Image"}
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item
            label="Plant Name"
            name="plant_name"
            rules={[{ required: true, message: "Enter plant name!" }]}
          >
            <Input placeholder="Enter plant name" />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Enter quantity!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter quantity" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Enter description!" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            label="Base Price"
            name="base_price"
            rules={[{ required: true, message: "Enter base price!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter base price" />
          </Form.Item>
          <Form.Item label="Type" name="type" rules={[{ required: true, message: "Enter type!" }]}>
            <Input placeholder="Enter type" />
          </Form.Item>
          <Form.Item label="Delta One" name="delta_one">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter delta one" />
          </Form.Item>
          <Form.Item label="Delta Two" name="delta_two">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter delta two" />
          </Form.Item>
          <Form.Item label="Delta Three" name="delta_three">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter delta three" />
          </Form.Item>
          <Form.Item label="Preservation Day" name="preservation_day">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter preservation day" />
          </Form.Item>
          <Form.Item label="Estimated Per One" name="estimated_per_one">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter estimated per one" />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Select status!" }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="Available">Available</Select.Option>
              <Select.Option value="Out of Stock">Out of Stock</Select.Option>
              <Select.Option value="Limited Stock">Limited Stock</Select.Option>
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
