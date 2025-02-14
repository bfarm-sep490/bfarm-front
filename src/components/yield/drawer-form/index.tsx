import { SaveButton, useDrawerForm } from "@refinedev/antd";
import {
  type BaseKey,
  useApiUrl,
  useGetToPath,
  useGo,
  useTranslate,
} from "@refinedev/core";
import { getValueFromEvent } from "@refinedev/antd";
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
} from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { UploadOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";
import { IYield, YieldType, YieldAvailability } from "@/interfaces";

type Props = {
  id?: BaseKey;
  action: "create" | "edit";
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const YieldDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();
  const { styles, theme } = useStyles();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<IYield>({
      resource: "yield",
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
  const title = props.action === "edit" ? "Edit Yield" : "Add Yield";

  const typeOptions = Object.values<YieldType>(["Đất Thịt", "Đất Mùn"]).map(
    (type) => ({
      label: type,
      value: type,
    })
  );

  const availabilityOptions = Object.values<YieldAvailability>([
    "Available",
    "Unavailable",
  ]).map((status) => ({
    label: status,
    value: status,
  }));

  const areaUnitOptions = [
    { label: "Hectare", value: "hectare" },
    { label: "Acre", value: "acre" },
    { label: "Square Meter", value: "square meter" },
  ];

  const sizeOptions = [
    { label: "Small", value: "Small" },
    { label: "Medium", value: "Medium" },
    { label: "Large", value: "Large" },
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
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Area Unit"
              name="AreaUnit"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select options={areaUnitOptions} />
            </Form.Item>
            <Form.Item
              label="Area"
              name="Area"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "150px" }} min={0} step={0.01} />
            </Form.Item>
            <Form.Item
              label="Size"
              name="size"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select options={sizeOptions} />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select options={typeOptions} />
            </Form.Item>
            <Form.Item
              label="Availability"
              name="isAvailable"
              className={styles.formItem}
              rules={[{ required: true }]}
            >
              <Select options={availabilityOptions} />
            </Form.Item>
            <Flex
              align="center"
              justify="space-between"
              style={{ padding: "16px 16px 0px 16px" }}
            >
              <Button onClick={onDrawerClose}>Cancel</Button>
              <SaveButton
                {...saveButtonProps}
                htmlType="submit"
                type="primary"
                icon={null}
              >
                Save
              </SaveButton>
            </Flex>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
