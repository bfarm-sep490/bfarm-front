import { useForm } from "@refinedev/antd";
import { Card, Form, Input, InputNumber, Button, message } from "antd";
import { useGetIdentity } from "@refinedev/core";
import { useEffect } from "react";

interface IConfiguration {
  deposit_percent: number;
  address: string;
}

export const ConfigurationList: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<IConfiguration>({
    resource: "configuration-systems",
    action: "create",
    redirect: false,
    successNotification: {
      message: "Cập nhật cấu hình thành công",
      type: "success",
    },
    onMutationSuccess: () => {
      message.success("Cập nhật cấu hình thành công");
    },
  });

  const { data: user } = useGetIdentity();

  useEffect(() => {}, []);

  return (
    <Card
      title="Cấu hình hệ thống"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        marginTop: "24px",
      }}
    >
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          deposit_percent: 40,
          address: "HCM",
        }}
      >
        <Form.Item
          label="Phần trăm đặt cọc (%)"
          name="deposit_percent"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập phần trăm đặt cọc",
            },
            {
              type: "number",
              min: 0,
              max: 100,
              message: "Phần trăm phải từ 0 đến 100",
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập phần trăm đặt cọc"
            formatter={(value) => `${value}%`}
            parser={(value) => value!.replace("%", "")}
          />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập địa chỉ",
            },
          ]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" {...saveButtonProps} style={{ width: "100%" }}>
            Lưu cấu hình
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
