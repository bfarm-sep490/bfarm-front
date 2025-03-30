import { FarmerListTable } from "@/components/farmer";
import { FarmerListTableInPlan } from "@/components/plan/farmers/list";
import { FarmerScheduleComponent } from "@/components/scheduler/farmer-task-scheduler";
import { IFarmer } from "@/interfaces";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  SearchOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { CreateButton, List, ShowButton, useForm } from "@refinedev/antd";
import {
  HttpError,
  useBack,
  useCustom,
  useCustomMutation,
  useDelete,
  useGo,
  useList,
  useModal,
  useNavigation,
  useOne,
  useTable,
  useTranslate,
} from "@refinedev/core";
import {
  Alert,
  Button,
  Form,
  Modal,
  Segmented,
  Select,
  Space,
  Spin,
  Table,
  theme,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { filter } from "lodash";
import { type PropsWithChildren, useState } from "react";
import { Calendar } from "react-big-calendar";
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
  const navigate = useNavigate();
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
  const translate = useTranslate();
  return (
    <>
      <Button
        type="text"
        style={{ width: "40px", height: "40px" }}
        onClick={() => navigate(`/plans/${id}`)}
      >
        <ArrowLeftOutlined style={{ width: "50px", height: "50px" }} />
      </Button>
      <List
        breadcrumb={false}
        headerButtons={(props) => [
          <Button
            type="primary"
            variant="filled"
            onClick={() => navigate(`/plans/${id}/farmers/create`)}
          >
            Thêm nông dân
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
            title={translate("farmer_name", "Tên nông dân")}
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
            title={translate("Status", "Trạng thái")}
            dataIndex="status"
            key="status"
            width={"auto"}
          />

          <Table.Column
            title={translate("Actions", "Hành động")}
            key="actions"
            fixed="right"
            align="center"
            render={(value, record: any) => (
              <Button
                shape="circle"
                danger
                onClick={() => {
                  navigate(`/plans/${id}/farmers/${record.id}/delete`);
                }}
              >
                <DeleteOutlined />
              </Button>
            )}
          />
        </Table>
        {children}
      </List>
    </>
  );
};

export const DeleteFarmerInPlanModal = () => {
  const navigate = useNavigate();
  const { id, farmer_id } = useParams();
  const [error, setError] = useState<string | undefined>();
  const { mutate } = useDelete({});
  const back = useBack();
  const handleDelete = async () => {
    await mutate(
      {
        resource: `plans`,
        id: `${id}/farmers/${farmer_id}`,
      },
      {
        onError: (error, variables, context) => {
          setError(error.message);
        },
        onSuccess: (data: any, variables, context) => {
          back();
        },
      }
    );
  };
  return (
    <Modal
      title="Xóa nông dân trong kế hoạch"
      open={true}
      onCancel={() => back()}
      onClose={() => back()}
      footer={
        <>
          <Button type="default" onClick={() => back()}>
            Hủy
          </Button>
          <Button type="primary" variant="filled" onClick={handleDelete}>
            Lưu
          </Button>
        </>
      }
    >
      {error && <Alert message={error} type="error" />}
      <Typography.Text
        style={{ fontSize: 12, color: "red", fontStyle: "italic" }}
      >
        * Không thể xóa các nông dân đang thực hiện công việc. Bạn có chắc chắn
        xóa không?
      </Typography.Text>
    </Modal>
  );
};

export const AddFarmerIntoPlanModal = () => {
  const { id } = useParams();
  const [selectFarmer, setSelectFarmer] = useState<number | undefined>();
  const [events, setEvents] = useState<
    {
      id: number;
      title: string;
      start: Date;
      end: Date;
      type: "Chăm sóc" | "Thu hoạch" | "Đóng gói" | "Kiểm định";
      status: "Pending" | "Complete" | "Ongoing" | "Cancel" | "Incomplete";
    }[]
  >([]);

  const { data: planData } = useOne({
    resource: `plans`,
    id: `${id}/general`,
  });

  const plan = planData?.data;

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

  const { data: chosenFarmrtData } = useList({
    resource: `plans/${id}/farmers`,
  });

  const navigate = useNavigate();
  const farmers = farmerData?.data as IFarmer[];
  const chosenFarmers = chosenFarmrtData?.data as IFarmer[];
  const filterFarmers =
    farmers?.filter((x) => !chosenFarmers?.some((y: any) => y.id === x.id)) ??
    [];

  const back = useBack();

  const { formProps, saveButtonProps } = useForm({
    resource: `plans/${id}/farmers`,
    action: "create",
    onMutationSuccess() {
      back();
    },
  });

  const { refetch, isLoading } = useCustom({
    url: `https://api.outfit4rent.online/api/farmers/${selectFarmer}/calendar`,
    method: "get",
    queryOptions: {
      enabled: false,
      onSuccess: (data) => {
        setEvents(
          data?.data?.map((x: any) => {
            return {
              title: x.task_type,
              start: x.start_date,
              end: x.end_date,
              status: x.status,
            };
          }) || []
        );
      },
    },
  });

  const handleSelect = async (value: number) => {
    setSelectFarmer(value);
    formProps?.form?.setFieldValue("farmer_id", value);
  };

  const handleShowDetail = async () => {
    if (!selectFarmer) return;
    refetch();
  };

  return (
    <Modal
      width={1000}
      title="Thêm nông dân vào kế hoạch"
      open={true}
      onCancel={() => navigate(`/plans/${id}/farmers`)}
      footer={
        <>
          <Button
            type="default"
            onClick={() => navigate(`/plans/${id}/farmers`)}
          >
            Hủy
          </Button>
          <Button type="primary" variant="filled" {...saveButtonProps}>
            Lưu
          </Button>
        </>
      }
    >
      <Form
        {...formProps}
        layout="vertical" // Thay đổi layout thành vertical
      >
        <Form.Item
          vertical={false}
          name="farmer_id"
          label="Chọn nông dân"
          rules={[{ required: true, message: "Vui lòng chọn nông dân!" }]}
        >
          <Space
            direction="vertical"
            style={{ width: "100%", marginBottom: 20 }}
          >
            <Select value={selectFarmer} onChange={handleSelect}>
              {filterFarmers?.map((farmer) => (
                <Select.Option key={farmer.id} value={farmer.id}>
                  {farmer.name}
                </Select.Option>
              ))}
            </Select>
            <Space>
              <ShowButton hideText size="small" onClick={handleShowDetail} />
            </Space>
          </Space>
        </Form.Item>
      </Form>
      {isLoading && selectFarmer && <Spin></Spin>}
      {events.length > 0 && (
        <FarmerScheduleComponent
          events={events}
          isLoading={false}
          start_date={plan?.start_date}
          end_date={plan?.end_date}
        />
      )}
    </Modal>
  );
};
