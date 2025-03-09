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

type Props = {
  id?: BaseKey;
  action: "edit" | "create";
  open?: boolean;
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const ItemDrawerForm = (props: Props) => {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } = useDrawerForm<any>({
    resource: "items",
    id: props?.id,
    action: props.action,
    redirect: false,
    queryOptions: {
      enabled: props.action === "edit",
      onSuccess: (data) => {
        if (data?.data?.image) {
          console.log("Fetched data:", data);
          setPreviewImage(data.data.image);
          formProps.form.setFieldsValue({
            ...data?.data,
            image_url: data?.data.image,
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
      const response = await axios.post(`${apiUrl}/items/images/upload`, formData, {
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
      console.error("Upload error:", error);
      message.error("Image upload failed.");
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  const title = props.action === "edit" ? "Edit Item" : "Add Item";

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
                  style={{
                    aspectRatio: 1,
                    objectFit: "contain",
                    width: previewImage ? "100%" : "80px",
                    height: previewImage ? "100%" : "80px",
                  }}
                  src={previewImage || "/images/item-default-img.png"}
                  alt="Item Image"
                />
                <Button icon={<UploadOutlined />} style={{ marginTop: 16 }} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload Image"}
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Enter name!" }]}>
            <Input placeholder="Enter item name" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Enter description!" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter item description" />
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Enter quantity!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter quantity" />
          </Form.Item>

          <Form.Item label="Unit" name="unit" rules={[{ required: true, message: "Enter unit!" }]}>
            <Input placeholder="cái, hộp, máy, giỏ" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Select status!" }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="In-stock">In-stock</Select.Option>
              <Select.Option value="Out-stock">Out-stock</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Type" name="type" rules={[{ required: true, message: "Select type!" }]}>
            <Select placeholder="Select type">
              <Select.Option value="Packaging">Packaging</Select.Option>
              <Select.Option value="Caring">Caring</Select.Option>
              <Select.Option value="Harvesting">Harvesting</Select.Option>
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
