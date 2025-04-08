/* eslint-disable prettier/prettier */
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
import { useTranslation } from "react-i18next";

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

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<any>({
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
      const response = await axios.post(
        `${apiUrl}/items/images/upload`,
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
      console.error("Upload error:", error);
      message.error("Image upload failed.");
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  const { t } = useTranslation();

  const title = props.action === "edit" ? t("items.edit") : t("items.add");

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
                  alt={t("items.imageAlt")}
                />
                <Button
                  icon={<UploadOutlined />}
                  style={{ marginTop: 16 }}
                  disabled={uploading}
                >
                  {uploading ? t("items.uploading") : t("items.upload")}
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item
            label={t("items.name")}
            name="name"
            rules={[{ required: true, message: t("items.nameRequired") }]}
          >
            <Input placeholder={t("items.namePlaceholder")} />
          </Form.Item>

          <Form.Item
            label={t("items.description")}
            name="description"
            rules={[
              { required: true, message: t("items.descriptionRequired") },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder={t("items.descriptionPlaceholder")}
            />
          </Form.Item>

          <Form.Item
            label={t("items.quantity")}
            name="quantity"
            rules={[{ required: true, message: t("items.quantityRequired") }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder={t("items.quantityPlaceholder")}
            />
          </Form.Item>

          <Form.Item
            label={t("items.unit")}
            name="unit"
            rules={[{ required: true, message: t("items.unitRequired") }]}
          >
            <Input placeholder={t("items.unitPlaceholder")} />
          </Form.Item>

          <Form.Item
            label={t("items.status")}
            name="status"
            rules={[{ required: true, message: t("items.statusRequired") }]}
          >
            <Select placeholder={t("items.statusPlaceholder")}>
              <Select.Option value="Active">
                {t("items.statusActive")}
              </Select.Option>
              <Select.Option value="In-stock">
                {t("items.statusInStock")}
              </Select.Option>
              <Select.Option value="Out-stock">
                {t("items.statusOutStock")}
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={t("items.type")}
            name="type"
            rules={[{ required: true, message: t("items.typeRequired") }]}
          >
            <Select placeholder={t("items.typePlaceholder")}>
              <Select.Option value="Packaging">
                {t("items.typePackaging")}
              </Select.Option>
              <Select.Option value="Caring">
                {t("items.typeCaring")}
              </Select.Option>
              <Select.Option value="Harvesting">
                {t("items.typeHarvesting")}
              </Select.Option>
            </Select>
          </Form.Item>

          <Flex justify="space-between" style={{ paddingTop: 16 }}>
            <Button onClick={onDrawerClose}>{t("actions.cancel")}</Button>
            <SaveButton {...saveButtonProps} htmlType="submit" type="primary">
              {t("buttons.save")}
            </SaveButton>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
