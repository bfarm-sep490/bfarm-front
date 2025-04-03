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
            label="Tên khu đất"
            name="yield_name"
            rules={[{ required: true, message: "Vui lòng nhập tên khu đất!" }]}
          >
            <Input placeholder="Nhập tên khu đất" />
          </Form.Item>

          <Form.Item
            label="Diện tích"
            name="area"
            rules={[{ required: true, message: "Vui lòng nhập diện tích!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Nhập diện tích" />
          </Form.Item>

          <Form.Item
            label="Đơn vị diện tích"
            name="area_unit"
            rules={[{ required: true, message: "Vui lòng nhập đơn vị diện tích!" }]}
          >
            <Input placeholder="Ví dụ: m², hecta" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả" />
          </Form.Item>

          <Form.Item
            label="Kích thước"
            name="size"
            rules={[{ required: true, message: "Vui lòng nhập kích thước!" }]}
          >
            <Input placeholder="Nhập kích thước" />
          </Form.Item>

          <Form.Item
            label="Loại đất"
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn loại đất!" }]}
          >
            <Select placeholder="Chọn loại đất">
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
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="Available">Sẵn sàng</Select.Option>
              <Select.Option value="Maintenance">Bảo trì</Select.Option>
              <Select.Option value="In-Use">Đang sử dụng</Select.Option>
            </Select>
          </Form.Item>

          <Flex justify="space-between" style={{ paddingTop: 16 }}>
            <Button onClick={onDrawerClose}>Hủy</Button>
            <SaveButton {...saveButtonProps} htmlType="submit" type="primary">
              Lưu
            </SaveButton>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
