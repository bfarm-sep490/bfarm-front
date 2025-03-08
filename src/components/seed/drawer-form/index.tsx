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
  Row,
  Col,
  Typography,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

type Props = {
  id: BaseKey;
  action: "edit" | "create";
  open: boolean;
  onClose: () => void;
  onMutationSuccess: () => void;
};

export const SeedDrawerForm = (props: Props) => {
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
            image_url: data?.data.image_url,
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
      const currentImage = formProps.form.getFieldValue("image_url");
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
      console.error("Upload error:", error);
      message.error("Image upload failed.");
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  const title = props.action === "edit" ? "Edit Seed" : "Add Seed";

  // Nhóm các trường liên quan đến nhiệt độ
  const temperatureFields = ["min_temp", "max_temp"];

  // Nhóm các trường liên quan đến độ ẩm
  const humidityFields = ["min_humid", "max_humid"];

  // Nhóm các trường liên quan đến độ ẩm đất
  const moistureFields = ["min_moisture", "max_moisture"];

  // Nhóm các trường liên quan đến phân bón
  const fertilizerFields = ["min_fertilizer", "max_fertilizer"];

  // Nhóm các trường liên quan đến thuốc trừ sâu
  const pesticideFields = ["min_pesticide", "max_pesticide"];

  // Nhóm các trường liên quan đến độ ngọt
  const brixFields = ["min_brix_point", "max_brix_point"];

  // Hàm format tiêu đề trường và thêm đơn vị phần trăm cho các trường môi trường
  const formatFieldLabel = (field: string) => {
    const formattedField = field
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Thêm kí hiệu % cho các trường độ ẩm và độ ẩm đất
    if (field.includes("humid") || field.includes("moisture")) {
      return `${formattedField} (%)`;
    }

    return formattedField;
  };

  // Đơn vị mặc định
  const unitOptions = [
    { label: "kg", value: "kg" },
    { label: "g", value: "g" },
    { label: "lb", value: "lb" },
    { label: "oz", value: "oz" },
  ];

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
          {/* Upload Image Section */}
          <Form.Item name="image_url" valuePropName="file">
            <Upload.Dragger
              name="file"
              customRequest={uploadImage}
              maxCount={1}
              accept=".png,.jpg,.jpeg"
              showUploadList={false}
            >
              <Flex vertical align="center" justify="center" style={{ padding: "20px 0" }}>
                <Avatar
                  shape="square"
                  style={{
                    aspectRatio: 1,
                    objectFit: "contain",
                    width: previewImage ? "120px" : "80px",
                    height: previewImage ? "120px" : "80px",
                    marginBottom: 16,
                  }}
                  src={previewImage || "/images/seed-default-img.png"}
                  alt="Seed Image"
                />
                <Button icon={<UploadOutlined />} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload Image"}
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>

          {/* Basic Information Section */}
          <Divider orientation="left">Basic Information</Divider>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Plant Name"
                name="plant_name"
                rules={[{ required: true, message: "Enter plant name!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: "Enter quantity!" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Unit"
                name="unit"
                rules={[{ required: true, message: "Enter unit!" }]}
              >
                <Select options={unitOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Enter description!" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Availability" name="is_available" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "Available", value: true },
                { label: "Not Available", value: false },
              ]}
            />
          </Form.Item>

          {/* Environmental Requirements Section */}
          <Divider orientation="left">Environmental Requirements</Divider>

          {/* Temperature Group */}
          <Typography.Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
            Temperature (°C)
          </Typography.Text>
          <Row gutter={16}>
            {temperatureFields.map((field) => (
              <Col span={12} key={field}>
                <Form.Item
                  label={formatFieldLabel(field)}
                  name={field}
                  rules={[
                    {
                      required: true,
                      message: `Enter ${formatFieldLabel(field).toLowerCase()}!`,
                    },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            ))}
          </Row>

          {/* Humidity Group */}
          <Typography.Text
            type="secondary"
            style={{ display: "block", marginBottom: 8, marginTop: 16 }}
          >
            Humidity
          </Typography.Text>
          <Row gutter={16}>
            {humidityFields.map((field) => (
              <Col span={12} key={field}>
                <Form.Item
                  label={formatFieldLabel(field)}
                  name={field}
                  rules={[
                    {
                      required: true,
                      message: `Enter ${field.split("_").join(" ")}!`,
                    },
                  ]}
                >
                  <InputNumber min={0} max={100} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            ))}
          </Row>

          {/* Moisture Group */}
          <Typography.Text
            type="secondary"
            style={{ display: "block", marginBottom: 8, marginTop: 16 }}
          >
            Soil Moisture
          </Typography.Text>
          <Row gutter={16}>
            {moistureFields.map((field) => (
              <Col span={12} key={field}>
                <Form.Item
                  label={formatFieldLabel(field)}
                  name={field}
                  rules={[
                    {
                      required: true,
                      message: `Enter ${field.split("_").join(" ")}!`,
                    },
                  ]}
                >
                  <InputNumber min={0} max={100} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            ))}
          </Row>

          {/* Fertilizer Group */}
          <Divider orientation="left">Fertilizer</Divider>
          <Row gutter={16}>
            {fertilizerFields.map((field) => (
              <Col span={12} key={field}>
                <Form.Item
                  label={formatFieldLabel(field)}
                  name={field}
                  rules={[
                    {
                      required: true,
                      message: `Enter ${formatFieldLabel(field).toLowerCase()}!`,
                    },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            ))}
          </Row>

          <Form.Item
            label="Fertilizer Unit"
            name="fertilizer_unit"
            rules={[{ required: true, message: "Select fertilizer unit!" }]}
          >
            <Select
              options={[
                { label: "kg", value: "kg" },
                { label: "ha", value: "ha" },
              ]}
            />
          </Form.Item>

          {/* Pesticide Group */}
          <Divider orientation="left">Pesticide</Divider>
          <Row gutter={16}>
            {pesticideFields.map((field) => (
              <Col span={12} key={field}>
                <Form.Item
                  label={formatFieldLabel(field)}
                  name={field}
                  rules={[
                    {
                      required: true,
                      message: `Enter ${formatFieldLabel(field).toLowerCase()}!`,
                    },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            ))}
          </Row>

          <Form.Item
            label="Pesticide Unit"
            name="pesticide_unit"
            rules={[{ required: true, message: "Select pesticide unit!" }]}
          >
            <Select
              options={[
                { label: "ml", value: "ml" },
                { label: "l", value: "l" },
              ]}
            />
          </Form.Item>

          {/* Brix Points Group */}
          <Divider orientation="left">Brix Points</Divider>
          <Row gutter={16}>
            {brixFields.map((field) => (
              <Col span={12} key={field}>
                <Form.Item
                  label={formatFieldLabel(field)}
                  name={field}
                  rules={[
                    {
                      required: true,
                      message: `Enter ${formatFieldLabel(field).toLowerCase()}!`,
                    },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            ))}
          </Row>

          {/* Other Settings */}
          <Divider orientation="left">Other Settings</Divider>
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

          {/* Form Actions */}
          <Flex justify="space-between" style={{ marginTop: 24 }}>
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
