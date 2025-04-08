/* eslint-disable prettier/prettier */
import React, { useState, useMemo } from "react";
import { type HttpError, useShow } from "@refinedev/core";
import {
  Button,
  List,
  Typography,
  Spin,
  Table,
  Alert,
  Drawer,
  Modal,
  Divider,
  theme,
} from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { IInspectingForm, IInspectingResult } from "@/interfaces";
import { InspectionDrawerForm } from "../drawer-form";
import { InspectionResultTag } from "../result";
import { InspectionStatusTag } from "../status";
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import {
  chemicalGroups,
  columns,
  getChemicalData,
} from "../chemical/ChemicalConstants";
import { useTranslation } from "react-i18next";

export const InspectionsShow: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedResult, setSelectedResult] = useState<IInspectingForm | null>(null);
  const { token } = theme.useToken();
  const { id } = useParams();
  const navigate = useNavigate();


  const { queryResult: formQueryResult } = useShow<{ data: IInspectingForm[] }, HttpError>({
    resource: "inspecting-forms",
    id,
    queryOptions: { enabled: !!id },
  });

  const { queryResult: resultQueryResult } = useShow<{ data: IInspectingResult[] }, HttpError>({
    resource: "inspecting-results",
    id,
    queryOptions: { enabled: !!id },
  });

  const isLoading = formQueryResult.isLoading || resultQueryResult.isLoading;

  const inspection = useMemo(
    () =>
      (formQueryResult.data as { data: IInspectingForm[] } | undefined)?.data?.[0],
    [formQueryResult.data]
  );

  const inspectionResult = useMemo(
    () =>
      (resultQueryResult.data as { data: IInspectingResult[] } | undefined)?.data?.[0],
    [resultQueryResult.data]
  );

  const chemicalData = getChemicalData(inspectionResult);

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

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);
  const { t } = useTranslation();

  if (!id) return <Alert type="error" message="No inspection ID provided" />;
  if (isLoading) return <Spin size="large" />;
  if (formQueryResult.error || resultQueryResult.error)
    return <Alert type="error" message="Failed to load inspection data" />;
  if (!inspection) return <Typography.Text>Không có dữ liệu.</Typography.Text>;


  return (
    <Drawer
      open={true}
      width={800}
      onClose={handleBack}
      bodyStyle={{ padding: "24px 32px" }}
      title={
        <Typography.Title level={2} style={{ margin: 0 }}>
          #{inspection.id} - {inspection.task_name}
        </Typography.Title>
      }
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {t("inspections.result_info")}
        </Typography.Title>

        {inspection.status !== "Cancel" && inspectionResult && (
          <Button type="primary" icon={<EyeOutlined />} onClick={handleOpenModal}>
            {t("inspections.view_details")}
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
            {t("inspections.cancelled_warning")}
          </Typography.Text>
        ) : inspectionResult ? (
          <List
            dataSource={[
              { label: t("inspections.evaluation"), value: <InspectionResultTag value={inspectionResult.evaluated_result} /> },
              { label: t("inspections.content"), value: inspectionResult.result_content || "N/A" },
              {
                label: t("inspections.result_image"),
                value:
                  Array.isArray(inspectionResult.inspect_images) && inspectionResult.inspect_images.length > 0
                    ? t("inspections.yes")
                    : t("inspections.no"),
              },
            ]}
            renderItem={(data) => (
              <List.Item>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <Typography.Text strong>{data.label}</Typography.Text>
                  <Typography.Text>{data.value}</Typography.Text>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Typography.Text type="secondary">{t("inspections.no_result")}</Typography.Text>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {t("inspections.job_info")}
        </Typography.Title>
        <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
          {t("inspections.create")}
        </Button>
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
              { label: t("inspections.plan_name"), value: inspection.plan_name || "N/A" },
              { label: t("inspections.inspector_center"), value: inspection.inspector_name || "N/A" },
              { label: t("inspections.description"), value: inspection.description || "N/A" },
              { label: t("inspections.start_date"), value: new Date(inspection.start_date).toLocaleDateString() },
              { label: t("inspections.end_date"), value: new Date(inspection.end_date).toLocaleDateString() },
              { label: t("inspections.status"), value: <InspectionStatusTag value={inspection.status} /> },
              { label: t("inspections.can_harvest"), value: inspection.can_harvest ? t("inspections.yes") : t("inspections.no") },
            ]}
            renderItem={(item) => (
              <List.Item>
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <Typography.Text strong>{item.label}</Typography.Text>
                  <Typography.Text>{item.value}</Typography.Text>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>

      <Typography.Title level={3} style={{ marginBottom: 8 }}>
        {t("inspections.time_info")}
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
              label: t("inspections.completed_at"),
              value: inspection.complete_date ? new Date(inspection.complete_date).toLocaleDateString() : "N/A",
            },
            { label: t("inspections.created_at"), value: new Date(inspection.created_at).toLocaleDateString() },
            { label: t("inspections.created_by"), value: inspection.created_by || "N/A" },
            {
              label: t("inspections.updated_at"),
              value: inspection.updated_at ? new Date(inspection.updated_at).toLocaleDateString() : "N/A",
            },
            { label: t("inspections.updated_by"), value: inspection.updated_by || "N/A" },
          ]}
          renderItem={(data) => (
            <List.Item>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <Typography.Text strong>{data.label}</Typography.Text>
                <Typography.Text>{data.value}</Typography.Text>
              </div>
            </List.Item>
          )}
        />
      </div>

      <Modal open={isModalVisible} onCancel={handleCloseModal} footer={null} width={900}>
        <Typography.Title level={3}>{t("inspections.result_detail")}</Typography.Title>
        {chemicalGroups.map((group) => {
          const groupData = chemicalData.filter((item) => group.keys.includes(item.key));
          if (groupData.length === 0) return null;

          return (
            <div key={group.title} style={{ marginBottom: 24 }}>
              <Typography.Text strong>{t(group.title)}</Typography.Text>
              <Table
                rowKey="key"
                dataSource={groupData}
                columns={columns}
                pagination={false}
                bordered
                style={{ marginTop: 8 }}
              />
            </div>
          );
        })}
      </Modal>

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
