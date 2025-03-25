import React, { useState, useMemo } from "react";
import { type BaseKey, type HttpError, useShow, useTranslate } from "@refinedev/core";
import {
  Button,
  Divider,
  Grid,
  List,
  Typography,
  theme,
  Spin,
  Card,
  Table,
  Tag,
  Alert,
} from "antd";
import { EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { IInspectingForm, IInspectingResult } from "@/interfaces";
import { InspectionDrawerForm } from "../drawer-form";
import { InspectionResultTag } from "../result";
import { InspectionStatusTag } from "../status";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@refinedev/antd";
import dayjs from "dayjs";

export const InspectionsShow: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedResult, setSelectedResult] = useState<IInspectingForm | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const t = useTranslate();

  // Fetch inspecting form
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
    () => (formQueryResult.data as { data: IInspectingForm[] } | undefined)?.data?.[0],
    [formQueryResult.data],
  );

  const inspectionResult = useMemo(
    () => (resultQueryResult.data as { data: IInspectingResult[] } | undefined)?.data?.[0],
    [resultQueryResult.data],
  );
  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    if (inspection) {
      const formattedInspection = {
        ...inspection,
        start_date: inspection.start_date ? dayjs(inspection.start_date).toISOString() : "",
        end_date: inspection.end_date ? dayjs(inspection.end_date).toISOString() : "",
      };

      console.log("Opening Edit Form with Data:", formattedInspection);

      setSelectedResult(formattedInspection);
      setIsEditing(true);
    }
  };

  const handleCloseDrawer = () => {
    setIsEditing(false);
    setSelectedResult(null);
  };

  if (!id) return <Alert type="error" message="No inspection ID provided" />;
  if (isLoading) return <Spin size="large" />;
  if (formQueryResult.error || resultQueryResult.error)
    return <Alert type="error" message="Failed to load inspection data" />;
  if (!inspection) return <Card>No inspection data available.</Card>;
  const chemicalData = inspectionResult
    ? [
        { key: "arsen", label: "Arsenic", value: inspectionResult.arsen },
        { key: "plumbum", label: "Plumbum", value: inspectionResult.plumbum },
        { key: "cadmi", label: "Cadmium", value: inspectionResult.cadmi },
        { key: "hydragyrum", label: "Mercury", value: inspectionResult.hydrargyrum },
        { key: "salmonella", label: "Salmonella", value: inspectionResult.salmonella },
        { key: "coliforms", label: "Coliforms", value: inspectionResult.coliforms },
        { key: "ecoli", label: "E. Coli", value: inspectionResult.ecoli },
        {
          key: "glyphosate_glufosinate",
          label: "Glyphosate/Glufosinate",
          value: inspectionResult.glyphosate_glufosinate,
        },
        { key: "sulfur_dioxide", label: "Sulfur Dioxide", value: inspectionResult.sulfur_dioxide },
        { key: "methyl_bromide", label: "Methyl Bromide", value: inspectionResult.methyl_bromide },
        {
          key: "hydrogen_phosphide",
          label: "Hydrogen Phosphide",
          value: inspectionResult.hydrogen_phosphide,
        },
        {
          key: "dithiocarbamate",
          label: "Dithiocarbamate",
          value: inspectionResult.dithiocarbamate,
        },
        { key: "nitrat", label: "Nitrate", value: inspectionResult.nitrat },
        { key: "nano3_kno3", label: "Nano3/KNO3", value: inspectionResult.nano3_kno3 },
        { key: "chlorate", label: "Chlorate", value: inspectionResult.chlorate },
        { key: "perchlorate", label: "Perchlorate", value: inspectionResult.perchlorate },
      ]
    : [];
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <PageHeader
        onBack={handleBack}
        title={`Inspection Details - ${inspection.task_name}`}
        extra={[
          inspectionResult && (
            <Button key="edit" icon={<EditOutlined />} onClick={handleEdit}>
              {t("actions.edit")}
            </Button>
          ),
        ]}
      />

      <Card>
        <List
          dataSource={[
            { label: "Inspection ID", value: inspection.id },
            { label: "Plan ID", value: inspection.plan_id },
            { label: "Plan Name", value: inspection.plan_name },
            { label: "Inspector ID", value: inspection.inspector_id },
            { label: "Inspector Name", value: inspection.inspector_name },
            { label: "Task Name", value: inspection.task_name },
            { label: "Description", value: inspection.description || "N/A" },
            { label: "Task Type", value: inspection.task_type },
            { label: "Start Date", value: new Date(inspection.start_date).toLocaleDateString() },
            { label: "End Date", value: new Date(inspection.end_date).toLocaleDateString() },
            {
              label: "Completed Date",
              value: inspection.complete_date
                ? new Date(inspection.complete_date).toLocaleDateString()
                : "N/A",
            },
            { label: "Can Harvest", value: inspection.can_harvest ? "Yes" : "No" },
            { label: "Status", value: <InspectionStatusTag value={inspection?.status} /> },
            { label: "Result Content", value: inspection.result_content || "N/A" },
            { label: "Number of Samples", value: inspection.number_of_sample ?? "N/A" },
            { label: "Sample Weight", value: inspection.sample_weight ?? "N/A" },
            { label: "Created At", value: new Date(inspection.created_at).toLocaleDateString() },
            { label: "Created By", value: inspection.created_by || "N/A" },
            {
              label: "Updated At",
              value: inspection.updated_at
                ? new Date(inspection.updated_at).toLocaleDateString()
                : "N/A",
            },
            { label: "Updated By", value: inspection.updated_by || "N/A" },
            {
              label: "Inspection Result ID",
              value: inspection.inspecting_results?.result_id || "N/A",
            },
            {
              label: "Evaluated Result",
              value: (
                <InspectionResultTag value={inspection.inspecting_results?.evaluated_result} />
              ),
            },

            {
              label: "Result Images",
              value:
                inspection.inspecting_results?.result_images.length > 0 ? "Available" : "No Images",
            },
          ]}
          renderItem={(data) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Typography.Text type="secondary">{data.label}</Typography.Text>}
                title={<Typography.Text strong>{data.value}</Typography.Text>}
              />
            </List.Item>
          )}
        />
      </Card>

      <Divider />
      {inspectionResult ? (
        <Card title="Inspection Results">
          <Table
            dataSource={chemicalData}
            columns={[
              {
                title: "Indicator",
                dataIndex: "label",
                key: "label",
                render: (text) => <Typography.Text strong>{text}</Typography.Text>,
              },
              {
                title: "Value",
                dataIndex: "value",
                key: "value",
                render: (value) => <Tag color={value > 0.1 ? "red" : "green"}>{value}</Tag>,
              },
            ]}
            pagination={false}
            bordered
          />
        </Card>
      ) : (
        <Card>
          <Typography.Text>No inspecting result data available.</Typography.Text>
        </Card>
      )}

      {isEditing && selectedResult && (
        <InspectionDrawerForm
          id={selectedResult.id}
          action="edit"
          open={isEditing}
          initialValues={selectedResult}
          onClose={handleCloseDrawer}
          onMutationSuccess={() => {
            handleCloseDrawer();
          }}
        />
      )}
    </div>
  );
};
