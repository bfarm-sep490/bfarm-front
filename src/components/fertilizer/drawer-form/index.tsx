import { getValueFromEvent, SaveButton, useDrawerForm } from "@refinedev/antd";
import { type BaseKey, useApiUrl, useGetToPath, useGo, useTranslate } from "@refinedev/core";

import { Form, Input, InputNumber, Select, Upload, Grid, Button, Flex, Avatar, Spin } from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { UploadOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";
import { IFertilizer } from "@/interfaces";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const FertilizerDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();
  const { styles, theme } = useStyles();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<IFertilizer>({
      resource: "fertilizer",
      id: props?.id,
      action: props.action,
      redirect: false,
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

  const image = Form.useWatch("image", formProps.form);
  const title = props.action === "edit" ? "Edit Fertilizer" : "Add Fertilizer";

  const statusOptions = [
    { label: "In Stock", value: "InStock" },
    { label: "Out of Stock", value: "OutStock" },
    { label: "Unactivated", value: "UnActived" },
  ];

  const typeOptions = [
    { label: "Organic", value: "Organic" },
    { label: "Chemical", value: "Chemical" },
    { label: "Mixed", value: "Mixed" },
  ];

  const unitOptions = [
    { label: "Bao 2kg", value: "Bao 2kg" },
    { label: "Bao 3kg", value: "Bao 3kg" },
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
        <Form {...formProps} layout="vertical">
          <Form.Item
            name="image"
            valuePropName="fileList"
            getValueFromEvent={getValueFromEvent}
            style={{ margin: 0 }}
            rules={[{ required: true }]}
          >
            <Upload.Dragger
              name="file"
              action={`${apiUrl}/media/upload`}
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
                    width: image ? "100%" : "48px",
                    height: image ? "100%" : "48px",
                    marginTop: image ? undefined : "auto",
                    transform: image ? undefined : "translateY(50%)",
                  }}
                  src={image || "/images/fertilizer-default-img.png"}
                  alt="Fertilizer Image"
                />
                <Button
                  icon={<UploadOutlined />}
                  style={{
                    marginTop: "auto",
                    marginBottom: "16px",
                    backgroundColor: theme.colorBgContainer,
                    ...(!!image && {
                      position: "absolute",
                      bottom: 0,
                    }),
                  }}
                >
                  Upload Image
                </Button>
              </Flex>
            </Upload.Dragger>
          </Form.Item>
          <Flex vertical>
            <Form.Item
              label="Name"
              name="name"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item
              label="Available Quantity"
              name="available_quantity"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "150px" }} min={0} step={0.1} />
            </Form.Item>
            <Form.Item
              label="Total Quantity"
              name="total_quantity"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "150px" }} min={0} />
            </Form.Item>
            <Form.Item
              label="Unit"
              name="unit"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select options={unitOptions} />
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select options={statusOptions} />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select options={typeOptions} />
            </Form.Item>
            <Flex align="center" justify="space-between" style={{ padding: "16px 16px 0px 16px" }}>
              <Button onClick={onDrawerClose}>Cancel</Button>
              <SaveButton {...saveButtonProps} htmlType="submit" type="primary" icon={null}>
                Save
              </SaveButton>
            </Flex>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
