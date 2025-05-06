import React, { useState, useEffect, useMemo } from "react";
import { type HttpError, useOne, useTranslate } from "@refinedev/core";
import { Button, List, Typography, Drawer, Divider, theme, Alert } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { InspectionResultTag } from "../result";
import { InspectionStatusTag } from "../status";
import { useNavigate, useParams } from "react-router";
import { getChemicalData } from "../chemical/ChemicalConstants";
import { InspectionModals } from "../inspectionModals";
import { InspectionDrawerForm } from "../drawer-form";
import { IInspectingForm } from "@/interfaces";
import dayjs from "dayjs";
type InspectionShowProps = {
  visible?: boolean;
  onClose?: () => void;
  taskId?: number;
  refetch?: () => void;
};
export const InspectionsShow = (props: InspectionShowProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCriteriaModalVisible, setIsCriteriaModalVisible] = useState(false);
  const [selectedResult, setSelectedResult] = useState<IInspectingForm | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { token } = theme.useToken();
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useTranslate();

  const {
    data: formQueryResult,
    isLoading: inspectingLoading,
    refetch: inspectingRefetching,
    isFetching: inspectingFetching,
  } = useOne<any, HttpError>({
    resource: "inspecting-forms",
    id: props?.taskId ?? id,
    queryOptions: { enabled: !!(props?.taskId || id) },
  });

  const {
    data: resultQueryResult,
    isLoading: inspectingResultLoading,
    refetch: refetchInspectingResult,
    isFetching: inspectingResultFetching,
  } = useOne<any, HttpError>({
    resource: "inspecting-results",
    id: props?.taskId ?? id,
    queryOptions: { enabled: !!(props?.taskId || id) },
  });

  const inspection = formQueryResult?.data?.[0];

  const inspectionResult = resultQueryResult?.data?.[0];
  const { data: planData } = useOne({
    resource: "plans",
    id: inspection?.plan_id,
  });
  const plan = planData?.data;

  const { data: plantData } = useOne({
    resource: "plants",
    id: plan?.plant_information?.plant_id,
  });
  const plant = plantData?.data;

  const chemicalData = useMemo(() => {
    const data = getChemicalData(inspectionResult);
    return data.map((item) => ({
      ...item,
      key: item.key,
      name: item.label,
      value: item.value !== undefined ? item.value.toString() : "N/A",
    }));
  }, [inspectionResult]);

  const handleBack = () => navigate(-1);
  const handleEdit = () => {
    if (inspection) {
      const formattedInspection = {
        ...inspection,
        start_date: inspection.start_date ? dayjs(inspection.start_date).toISOString() : "",
        end_date: inspection.end_date ? dayjs(inspection.end_date).toISOString() : "",
      };
      setSelectedResult(formattedInspection);
      setIsEditing(true);
    }
  };
  const handleCloseDrawer = () => {
    setIsEditing(false);
    setSelectedResult(null);
  };

  const breakpoint = { sm: window.innerWidth > 576 };

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
  const handleCloseCriteriaModal = () => setIsCriteriaModalVisible(false);
  useEffect(() => {
    if (props?.visible === true) {
      refetchInspectingResult();
      inspectingRefetching();
    } else {
      setIsModalVisible(false);
    }
  }, [props?.visible, props?.taskId, id, refetchInspectingResult, inspectingRefetching]);
  if (!inspection) return <Typography.Text></Typography.Text>;

  return (
    <Drawer
      loading={
        inspectingLoading ||
        inspectingResultFetching ||
        inspectingFetching ||
        inspectingResultLoading
      }
      open={props?.visible === true && props?.visible !== null ? props.visible : true}
      width={breakpoint?.sm ? "60%" : "100%"}
      onClose={props?.onClose ?? handleBack}
      style={{ background: token.colorBgLayout }}
      styles={{
        body: { padding: "24px 32px" },
        header: { background: token.colorBgContainer },
      }}
      title={
        <Typography.Title level={2} style={{ margin: 0 }}>
          #{inspection.id} - {inspection.task_name}
        </Typography.Title>
      }
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Thông tin kết quả
        </Typography.Title>

        {inspection.status !== "Cancel" && inspectionResult && (
          <Button type="primary" icon={<EyeOutlined />} onClick={handleOpenModal}>
            Xem chi tiết
          </Button>
        )}
      </div>

      <Divider style={{ marginTop: 0 }} />

      <div
        style={{
          border: `1px solid ${token.colorBorder}`,
          borderRadius: 8,
          padding: 16,
          marginBottom: 32,
          background: token.colorBgContainer,
        }}
      >
        {inspection.status === "Cancel" ? (
          <Typography.Text type="danger">
            Đợt kiểm nghiệm đã bị hủy. Không thể tạo kết quả.
          </Typography.Text>
        ) : inspectionResult ? (
          <List
            dataSource={[
              {
                label: "Đánh giá",
                value: <InspectionResultTag value={inspectionResult.evaluated_result} />,
              },
              {
                label: "Nội dung",
                value: inspectionResult.result_content || "N/A",
              },
              {
                label: "Ảnh kết quả",
                value:
                  Array.isArray(inspectionResult.inspect_images) &&
                  inspectionResult.inspect_images.length > 0
                    ? "Có"
                    : "Không có",
              },
            ]}
            renderItem={(data) => (
              <List.Item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography.Text strong>{data.label}</Typography.Text>
                  <Typography.Text>{data.value}</Typography.Text>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Alert type="error" showIcon message="Chưa có kết quả kiểm định." />
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Thông tin công việc
        </Typography.Title>
        {!inspectionResult && (
          <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
            Thay đổi
          </Button>
        )}
      </div>
      <Divider style={{ marginTop: 0 }} />

      <div
        style={{
          border: `1px solid ${token.colorBorder}`,
          borderRadius: 8,
          padding: 16,
          marginBottom: 32,
          background: token.colorBgContainer,
        }}
      >
        {inspection && (
          <List
            dataSource={[
              { label: "Tên kế hoạch", value: inspection.plan_name || "N/A" },
              {
                label: "Trung tâm kiểm định",
                value: inspection.inspector_name || "N/A",
              },
              { label: "Mô tả", value: inspection.description || "N/A" },
              {
                label: "Ngày bắt đầu",
                value: new Date(inspection.start_date).toLocaleDateString(),
              },
              {
                label: "Ngày kết thúc",
                value: new Date(inspection.end_date).toLocaleDateString(),
              },
              {
                label: "Trạng thái",
                value: <InspectionStatusTag value={inspection.status} />,
              },
              {
                label: "Cho thu hoạch",
                value: inspection.can_harvest ? "Có" : "Không",
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography.Text strong>{item.label}</Typography.Text>
                  <Typography.Text>{item.value}</Typography.Text>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>

      <Typography.Title level={3} style={{ marginBottom: 8 }}>
        Thời gian
      </Typography.Title>
      <Divider style={{ marginTop: 0 }} />

      <div
        style={{
          border: `1px solid ${token.colorBorder}`,
          borderRadius: 8,
          padding: 16,
          marginBottom: 32,
          background: token.colorBgContainer,
        }}
      >
        <List
          dataSource={[
            {
              label: "Hoàn thành",
              value: inspection.complete_date
                ? new Date(inspection.complete_date).toLocaleDateString()
                : "N/A",
            },
            {
              label: "Tạo lúc",
              value: new Date(inspection.created_at).toLocaleDateString(),
            },
            { label: "Tạo bởi", value: inspection.created_by || "N/A" },
            {
              label: "Cập nhật",
              value: inspection.updated_at
                ? new Date(inspection.updated_at).toLocaleDateString()
                : "N/A",
            },
            { label: "Cập nhật bởi", value: inspection.updated_by || "N/A" },
          ]}
          renderItem={(data) => (
            <List.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography.Text strong>{data.label}</Typography.Text>
                <Typography.Text>{data.value}</Typography.Text>
              </div>
            </List.Item>
          )}
        />
      </div>

      <InspectionModals
        isModalVisible={isModalVisible}
        onCloseModal={handleCloseModal}
        inspectionResult={inspectionResult}
        chemicalData={chemicalData}
        plantType={plant?.type}
        isCriteriaModalVisible={isCriteriaModalVisible}
        onCloseCriteriaModal={handleCloseCriteriaModal}
      />
      {isEditing && selectedResult && (
        <InspectionDrawerForm
          id={selectedResult.id}
          action="edit"
          open={isEditing}
          initialValues={selectedResult}
          onClose={handleCloseDrawer}
          onMutationSuccess={handleCloseDrawer}
        />
      )}
    </Drawer>
  );
};
