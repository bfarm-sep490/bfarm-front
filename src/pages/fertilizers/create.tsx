import React from "react";
import { useForm, Create } from "@refinedev/antd";
import { Form, Input, InputNumber, Select } from "antd";

export const FertilizerCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Tên phân bón"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên phân bón" }]}
        >
          <Input placeholder="Nhập tên phân bón" />
        </Form.Item>
        <Form.Item
          label="Loại phân bón"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại phân bón" }]}
        >
          <Select placeholder="Chọn loại phân bón">
            <Select.Option value="organic">Hữu cơ</Select.Option>
            <Select.Option value="chemical">Hóa học</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <InputNumber min={0} placeholder="Nhập số lượng" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Đơn vị"
          name="unit"
          rules={[{ required: true, message: "Vui lòng nhập đơn vị" }]}
        >
          <Input placeholder="Nhập đơn vị (kg, tấn, lít, ...)" />
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea placeholder="Nhập mô tả về phân bón" rows={4} />
        </Form.Item>
      </Form>
    </Create>
  );
};
