import { useEffect, useState } from "react";
import { useModalForm } from "@refinedev/antd";
import { Modal, Form, Button, Typography, Input } from "antd";
import { useNavigate } from "react-router";
import { useBack, useCustomMutation, useDelete, useGetIdentity, useUpdate } from "@refinedev/core";
import { IIdentity } from "@/interfaces";

type Props = {
  visible: boolean;
  id: number;
  onClose: () => void;
  status: string;
  refetch?: () => void;
};

export const StatusModal = ({ id, visible, onClose, status, refetch }: Props) => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<IIdentity>();
  const { isLoading, mutate } = useUpdate();
  const { isLoading: deletedLoading, mutate: deletedMutate } = useDelete();
  const [rejectionReason, setRejectionReason] = useState("");

  const getMessage = () => {
    switch (status) {
      case "Complete":
        return "Bạn chắc chắn muốn hoàn thành kế hoạch?";
      case "Cancel":
        return "Bạn chắc chắn muốn hủy kế hoạch?";
      default:
        return "";
    }
  };

  const back = useBack();
  const updateItem = async () => {
    try {
      if (status === "Complete") {
        mutate(
          {
            resource: "plans",
            id: `${id}/status/complete`,
            values: {},
          },
          {
            onSuccess: () => {
              refetch?.();
              onClose?.();
            },
          },
        );
      } else if (status === "Cancel") {
        mutate(
          {
            resource: "plans",
            id: `${id}/plan-rejection`,
            values: {},
            meta: {
              query: {
                reason: rejectionReason,
              },
            },
          },
          {
            onSuccess: () => {
              back();
            },
          },
        );
      }
    } catch (error) {
      console.error("Error during status update:", error);
    }
  };

  return (
    <Modal
      title={status === "Complete" ? "Xác nhận hoàn thành" : "Xác nhận hủy bỏ"}
      open={visible}
      onCancel={onClose}
      width={"20%"}
      footer={[
        <Button key="cancel" loading={isLoading} onClick={onClose}>
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={updateItem}
          loading={isLoading}
          disabled={status === "Cancel" && !rejectionReason}
        >
          Xác nhận
        </Button>,
      ]}
    >
      <Typography.Text>{getMessage()}</Typography.Text>
      {status === "Cancel" && (
        <>
          <br />
          <br />
          <Typography.Text strong>Lý do hủy bỏ:</Typography.Text>
          <Input.TextArea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Nhập lý do hủy bỏ kế hoạch"
            rows={4}
            style={{ marginTop: 8 }}
          />
        </>
      )}
      <br />
      <Typography.Text style={{ color: "red", fontSize: 11, fontStyle: "italic" }}>
        *Chú ý: Hành động này không thể hoàn tác
      </Typography.Text>
    </Modal>
  );
};
