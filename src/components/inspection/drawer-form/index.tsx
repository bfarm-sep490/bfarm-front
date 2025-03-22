/* eslint-disable prettier/prettier */
import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { type BaseKey, useApiUrl, useGetToPath, useGo } from "@refinedev/core";
import { Form, Input, InputNumber, Select, Grid, Button, Flex, Spin, Drawer } from "antd";
import { useEffect } from "react";
import { IInspectingForm } from "@/interfaces";
import { useSearchParams } from "react-router";

type Props = {
  id?: BaseKey;
  action: "edit";
  open?: boolean;
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const InspectionDrawerForm = (props: Props) => {
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();
  const go = useGo();
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const { drawerProps, formProps, close, saveButtonProps, formLoading } = useDrawerForm<IInspectingForm>({
    resource: "inspecting-forms",
    id: props.id, 
    action: "edit",
    redirect: false,
    queryOptions: {
      enabled: !!props.id,
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
    if (formProps.form) {
      formProps.form.validateFields().catch(() => { });
    }
  }, [formProps.form]);

  return (
    <Drawer
      {...drawerProps}
      open={props.open}
      title="Edit Inspection"
      width={breakpoint.sm ? "400px" : "100%"}
      onClose={onDrawerClose}
    >
      <Spin spinning={formLoading}>
        <Form
          form={formProps.form}
          layout="vertical"
          onFinish={formProps.onFinish}
          onValuesChange={formProps.onValuesChange}
        >
          <Form.Item label="Task Name" name="task_name" rules={[{ required: true, message: "Enter task name!" }]}>
            <Input placeholder="Enter task name" />
          </Form.Item>

          <Form.Item label="Description" name="description" rules={[{ required: true, message: "Enter description!" }]}>
            <Input.TextArea rows={3} placeholder="Enter task description" />
          </Form.Item>

          <Form.Item label="Plan ID" name="plan_id" rules={[{ required: true, message: "Enter plan ID!" }]}>
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter plan ID" />
          </Form.Item>

          <Form.Item label="Inspector ID" name="inspector_id" rules={[{ required: true, message: "Enter inspector ID!" }]}>
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Enter inspector ID" />
          </Form.Item>

          <Form.Item label="Status" name="status" rules={[{ required: true, message: "Select status!" }]}>
            <Select placeholder="Select status">
              <Select.Option value="Draft">Draft</Select.Option>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Ongoing">Ongoing</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Can Harvest" name="can_harvest" rules={[{ required: true, message: "Select option!" }]}>
            <Select placeholder="Can Harvest?">
              <Select.Option value={true}>Yes</Select.Option>
              <Select.Option value={false}>No</Select.Option>
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