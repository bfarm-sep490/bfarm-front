import {
  DateField,
  SaveButton,
  TagField,
  Title,
  useDrawerForm,
  useForm,
  useModalForm,
} from "@refinedev/antd";
import { useShow, useNavigation, useBack, useUpdate } from "@refinedev/core";
import {
  Drawer,
  Flex,
  Grid,
  Typography,
  List,
  Divider,
  Image,
  Table,
  Radio,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Spin,
  Select,
} from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
type ReportProblemProps = {
  status?: string;
  open: boolean;
  close: () => void;
};
export const ReportProblemModal = (props: ReportProblemProps) => {
  const { id } = useParams();
  const { formProps, formLoading, saveButtonProps } = useForm<any>({
    resource: "problems",
    id: `${id}/result-content`,
    action: "edit",
    queryOptions: {
      enabled: false,
    },
    onMutationSuccess: () => {
      navigate("../" + id, { replace: true });
    },
    redirect: false,
  });
  const navigate = useNavigate();
  const breakpoint = { sm: window.innerWidth > 576 };

  const statusOptions = [
    { label: "Cancelled", value: "Cancelled" },
    { label: "Resovled", value: "Resolved" },
  ];
  return (
    <>
      <Modal
        open={props.open}
        title={"Kết quả vấn đề"}
        width={breakpoint.sm ? "378px" : "100%"}
        zIndex={1001}
        onClose={close}
        onCancel={close}
        footer={
          <Flex vertical gap={8} justify="end" style={{ width: "100%" }}>
            <Button onClick={close}>Đóng</Button>
            <Button {...saveButtonProps} type="primary" />
          </Flex>
        }
      >
        <Spin spinning={formLoading}>
          <Form {...formProps} layout="vertical">
            <Form.Item
              label="Kết quả"
              name="result_content"
              rules={[{ required: true, message: "Vui lòng nhập kết quả" }]}
            >
              <Input.TextArea name="result" />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true }]}
            >
              <Select options={statusOptions} />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};
