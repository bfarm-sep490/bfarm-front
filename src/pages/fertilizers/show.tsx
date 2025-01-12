import React from "react";
import {
  useShow,
  useNavigation,
  useDelete,
  useTranslate,
} from "@refinedev/core";
import {
  Space,
  Button,
  Typography,
  notification,
  Grid,
  Modal,
  Spin,
} from "antd";
import type { IFertilizer } from "../../interfaces";
import { FertilizerInfoList } from "../../components/fertilizers/infoList";
import { FertilizerInfoSummary } from "../../components/fertilizers/infoSummary";
import { Drawer } from "../../components";
import { EditIcon, DeleteIcon } from "../../components/icons";

export const FertilizersShow: React.FC = () => {
  const { list, edit } = useNavigation();
  const { mutate: deleteFertilizer } = useDelete();
  const breakpoint = Grid.useBreakpoint();
  const { queryResult } = useShow<IFertilizer>({
    resource: "fertilizers",
  });

  const { data, isLoading, isError } = queryResult;
  const fertilizer = data?.data;
  const translate = useTranslate();

  const handleDelete = () => {
    if (!fertilizer?.id) {
      notification.error({
        message: translate("errors.invalid_fertilizer", "Invalid Fertilizer"),
        description: translate(
          "errors.missing_data",
          "The fertilizer data is missing or incomplete."
        ),
      });
      return;
    }
    deleteFertilizer(
      {
        resource: "fertilizers",
        id: fertilizer.id,
      },
      {
        onSuccess: () => {
          notification.success({
            message: translate(
              "notifications.delete_success",
              "Fertilizer deleted successfully"
            ),
          });
          list("fertilizers");
        },
        onError: (error) => {
          notification.error({
            message: translate(
              "errors.delete_failed",
              "Failed to delete fertilizer"
            ),
            description:
              error.message ||
              translate("errors.unexpected_error", "An unexpected error occurred."),
          });
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    Modal.confirm({
      title: translate("confirmation.title", "Are you sure?"),
      content: translate(
        "confirmation.content",
        "Do you really want to delete this fertilizer?"
      ),
      okText: translate("confirmation.ok_text", "Yes, Delete"),
      cancelText: translate("confirmation.cancel_text", "Cancel"),
      okType: "danger",
      onOk: handleDelete,
    });
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !fertilizer) {
    return (
      <Typography.Text type="danger">
        {translate("errors.no_data", "Fertilizer data is not available.")}
      </Typography.Text>
    );
  }

  return (
    <Drawer
      open
      onClose={() => list("fertilizers")}
      width={breakpoint.sm ? "736px" : "100%"}
    >
      <Space
        direction="vertical"
        size={32}
        style={{
          padding: "32px",
          width: "100%",
        }}
      >
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Button
            icon={<EditIcon />}
            onClick={() => edit("fertilizers", fertilizer.id)}
            type="primary"
          >
            {translate("actions.edit", "Edit")}
          </Button>
          <Button
            icon={<DeleteIcon />}
            onClick={handleDeleteConfirm}
            danger
          >
            {translate("actions.delete", "Delete")}
          </Button>
        </Space>

        <FertilizerInfoSummary fertilizer={fertilizer} />
        <FertilizerInfoList fertilizer={fertilizer} />
      </Space>
    </Drawer>
  );
};
