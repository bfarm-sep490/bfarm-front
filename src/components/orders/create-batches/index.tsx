import { useForm } from "@refinedev/antd";
import { Button, DatePicker, Form, InputNumber, Modal, Select } from "antd";
import { set } from "lodash";
import { useState } from "react";

type CreateBatchModalProps = {
  product_types: [];
  visible: boolean;
  onClose: () => void;
  retch?: () => void;
  order?: any;
  packaging_products?: [];
};
export const CreateBatchModal = (props: CreateBatchModalProps) => {
  const [maxiumum, setMaxiumum] = useState(0);
  const { formProps, saveButtonProps } = useForm({
    resource: "product-pickup-batches",
    action: "create",
    createMutationOptions: {
      onSuccess: () => {
        props?.onClose?.();
        props?.retch?.();
      },
    },
  });
  return (
    <Modal
      title="Tạo lô hàng mới"
      open={props?.visible}
      onCancel={props?.onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={formProps?.form}
        onChange={formProps?.onChange}
        layout="vertical"
        onFinish={formProps?.onFinish}
      >
        <Form.Item
          name="product_id"
          label="Sản phẩm"
          rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
        >
          <Select
            placeholder="Chọn sản phẩm"
            onChange={(value) => {
              const product = props?.packaging_products?.find((x: any) => x.id === value) as any;
              setMaxiumum(product?.total_packs - product?.received_pack_quantity);
            }}
          >
            {props?.packaging_products
              ?.filter((x: any) => x?.total_packs - x?.received_pack_quantity > 0)
              ?.map((product: any) => (
                <Select.Option key={product?.id} value={product?.id}>
                  {`#${product?.id} - `}
                  {
                    (
                      props?.product_types?.find(
                        (x: any) => x.id === product?.packaging_type_id,
                      ) as any
                    )?.name
                  }
                  {"  "}
                  {"(" +
                    (product?.total_packs - product?.received_pack_quantity) +
                    " thành phẩm còn lại)"}
                  {}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Số lượng"
          rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
        >
          <InputNumber
            max={maxiumum}
            min={1}
            style={{ width: "100%" }}
            placeholder="Nhập số lượng"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" {...saveButtonProps} block>
            Tạo lô hàng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
