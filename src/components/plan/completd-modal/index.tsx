import { useEffect } from "react";
import { useModalForm } from "@refinedev/antd";
import { Modal, Form, Button, Typography } from "antd";
import { useNavigate } from "react-router";
import { useBack, useCustomMutation, useUpdate } from "@refinedev/core";

type Props = {
  visible: boolean;
  id: number;
  onClose: () => void;
  status: string;
};

export const StatusModal = ({ id, visible, onClose, status }: Props) => {
  const navigate = useNavigate();
  const { isLoading, mutate } = useUpdate();

  const getMessage = () => {
    switch (status) {
      case "complete":
        return "Bạn chắc chắn muốn hoàn thành kế hoạch?";
      case "cancel":
        return "Bạn chắc chắn muốn hủy kế hoạch?";
      default:
        return "";
    }
  };
  const back = useBack();
  const updateItem = async () => {
    try {
      mutate(
        {
          resource: "plans",
          id: `${id}/status/${status}`,
          values: {},
        },
        {
          onSuccess: () => {
            back();
          },
        },
      );
    } catch (error) {
      console.error("Error during status update:", error);
    }
  };

  return (
    <Modal
      title="Xác nhận hoàn thành"
      open={visible}
      onCancel={onClose}
      width={"20%"}
      footer={[
        <Button key="cancel" loading={isLoading} onClick={onClose}>
          Hủy bỏ
        </Button>,
        <Button key="submit" type="primary" onClick={updateItem} loading={isLoading}>
          Xác nhận
        </Button>,
      ]}
    >
      <Typography.Text>{getMessage()}</Typography.Text>
      <br />
      <Typography.Text style={{ color: "red", fontSize: 11, fontStyle: "italic" }}>
        *Chú ý: Hành động này không thể hoàn tác
      </Typography.Text>
    </Modal>
  );
};
