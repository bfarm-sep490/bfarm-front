/* eslint-disable prettier/prettier */
import { SaveButton, useForm } from "@refinedev/antd";
import {
  type BaseKey,
  useGetToPath,
  useGo,
  useTranslate,
} from "@refinedev/core";
import axios from "axios";
import {
  Form,
  Input,
  Select,
  Upload,
  Grid,
  Button,
  Flex,
  Avatar,
  Spin,
} from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { UploadOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";
import { useEffect, useState } from "react";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const FarmerDrawerForm = (props: Props) => {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const breakpoint = Grid.useBreakpoint();
  const { styles, theme } = useStyles();
  const translate = useTranslate();
  const { formProps, saveButtonProps } = useForm<{
    avatar_image: string;
    name: string;
    phone: string;
    email: string;
    status: string;
  }>({
    resource: "farmers",
    id: props?.id,
    action: props.action,
    redirect: false,
    queryOptions: {
      enabled: props.action === "edit",
      onSuccess: (data: any) => {
        setPreviewImage(data?.data?.avatar_image);
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
      const currentAvatar = formProps.form.getFieldValue(
        "avatar_image"
      ) as string;
      if (currentAvatar) {
        setPreviewImage(currentAvatar);
      }
    }
  }, [props.action, formProps.form]);

  const uploadImage = async ({ onSuccess, onError, file }: any) => {
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const response = await axios.post(
        "https://api.outfit4rent.online/api/farmers/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === 200 && response.data.data?.length) {
        const uploadedImageUrl = response.data.data[0];
        setPreviewImage(uploadedImageUrl);
        onSuccess(uploadedImageUrl);
        formProps.form?.setFieldsValue({ avatar_url: uploadedImageUrl });
      } else {
        throw new Error(response.data.message || "Tải ảnh lỗi.");
      }
    } catch (error) {
      console.error("Tải ảnh lỗi:", error);
      onError(error);
    } finally {
      setUploading(false);
    }
  };
  const title =
    props.action === "edit"
      ? translate("form.edit_farmer", "Chỉnh sửa nông dân")
      : translate("form.create_farmer", "Tạo nông dân");
  return (
    <Drawer
      open={true}
      title={title}
      width={breakpoint.sm ? "378px" : "100%"}
      zIndex={1001}
      onClose={onDrawerClose}
    >
      <Form layout="vertical" {...formProps}>
        <Form.Item
          name="avatar_url"
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
                alt="Farmer Image"
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
                {uploading
                  ? translate("images.uploading", "Đang tải ảnh lên...")
                  : translate("images.upload", "Tải ảnh lên")}
              </Button>
            </Flex>
          </Upload.Dragger>
        </Form.Item>
        <Flex vertical>
          <Form.Item
            key={"name"}
            label={translate("farmer_name", "Tên nông dân")}
            name="name"
            className={styles.formItem}
            rules={[
              { required: true, message: "Vui lòng nhập tên!" },
              {
                min: 6,
                max: 50,
                message: "Tên có độ dài 6 đến 50 kí tự!",
              },
            ]}
          >
            <Input name="name" />
          </Form.Item>
          <Form.Item
            key={"phone"}
            label={translate("farmer.phone", "Số điện thoại")}
            name="phone"
            className={styles.formItem}
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                message: "Không phải định dạng số điện thoại",
                min: 10,
                max: 11,
              },
            ]}
          >
            <Input name="phone" />
          </Form.Item>
          <Form.Item
            key={"email"}
            label={translate("farmer.email", "Email")}
            name="email"
            className={styles.formItem}
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
            ]}
          >
            <Input name="email" />
          </Form.Item>
          <Flex
            align="center"
            justify="space-between"
            style={{ padding: "16px 16px 0px 16px" }}
          >
            <Button onClick={onDrawerClose}>
              {translate("form.cancel", "Hủy bỏ")}
            </Button>
            <SaveButton
              {...saveButtonProps}
              htmlType="submit"
              type="primary"
              icon={null}
            >
              {translate("form.save", "Lưu")}
            </SaveButton>
          </Flex>
        </Flex>
      </Form>
    </Drawer>
  );
};
