import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { type BaseKey, useApiUrl, useGetToPath, useGo } from "@refinedev/core";
import { Form, Input, InputNumber, Select, Button, Flex, Drawer, Spin, Switch } from "antd";
import { useState } from "react";
import { useSearchParams } from "react-router";

type Props = {
  id?: BaseKey;
  action: "edit" | "create";
  open?: boolean;
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const YieldDrawerForm = (props: Props) => {
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const apiUrl = useApiUrl();

  const { drawerProps, formProps, close, saveButtonProps } = useDrawerForm<any>({
    resource: "yields",
    id: props?.id,
    action: props.action,
    redirect: false,
    queryOptions: {
      enabled: props.action === "edit",
      onSuccess: (data) => {
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

  const title = props.action === "edit" ? "Edit Yield" : "Add Yield";

  return (
    <Drawer {...drawerProps} open={true} title={title} width={400} onClose={onDrawerClose}>
      <Spin spinning={formLoading}>
        <Form
          form={formProps?.form}
          layout="vertical"
          onFinish={formProps?.onFinish}
          onValuesChange={formProps?.onValuesChange}
        >
          <Form.Item
            label="Yield Name"
            name="yield_name"
            rules={[{ required: true, message: "Please enter yield name!" }]}
          >
            <Input placeholder="Enter yield name" />
          </Form.Item>

          <Form.Item
            label="Area"
            name="area"
            rules={[{ required: true, message: "Please enter area!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter area" />
          </Form.Item>

          <Form.Item
            label="Area Unit"
            name="area_unit"
            rules={[{ required: true, message: "Please enter area unit!" }]}
          >
            <Input placeholder="e.g., m², hectares" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description!" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            label="Size"
            name="size"
            rules={[{ required: true, message: "Please enter size!" }]}
          >
            <Input placeholder="Enter size" />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please select type!" }]}
          >
            <Select placeholder="Select type">
              <Select.Option value="Đất xám">Đất xám</Select.Option>
              <Select.Option value="Đất cát">Đất cát</Select.Option>
              <Select.Option value="Đất đỏ">Đất đỏ</Select.Option>
              <Select.Option value="Đất đen">Đất đen</Select.Option>
              <Select.Option value="Đất phèn">Đất phèn</Select.Option>
              <Select.Option value="Đất chua">Đất chua</Select.Option>
              <Select.Option value="Đất hữu cơ">Đất hữu cơ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Select status!" }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="Available">Available</Select.Option>
              <Select.Option value="Maintenance">Maintenance</Select.Option>
              <Select.Option value="In-Use">In-Use</Select.Option>
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
