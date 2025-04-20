/* eslint-disable prettier/prettier */
import { SaveButton, useDrawerForm } from "@refinedev/antd";
import {
  type BaseKey,
  useApiUrl,
  useGetToPath,
  useGo,
  useList,
} from "@refinedev/core";
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
  Modal,
  Select,
  Row,
  Col,
  Card,
  Divider,
  Typography,
  SelectProps,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { PlantType } from "../plant-type";

import { useTranslation } from "react-i18next";

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

  const { formProps, close, saveButtonProps, formLoading } = useDrawerForm<any>(
    {
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
    }
  );
  const onModalClose = () => {
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
      const response = await axios.post(
        `${apiUrl}/plants/images/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
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

  const { t } = useTranslation();

  return (
    <Card title="Thêm giống cây trồng">
      <Spin spinning={formLoading}>
        <Form {...formProps} layout="vertical">
          <Typography.Title level={5} style={{ marginBottom: 16 }}>
            Thông tin cơ bản
          </Typography.Title>
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
                  alt={t("plant.imageAlt")}
                  style={{ width: "40%", height: "50%" }}
                />
                <Button
                  icon={<UploadOutlined />}
                  disabled={uploading}
                  style={{ marginTop: 16 }}
                >
                  {uploading ? t("plant.uploading") : t("plant.upload")}
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>
          <Flex vertical={!breakpoint.sm} gap={10}>
            <Form.Item
              style={{ width: !breakpoint.sm ? "100%" : "50%" }}
              label={t("plant.name")}
              name="plant_name"
              rules={[{ required: true, message: t("plant.nameRequired") }]}
            >
              <Input placeholder={t("plant.namePlaceholder")} />
            </Form.Item>
            <Form.Item
              style={{ width: !breakpoint.sm ? "100%" : "50%" }}
              label={t("plant.type")}
              name="type"
              rules={[{ required: true, message: t("plant.typeRequired") }]}
            >
              <Select placeholder={t("plant.typePlaceholder")}>
                {Object.values(PlantType).map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Flex>
          <Flex vertical={!breakpoint.sm} gap={10}>
            <Form.Item
              style={{ width: !breakpoint.sm ? "100%" : "50%" }}
              label={t("plant.quantity")}
              name="quantity"
              rules={[{ required: true, message: t("plant.quantityRequired") }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder={t("plant.quantityPlaceholder")}
              />
            </Form.Item>
            <Form.Item
              style={{ width: !breakpoint.sm ? "100%" : "50%" }}
              label={t("plant.basePrice")}
              name="base_price"
              rules={[
                { required: true, message: t("plant.basePriceRequired") },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder={t("plant.basePricePlaceholder")}
              />
            </Form.Item>
          </Flex>

          <Form.Item label={t("plant.preservationDay")} name="preservation_day">
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder={t("plant.preservationDayPlaceholder")}
            />
          </Form.Item>
          <Form.Item
            label={t("plant.description")}
            name="description"
            rules={[
              { required: true, message: t("plant.descriptionRequired") },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder={t("plant.descriptionPlaceholder")}
            />
          </Form.Item>
          <Divider />
          <Typography.Title level={5} style={{ marginBottom: 16 }}>
            Tỉ lệ giá
          </Typography.Title>
          <Form.Item
            label={t("plant.deltaOne")}
            name="delta_one"
            rules={[{ required: true, message: "Vui lòng nhập tỉ lệ 1" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder={t("plant.deltaOnePlaceholder")}
            />
          </Form.Item>
          
          <Form.Item
            label={t("plant.deltaTwo")}
            name="delta_two"
            rules={[{ required: true, message: "Vui lòng nhập tỉ lệ 2" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder={t("plant.deltaTwoPlaceholder")}
            />
          </Form.Item>

          <Form.Item
            label={t("plant.deltaThree")}
            name="delta_three"
            rules={[{ required: true, message: "Vui lòng nhập tỉ lệ 3" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder={t("plant.deltaThreePlaceholder")}
            />
          </Form.Item>
          <Divider />
          <Form.Item
            label={t("plant.status")}
            name="status"
            rules={[{ required: true, message: t("plant.statusRequired") }]}
            style={{ display: "flex", alignItems: "center", width: "100%" }}
          >
            <Select
              placeholder={t("plant.statusPlaceholder")}
              style={{ width: "100%" }}
            >
              <Select.Option value="Available">Khả dụng</Select.Option>
              <Select.Option value="Unavailable">Không khả dụng</Select.Option>
            </Select>
          </Form.Item>

          <Flex justify="space-between" style={{ paddingTop: 16 }}>
            <Button onClick={onModalClose}>{t("actions.cancel")}</Button>

            <SaveButton {...saveButtonProps} htmlType="submit" type="primary">
              {t("buttons.save")}
            </SaveButton>
          </Flex>
        </Form>
      </Spin>
    </Card>
  );
};
