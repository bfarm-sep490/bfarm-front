import { SaveButton, useDrawerForm } from "@refinedev/antd";
import {
  type BaseKey,
  useApiUrl,
  useGetToPath,
  useGo,
  useTranslate,
} from "@refinedev/core";
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
  DatePicker,
  message,
} from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { UploadOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";
import { IExpert, IFertilizer } from "@/interfaces";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { before, set } from "lodash";
import moment from "moment";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const ExpertDrawerForm = (props: Props) => {
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();
  const { styles, theme } = useStyles();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<any>({
      resource: "experts",
      id: props?.id,
      action: props.action,
      redirect: false,
      queryOptions: {
        enabled: props.action === "edit",
        onSuccess: (data) => {
          if (data?.data?.[0]?.avatar_image) {
            setPreviewImage(data?.data?.[0]?.avatar_image);
          }
          formProps.form.setFieldsValue(data?.data?.[0]);
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
      const currentAvatar = formProps.form.getFieldValue("avatar");
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
      const response = await axios.post(
        "https://api.outfit4rent.online/api/experts/images/upload",
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
        formProps.form.setFieldValue("avatar_image", uploadedImageUrl);
        console.log("Server response:", response.data);
      } else {
        throw new Error(response.data.message || "Tải ảnh lỗi.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      onError(error);
    } finally {
      setUploading(false);
    }
  };
  const title =
    props.action === "edit"
      ? t("form.edit_expert", "Chỉnh sửa chuyên gia")
      : t("form.add_expert", "Thêm chuyên gia");

  const statusOptions = [
    { label: "Hoạt động", value: "Active" },
    { label: "Không hoạt động", value: "Inactive" },
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
            name="avatar_image"
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
                  alt="Expert Image"
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
                  {uploading ? "Đang tải ảnh lên..." : "Tải ảnh lên"}
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>
          <Flex vertical>
            <Form.Item
              label={t("expert.expert_name", "Tên chuyên gia")}
              name="name"
              className={styles.formItem}
              rules={[
                { required: true, message: "Vui lòng nhập tên" },
                {
                  min: 6,
                  max: 50,
                  message: "Tên phải từ 6 đến 50 ký tự",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t("expert.phone", "Điện thoại")}
              name="phone"
              className={styles.formItem}
              rules={[
                { required: true, message: "Please input your phone!" },
                {
                  message: "The input is not valid phone number!",
                  min: 10,
                  max: 11,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t("expert.email", "Email")}
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
              <Input />
            </Form.Item>
            <Form.Item
              label={t("expert.status", "Trạng thái")}
              name="status"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select options={statusOptions} />
            </Form.Item>
            <Flex
              align="center"
              justify="space-between"
              style={{ padding: "16px 16px 0px 16px" }}
            >
              <Button onClick={onDrawerClose}>
                {t("form.cancel", "Hủy bỏ")}
              </Button>
              <SaveButton
                {...saveButtonProps}
                htmlType="submit"
                type="primary"
                icon={null}
              >
                {t("form.save", "Lưu")}
              </SaveButton>
            </Flex>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
