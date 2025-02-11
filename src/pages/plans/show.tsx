import { useParams, useNavigate } from "react-router";
import { Tabs } from "antd";
import { PlanGeneralInformation } from "../../components/plan/plan-general-infomation";
import { PlanObservation } from "../../components/plan/plan-obervation";
import { ShowActivities } from "../../components/plan/show-activities";
import { HttpError, useShow } from "@refinedev/core";
import { useEffect, useState } from "react";
import { Show } from "@refinedev/antd";

export const PlanShow: React.FC = () => {
  const { id, tab, sub } = useParams();
  const navigate = useNavigate();

  if (!id) {
    return <div>Không tìm thấy kế hoạch</div>;
  }

  const handleTabChange = (key: string) => {
    navigate(`/plans/${id}/${key}`);
  };

  return (
    <Show title="Chi tiết kế hoạch" isLoading={false} goBack="/plans">
      <Tabs centered activeKey={tab} onChange={handleTabChange}>
        <Tabs.TabPane key="information" tab="Thông tin">
          <PlanGeneralInformation id={id} />
        </Tabs.TabPane>
        <Tabs.TabPane key="obsession" tab="Theo dõi môi trường">
          <PlanObservation id={id} />
        </Tabs.TabPane>
        <Tabs.TabPane key="progress" tab="Tiến trình">
          <ShowActivities id={id} tab={tab} sub={sub} />
        </Tabs.TabPane>
      </Tabs>
    </Show>
  );
};
