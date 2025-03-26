/* eslint-disable prettier/prettier */
import React, { useState, useMemo } from "react";
import { type HttpError, useShow, useTranslate } from "@refinedev/core";
import { Button, List, Typography, Spin, Card, Table, Alert } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { IInspectingForm, IInspectingResult } from "@/interfaces";
import { InspectionDrawerForm } from "../drawer-form";
import { InspectionResultTag } from "../result";
import { InspectionStatusTag } from "../status";
import { useNavigate, useParams } from "react-router";
import { PageHeader } from "@refinedev/antd";
import dayjs from "dayjs";
import {
  chemicalGroups,
  columns,
  getChemicalData,
} from "../chemical/ChemicalConstants";

export const InspectionsShow: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedResult, setSelectedResult] = useState<IInspectingForm | null>(
    null
  );

  const { id } = useParams();
  const navigate = useNavigate();
  const t = useTranslate();

  const { queryResult: formQueryResult } = useShow<
    { data: IInspectingForm[] },
    HttpError
  >({
    resource: "inspecting-forms",
    id,
    queryOptions: { enabled: !!id },
  });

  const { queryResult: resultQueryResult } = useShow<
    { data: IInspectingResult[] },
    HttpError
  >({
    resource: "inspecting-results",
    id,
    queryOptions: { enabled: !!id },
  });

  const isLoading = formQueryResult.isLoading || resultQueryResult.isLoading;

  const inspection = useMemo(
    () =>
      (formQueryResult.data as { data: IInspectingForm[] } | undefined)
        ?.data?.[0],
    [formQueryResult.data]
  );

  const inspectionResult = useMemo(
    () =>
      (resultQueryResult.data as { data: IInspectingResult[] } | undefined)
        ?.data?.[0],
    [resultQueryResult.data]
  );

  const handleBack = () => navigate(-1);

  const handleEdit = () => {
    if (inspection) {
      const formattedInspection = {
        ...inspection,
        start_date: inspection.start_date
          ? dayjs(inspection.start_date).toISOString()
          : "",
        end_date: inspection.end_date
          ? dayjs(inspection.end_date).toISOString()
          : "",
      };
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

  const chemicalData = getChemicalData(inspectionResult);

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

      <Card
        title={
          <Typography.Title level={4} style={{ margin: 0 }}>
            Chi tiết
          </Typography.Title>
        }
      >
        <List
          dataSource={[
            { label: "Inspection ID", value: inspection.id },
            { label: "Plan Name", value: inspection.plan_name },
            { label: "Inspector Name", value: inspection.inspector_name },
            { label: "Task Name", value: inspection.task_name },
            { label: "Description", value: inspection.description || "N/A" },
            { label: "Task Type", value: inspection.task_type },
            {
              label: "Can Harvest",
              value: inspection.can_harvest ? "Yes" : "No",
            },
            {
              label: "Status",
              value: <InspectionStatusTag value={inspection?.status} />,
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
      </Card>
      <Card
        title={
          <Typography.Title level={4} style={{ margin: 0 }}>
            Kết quả
          </Typography.Title>
        }
      >
        <List
          dataSource={[
            {
              label: "Result Content",
              value: inspection.result_content || "N/A",
            },
            {
              label: "Evaluated Result",
              value: (
                <InspectionResultTag
                  value={inspection.inspecting_results?.evaluated_result}
                />
              ),
            },
            {
              label: "Result Images",
              value:
                inspection.inspecting_results?.result_images?.length > 0
                  ? "Available"
                  : "No Images",
            },
            {
              label: "Number of Samples",
              value: inspection.number_of_sample ?? "N/A",
            },
            {
              label: "Sample Weight",
              value: inspection.sample_weight ?? "N/A",
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
      </Card>

      <Card
        title={
          <Typography.Title level={4} style={{ margin: 0 }}>
            Thời gian
          </Typography.Title>
        }
      >
        <List
          dataSource={[
            {
              label: "Start Date",
              value: new Date(inspection.start_date).toLocaleDateString(),
            },
            {
              label: "End Date",
              value: new Date(inspection.end_date).toLocaleDateString(),
            },
            {
              label: "Completed Date",
              value: inspection.complete_date
                ? new Date(inspection.complete_date).toLocaleDateString()
                : "N/A",
            },
            {
              label: "Created At",
              value: new Date(inspection.created_at).toLocaleDateString(),
            },
            { label: "Created By", value: inspection.created_by || "N/A" },
            {
              label: "Updated At",
              value: inspection.updated_at
                ? new Date(inspection.updated_at).toLocaleDateString()
                : "N/A",
            },
            { label: "Updated By", value: inspection.updated_by || "N/A" },
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
      </Card>
      <Card
        style={{ marginBottom: 24, boxShadow: "none" }}
        bodyStyle={{ padding: 0 }}
        title={
          <Typography.Title level={4} style={{ margin: 0 }}>
            Kết quả kiểm nghiệm chỉ tiêu an toàn thực phẩm
          </Typography.Title>
        }
      >
        {chemicalGroups.map((group) => {
          const groupData = chemicalData.filter((item) =>
            group.keys.includes(item.key)
          );
          if (groupData.length === 0) return null;

          return (
            <Card
              key={group.title}
              type="inner"
              title={<Typography.Text strong>{group.title}</Typography.Text>}
              style={{ marginBottom: 16, padding: 0 }}
            >
              <Table
                rowKey="key"
                dataSource={groupData}
                columns={columns}
                pagination={false}
                bordered
              />
            </Card>
          );
        })}
      </Card>

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
    </div>
  );
};
