import { useModalForm } from "@refinedev/antd";
import { BaseKey } from "@refinedev/core";
import { Form, Input, Modal } from "antd";

type ReportProblemModalProps = {
  action: "cancel" | "resolve";
  isOpen: boolean;
  onClose: () => void;
  onReport: () => void;
  id?: BaseKey;
};

const ReportProblemModal = ({
  isOpen,
  onClose,
  id,
  action,
}: ReportProblemModalProps) => {
  const { modalProps: createModalProps, formProps: createFormProps } =
    useModalForm<any>({
      action: "edit",
      resource: `problems/${id}/${action}`,
    });

  return (
    <Modal {...createModalProps} open={isOpen} onCancel={onClose}>
      <Form {...createFormProps} layout="vertical">
        <Form.Item
          label="Kết quả"
          name="result"
          rules={[{ required: true, message: "Vui lòng nhập kết quả" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReportProblemModal;
