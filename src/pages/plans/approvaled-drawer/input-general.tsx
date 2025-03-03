import { Card, DatePicker, Flex, Form, Input, Select, Typography } from "antd";
import { useList } from "@refinedev/core";
import { useState } from "react";
import { FormProps } from "antd/lib";
import form from "antd/es/form";

type Props = {
  experts: any;
  yields: any;
  plants: any;
  formProps: FormProps;
};

export const InputGeneralPlan = ({
  experts,
  yields,
  plants,
  formProps,
}: Props) => {
  console.log(formProps);
  return (
    <Form
      form={formProps?.form}
      onChange={formProps.onChange}
      layout="vertical"
    >
      <Flex justify="center" align="center">
        <Card
          style={{ width: "60%" }}
          title={
            <Typography.Title style={{ textAlign: "center" }} level={4}>
              Thông tin kế hoạch
            </Typography.Title>
          }
        >
          <Flex vertical>
            <Form.Item
              label="Tên kế hoạch"
              name="plant_name"
              rules={[
                { required: true, message: "Vui lòng nhập tên kế hoạch" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Giống cây trồng"
              name="plant_id"
              rules={[
                { required: true, message: "Vui lòng chọn giống cây trồng" },
              ]}
            >
              <Select
                style={{ width: "100%" }}
                placeholder="Chọn giống cây trồng"
              >
                {plants.map((plant: any) => (
                  <Select.Option key={plant.id} value={plant.id}>
                    {plant.plant_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Khu đất"
              name="yield_id"
              rules={[
                { required: true, message: "Vui lòng chọn khu đất gieo trồng" },
              ]}
            >
              <Select
                style={{ width: "100%" }}
                placeholder="Chọn khu đất gieo trồng"
              >
                {yields.map((yieldItem: any) => (
                  <Select.Option key={yieldItem.id} value={yieldItem.id}>
                    {yieldItem.yield_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Chuyên gia" name="expert_id">
              <Select style={{ width: "100%" }} placeholder="Chọn chuyên gia">
                {experts.map((expert: any) => (
                  <Select.Option key={expert.id} value={expert.id}>
                    {expert.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Flex gap={10}>
              <Form.Item
                label="Sản lượng dự kiến"
                name="estimated_product"
                rules={[{ required: true, message: "Nhập sản lượng dự kiến" }]}
              >
                <Input
                  placeholder="Nhập sản lượng dự kiến"
                  style={{ flex: 1 }}
                />
              </Form.Item>
              <Form.Item name="estimated_unit">
                <Select style={{ width: "100px" }}>
                  <Select.Option value="kg">kg</Select.Option>
                  <Select.Option value="ton">tấn</Select.Option>
                </Select>
              </Form.Item>
            </Flex>
            <Form.Item
              label="Ngày bắt đầu dự kiến"
              name="start_date"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu" },
              ]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                placeholder="Ngày bắt đầu dự kiến"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="Ngày kết thúc dự kiến"
              name="end_date"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc" },
              ]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                placeholder="Ngày kết thúc dự kiến"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <Input.TextArea rows={6} placeholder="Nhập mô tả" />
            </Form.Item>
          </Flex>
        </Card>
      </Flex>
    </Form>
  );
};
