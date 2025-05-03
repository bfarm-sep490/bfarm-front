import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { type BaseKey, useGetToPath, useGo } from "@refinedev/core";
import { Form, Input, Select, Upload, Grid, Button, Flex, Avatar, Spin } from "antd";
import { useParams, useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { UploadOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "@/rest-data-provider/utils";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const InspectorDrawerForm = (props: Props) => {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const { id } = useParams();
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const breakpoint = Grid.useBreakpoint();
  const { styles, theme } = useStyles();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } = useDrawerForm<{
    avatar_image: string;
    name: string;
    phone: string;
    email: string;
    status: string;
  }>({
    resource: "inspectors",
    id,
    action: props.action,
    redirect: false,
    queryOptions: {
      enabled: props.action === "edit",
      onSuccess: (data: any) => {
        if (data?.data?.image_url) {
          setPreviewImage(data?.data?.image_url);
        }
        formProps.form.setFieldsValue(data?.data);
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
      const currentAvatar = formProps.form.getFieldValue("image_url") as string;
      console.log("currentAvatar: " + currentAvatar);
      if (currentAvatar) {
        setPreviewImage(currentAvatar);
      }
    }
  }, [props.action, formProps.form]);

  const uploadImage = async ({ onSuccess, onError, file, onProgress }: any) => {
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const response = await axiosInstance.post(
        "https://api.bfarmx.space/api/farmers/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.status === 200 && response.data.data?.length) {
        const uploadedImageUrl = response.data.data[0];
        setPreviewImage(uploadedImageUrl);
        onSuccess(uploadedImageUrl);
        formProps.form?.setFieldsValue({ avatar_image: uploadedImageUrl });
      } else {
        throw new Error(response.data.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      onError(error);
    } finally {
      setUploading(false);
    }
  };
  const { t } = useTranslation();
  const title = props.action === "edit" ? t("title.edit") : t("title.create");

  const statusOptions = [
    { label: "Active", value: "Hoạt động" },
    { label: "Inactive", value: "Không hoạt động" },
  ];

  return (
    <Drawer
      {...drawerProps}
      open={true}
      title={title}
      width={breakpoint.sm ? "378px" : "100%"}
      zIndex={1001}
      onClose={onDrawerClose}
    >
      <Spin spinning={formLoading}>
        <Form
          form={formProps?.form}
          layout="vertical"
          onFinish={formProps?.onFinish}
          onValuesChange={formProps?.onValuesChange}
        >
          <Form.Item
            name="image_url"
            valuePropName="file"
            getValueFromEvent={(e: any) => {
              return e?.file?.response ?? "/images/fertilizer-default-img.png";
            }}
            style={{ margin: 0 }}
          >
            <Upload.Dragger
              name="file"
              customRequest={uploadImage}
              maxCount={1}
              accept=".png,.jpg,.jpeg"
              className={styles.uploadDragger}
              showUploadList={false}
            >
              <Flex
                vertical
                align="center"
                justify="center"
                style={{ position: "relative", height: "100%" }}
              >
                <Avatar
                  shape="square"
                  style={{
                    aspectRatio: 1,
                    objectFit: "contain",
                    width: previewImage ? "100%" : "48px",
                    height: previewImage ? "100%" : "48px",
                    marginTop: previewImage ? undefined : "auto",
                    transform: previewImage ? undefined : "translateY(50%)",
                  }}
                  src={previewImage || "/images/fertilizer-default-img.png"}
                  alt={t("inspector.avatar")}
                />
                <Button
                  icon={<UploadOutlined />}
                  style={{
                    marginTop: "auto",
                    marginBottom: "16px",
                    backgroundColor: theme.colorBgContainer,
                  }}
                  disabled={uploading}
                >
                  {uploading ? t("inspectors.uploading") : t("inspectors.uploadImage")}
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>
          <Flex vertical>
            <Form.Item
              key="name"
              label={t("inspectors.name")}
              name="name"
              className={styles.formItem}
              rules={[
                { required: true, message: t("inspectors.messages.nameRequired") },
                {
                  min: 6,
                  max: 50,
                  message: t("inspectors.messages.nameLength"),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              key="address"
              label={t("inspectors.address")}
              name="address"
              className={styles.formItem}
              rules={[{ required: true, message: t("messages.addressRequired") }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              key="phone"
              label={t("inspectors.phone")}
              name="phone"
              className={styles.formItem}
              rules={[
                { required: true, message: t("messages.phoneRequired") },
                {
                  message: t("messages.phoneInvalid"),
                  min: 10,
                  max: 11,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              key="email"
              label={t("inspectors.email")}
              name="email"
              className={styles.formItem}
              rules={[
                { required: true, message: t("messages.emailRequired") },
                { type: "email", message: t("messages.emailInvalid") },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              key="status"
              label={t("inspectors.status")}
              name="status"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select options={statusOptions} />
            </Form.Item>
            <Flex align="center" justify="space-between" style={{ padding: "16px 16px 0px 16px" }}>
              <Button onClick={onDrawerClose}>{t("actions.cancel")}</Button>
              <SaveButton {...saveButtonProps} htmlType="submit" type="primary" icon={null}>
                {t("buttons.save")}
              </SaveButton>
            </Flex>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
