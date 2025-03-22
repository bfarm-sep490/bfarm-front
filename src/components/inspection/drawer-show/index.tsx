import React, { useState } from "react";
import {
  type BaseKey,
  type HttpError,
  useGetToPath,
  useGo,
  useShow,
  useTranslate,
} from "@refinedev/core";
import { Avatar, Button, Divider, Flex, Grid, List, Typography, theme, Spin, Tag } from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { DeleteButton } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { IInspectingForm, IInspectingResult } from "@/interfaces";
import { InspectionDrawerForm } from "../drawer-form";
import { InspectionResultTag } from "../result";
import { InspectionStatusTag } from "../status";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
};

export const InspectionDrawerShow: React.FC<Props> = ({ id, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();

  // Fetch inspecting form
  const { queryResult: formQueryResult } = useShow<{ data: IInspectingForm[] }, HttpError>({
    resource: "inspecting-forms",
    id,
    queryOptions: { enabled: !!id },
  });

  // Fetch inspecting result
  const { queryResult: resultQueryResult } = useShow<{ data: IInspectingResult[] }, HttpError>({
    resource: "inspecting-results",
    id,
    queryOptions: { enabled: !!id },
  });

  const inspection = (formQueryResult.data as { data: IInspectingForm[] } | undefined)?.data?.[0];
  const inspectionResult = (resultQueryResult.data as { data: IInspectingResult[] } | undefined)
    ?.data?.[0];

  console.log("Inspection Status:", inspection?.status);
  console.log("Evaluated Result:", inspectionResult?.evaluated_result);

  const handleDrawerClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    go({
      to: searchParams.get("to") ?? getToPath({ action: "list" }) ?? "",
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  if (formQueryResult.isFetching || resultQueryResult.isFetching) {
    return <Spin size="large" />;
  }

  // If no data is available, show a message
  if (!inspection) {
    return (
      <Typography.Text style={{ padding: "16px" }}>No inspection data available.</Typography.Text>
    );
  }

  return (
    <>
      {!isEditing && (
        <Drawer
          open={!!id}
          width={screens.sm ? "40%" : "100%"}
          zIndex={1001}
          onClose={handleDrawerClose}
        >
          <>
            <Flex vertical align="center" justify="center">
              <Avatar
                shape="square"
                style={{
                  aspectRatio: 1,
                  objectFit: "contain",
                  width: "240px",
                  height: "240px",
                  margin: "16px auto",
                  borderRadius: "8px",
                }}
                src="/images/inspector-default-img.png"
                alt={inspection.task_name}
              />
            </Flex>

            <Flex vertical style={{ backgroundColor: token.colorBgContainer }}>
              <Flex vertical style={{ padding: "16px" }}>
                <Typography.Title level={5}>{inspection.task_name}</Typography.Title>
                <Typography.Text type="secondary">{inspection.description}</Typography.Text>
              </Flex>
            </Flex>

            <Divider />

            <List
              dataSource={[
                { label: "Plan ID", value: inspection.plan_id },
                { label: "Plan Name", value: inspection.plan_name },
                { label: "Inspector ID", value: inspection.inspector_id },
                { label: "Inspector Name", value: inspection.inspector_name },
                { label: "Task Type", value: inspection.task_type },
                {
                  label: "Start Date",
                  value: new Date(inspection.start_date).toLocaleDateString(),
                },
                { label: "End Date", value: new Date(inspection.end_date).toLocaleDateString() },
                {
                  label: "Completed Date",
                  value: inspection.completed_date
                    ? new Date(inspection.completed_date).toLocaleDateString()
                    : "N/A",
                },
                { label: "Can Harvest", value: inspection.can_harvest ? "Yes" : "No" },
                {
                  label: "Status",
                  value: <InspectionStatusTag value={inspection?.status} />,
                },
                { label: "Number of Samples", value: inspection.number_of_sample ?? "N/A" },
                { label: "Sample Weight", value: inspection.sample_weight ?? "N/A" },
                { label: "Result Content", value: inspection.result_content ?? "N/A" },
                {
                  label: "Evaluated Result",
                  value: <InspectionResultTag value={inspectionResult?.evaluated_result} />,
                },

                { label: "Arsenic", value: inspectionResult?.arsen ?? "N/A" },
                { label: "Plumbum", value: inspectionResult?.plumbum ?? "N/A" },
                { label: "Cadmium", value: inspectionResult?.cadmi ?? "N/A" },
                { label: "Mercury", value: inspectionResult?.hydragyrum ?? "N/A" },
                { label: "Salmonella", value: inspectionResult?.salmonella ?? "N/A" },
                { label: "Coliforms", value: inspectionResult?.coliforms ?? "N/A" },
                { label: "E. Coli", value: inspectionResult?.ecoli ?? "N/A" },
                {
                  label: "Glyphosate/Glufosinate",
                  value: inspectionResult?.glyphosate_glufosinate ?? "N/A",
                },
                { label: "Sulfur Dioxide", value: inspectionResult?.sulfur_dioxide ?? "N/A" },
                { label: "Methyl Bromide", value: inspectionResult?.methyl_bromide ?? "N/A" },
                {
                  label: "Hydrogen Phosphide",
                  value: inspectionResult?.hydrogen_phosphide ?? "N/A",
                },
                { label: "Dithiocarbamate", value: inspectionResult?.dithiocarbamate ?? "N/A" },
                { label: "Nitrate", value: inspectionResult?.nitrat ?? "N/A" },
                { label: "Nano3/KNO3", value: inspectionResult?.nano3_kno3 ?? "N/A" },
                { label: "Chlorate", value: inspectionResult?.chlorate ?? "N/A" },
                { label: "Perchlorate", value: inspectionResult?.perchlorate ?? "N/A" },
              ]}
              renderItem={(data) => (
                <List.Item>
                  <List.Item.Meta
                    style={{ padding: "0 16px" }}
                    avatar={<Typography.Text type="secondary">{data.label}</Typography.Text>}
                    title={data.value}
                  />
                </List.Item>
              )}
            />
            <Flex align="center" justify="space-between" style={{ padding: "16px 16px 16px 0" }}>
              <DeleteButton
                type="text"
                recordItemId={inspection.id}
                resource="inspecting-forms"
                onSuccess={handleDrawerClose}
              />
              <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                {t("actions.edit")}
              </Button>
            </Flex>
          </>
        </Drawer>
      )}

      {isEditing && inspection && (
        <InspectionDrawerForm
          id={inspection.id}
          action="edit"
          open={isEditing}
          onClose={() => setIsEditing(false)}
          onMutationSuccess={() => {
            setIsEditing(false);
            formQueryResult.refetch();
            resultQueryResult.refetch();
          }}
        />
      )}
    </>
  );
};
