import { FarmerListTable } from "@/components/farmer";
import { FarmerListTableInPlan } from "@/components/plan/farmers/list";
import { IFarmer } from "@/interfaces";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { CreateButton, List, useForm } from "@refinedev/antd";
import {
  HttpError,
  useBack,
  useDelete,
  useGo,
  useList,
  useModal,
  useNavigation,
  useTable,
} from "@refinedev/core";
import {
  Button,
  Form,
  Modal,
  Segmented,
  Select,
  Table,
  theme,
  Typography,
} from "antd";
import { filter } from "lodash";
import { type PropsWithChildren, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

export const FarmerListInPlan = ({ children }: PropsWithChildren) => {
  const [deletedId, setDeletedId] = useState<number>(0);
  const [deletedOpen, setDeletedOpen] = useState<boolean>(false);
  const { id } = useParams();
  const go = useGo();
  const back = useBack();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();
  const [open, setOpen] = useState(false);
  const {
    data: farmerData,
    isLoading,
    isError,
    error,
  } = useList({
    resource: `plans/${id}/farmers`,
  });
  const farmers = farmerData?.data;
  const { token } = theme.useToken();
  return (
    <>
      <Button
        type="text"
        style={{ width: "40px", height: "40px" }}
        onClick={() => back()}
      >
        <ArrowLeftOutlined style={{ width: "50px", height: "50px" }} />
      </Button>
      <List
        breadcrumb={false}
        headerButtons={(props) => [
          <Button type="primary" variant="filled" onClick={() => setOpen(true)}>
            Thêm nông dân vào kế hoạch
          </Button>,
        ]}
      >
        <Table
          dataSource={farmers}
          loading={isLoading}
          rowKey="id"
          scroll={{ x: true }}
        >
          <Table.Column
            title="ID"
            dataIndex="id"
            key="id"
            width={"auto"}
            render={(value) => (
              <Typography.Text style={{ fontWeight: "bold" }}>
                #{value}
              </Typography.Text>
            )}
            filterIcon={(filtered) => (
              <SearchOutlined
                style={{
                  color: filtered ? token.colorPrimary : undefined,
                }}
              />
            )}
          />

          <Table.Column
            title="Name"
            dataIndex="name"
            key="name"
            width={"auto"}
            filterIcon={(filtered) => (
              <SearchOutlined
                style={{
                  color: filtered ? token.colorPrimary : undefined,
                }}
              />
            )}
          />

          <Table.Column
            title="Status"
            dataIndex="status"
            key="status"
            width={"auto"}
          />

          <Table.Column
            title="Actions"
            key="actions"
            fixed="right"
            align="center"
            render={(value, record: any) => (
              <Button
                shape="circle"
                danger
                onClick={() => {
                  setDeletedId(record.id);
                  setDeletedOpen(true);
                }}
              >
                <DeleteOutlined />
              </Button>
            )}
          />
        </Table>
        {children}
      </List>
      <AddFarmerIntoPlanModal
        open={open}
        setOpen={setOpen}
        chosenFarmers={farmers}
      />
      <DeleteFarmerInPlanModal
        open={deletedOpen}
        setOpen={setDeletedOpen}
        famer_id={deletedId}
      ></DeleteFarmerInPlanModal>
    </>
  );
};
type DeleteFarmerInPlanProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  famer_id: number;
};

export const DeleteFarmerInPlanModal = ({
  open,
  setOpen,
  famer_id,
}: DeleteFarmerInPlanProps) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { mutate } = useDelete();

  const handleDelete = async () => {
    mutate({
      resource: `plans`,
      id: `/${id}/farmers/${famer_id}`,
    });
  };
  return (
    <Modal
      title="Xóa nông dân trong kế hoạch"
      open={open}
      onCancel={() => setOpen(false)}
      footer={
        <>
          <Button type="default" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button type="primary" variant="filled" onClick={handleDelete}>
            Lưu
          </Button>
        </>
      }
    >
      <Typography.Text
        style={{ fontSize: 12, color: "red", fontStyle: "italic" }}
      >
        * Bạn có chắc chắn muốn xóa nông dân này khỏi kế hoạch?
      </Typography.Text>
    </Modal>
  );
};
type AddFarmerIntoPlanProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  chosenFarmers: any;
};

export const AddFarmerIntoPlanModal = ({
  open,
  setOpen,
  chosenFarmers = [],
}: AddFarmerIntoPlanProps) => {
  const { data: farmerData } = useList({
    resource: "farmers",
    filters: [
      {
        field: "status",
        operator: "eq",
        value: "Active",
      },
    ],
  });
  const navigate = useNavigate();
  const farmers = farmerData?.data as IFarmer[];
  const filterFarmers = farmers?.filter(
    (x) => !chosenFarmers.some((y: any) => y.id === x.id)
  );

  const { id } = useParams();

  const { formProps, saveButtonProps } = useForm({
    resource: `plans/${id}/farmers`,
    action: "create",
    onMutationSuccess() {
      navigate(`/plans/${id}/farmers`);
    },
  });

  return (
    <Form {...formProps}>
      <Modal
        title="Thêm nông dân vào kế hoạch"
        open={open}
        onCancel={() => setOpen(false)}
        footer={
          <>
            <Button type="default" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="primary" variant="filled" {...saveButtonProps}>
              Lưu
            </Button>
          </>
        }
      >
        <Form.Item
          name="farmer_id"
          label="Chọn nông dân"
          rules={[{ required: true, message: "Vui lòng chọn nông dân!" }]}
        >
          <Select>
            {filterFarmers?.map((farmer) => (
              <Select.Option key={farmer.id} value={farmer.id}>
                {farmer.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Modal>
    </Form>
  );
};
