import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { type BaseKey, useApiUrl, useGetToPath, useGo, useTranslate } from "@refinedev/core";
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
import { axiosInstance } from "@/rest-data-provider/utils";

type Props = {
  id?: BaseKey;
  action: "edit" | "create";
  open?: boolean;
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const FertilizerDrawerForm = (props: Props) => {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } = useDrawerForm<any>({
    resource: "fertilizers",
    id: props?.id,
    action: props.action,
    redirect: false,
    queryOptions: {
      enabled: props.action === "edit",
      onSuccess: (data) => {
        if (data?.data?.image) {
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
      const response = await axiosInstance.post(`${apiUrl}/fertilizers/images/upload`, formData, {
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
  const t = useTranslate();
  const title = props.action === "edit" ? t("title.edit") : t("title.create");

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
                  src={previewImage || "/images/fertilizer-default-img.png"}
                  alt="Ảnh phan bón"
                />
                <Button icon={<UploadOutlined />} style={{ marginTop: 16 }} disabled={uploading}>
                  {uploading
                    ? t("fertilizers.fields.uploading", "Đang tải lên...")
                    : t("fertilizers.fields.upload", "Tải ảnh lên")}
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item
            label={t("fertilizers.fields.name", "Tên phân bón")}
            name="name"
            rules={[
              {
                required: true,
                message: t("fertilizers.fields.name_required", "Vui lòng nhập tên!"),
              },
            ]}
          >
            <Input placeholder={t("fertilizers.fields.name_placeholder", "Nhập tên phân bón")} />
          </Form.Item>

          <Form.Item
            label={t("fertilizers.fields.description", "Mô tả")}
            name="description"
            rules={[
              {
                required: true,
                message: t("fertilizers.fields.description_required", "Vui lòng nhập mô tả!"),
              },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder={t("fertilizers.fields.description_placeholder", "Nhập mô tả phân bón")}
            />
          </Form.Item>

          <Form.Item
            label={t("fertilizers.fields.quantity", "Số lượng")}
            name="quantity"
            rules={[
              {
                required: true,
                message: t("fertilizers.fields.quantity_required", "Vui lòng nhập số lượng!"),
              },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder={t("fertilizers.fields.quantity_placeholder", "Nhập số lượng")}
            />
          </Form.Item>

          <Form.Item
            label={t("fertilizers.fields.unit", "Đơn vị")}
            name="unit"
            rules={[
              {
                required: true,
                message: t("fertilizers.fields.unit_required", "Vui lòng nhập đơn vị!"),
              },
            ]}
          >
            <Input placeholder={t("fertilizers.fields.unit_placeholder", "kg, lít, bao, v.v.")} />
          </Form.Item>

          <Form.Item
            label={t("fertilizers.fields.status", "Trạng thái")}
            name="status"
            rules={[
              {
                required: true,
                message: t("fertilizers.fields.status_required", "Vui lòng chọn trạng thái!"),
              },
            ]}
          >
            <Select placeholder={t("fertilizers.fields.status_placeholder", "Chọn trạng thái")}>
              <Select.Option value="Available">
                {t("fertilizers.status.available", "Đang sử dụng")}
              </Select.Option>
              <Select.Option value="Out of Stock">
                {t("fertilizers.status.out", "Hết hàng")}
              </Select.Option>
              <Select.Option value="Limited Stock">
                {t("fertilizers.status.limited", "Còn ít")}
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={t("fertilizers.fields.type", "Loại")}
            name="type"
            rules={[
              {
                required: true,
                message: t("fertilizers.fields.type_required", "Vui lòng chọn loại!"),
              },
            ]}
          >
            <Select placeholder={t("fertilizers.fields.type_placeholder", "Chọn loại")}>
              <Select.Option value="Organic">
                {t("fertilizers.type.organic", "Hữu cơ")}
              </Select.Option>
              <Select.Option value="Chemical">
                {t("fertilizers.type.chemical", "Hóa học")}
              </Select.Option>
              <Select.Option value="Mineral">
                {t("fertilizers.type.mineral", "Khoáng")}
              </Select.Option>
            </Select>
          </Form.Item>

          <Flex justify="space-between" style={{ paddingTop: 16 }}>
            <Button onClick={onDrawerClose}>{t("buttons.cancel", "Hủy")}</Button>

            <SaveButton {...saveButtonProps} htmlType="submit" type="primary">
              {t("buttons.save", "Lưu")}
            </SaveButton>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
