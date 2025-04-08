import { useParams } from "react-router";
import { CaringTaskPage } from "../../../components/caring-task/drawer-form";
import { Button, Card, Modal } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { BaseKey, useBack } from "@refinedev/core";
type CaringCreateProps = {
  planId?: number;
  problemId?: number;
  open?: boolean;
  taskId?: number;
  onClose?: () => void;
  onOpen?: () => void;
  refetch?: () => void;
};
export const CaringModal = (props: CaringCreateProps) => {
  return (
    <>
      {" "}
      <Modal
        open={props.open}
        footer={null}
        width={"60%"}
        height={"60%"}
        closable={props.open}
        onCancel={props?.onClose}
      >
        <Card
          title={"Thêm công việc chăm sóc"}
          style={{ width: "100%", margin: "0 auto", padding: "16px" }}
        >
          <CaringTaskPage
            taskId={props?.taskId as BaseKey}
            onClose={props?.onClose}
            planId={props?.planId}
            refetch={props?.refetch}
            problemId={props?.problemId}
            action={props?.taskId ? "edit" : "create"}
          />
        </Card>
      </Modal>
    </>
  );
};
