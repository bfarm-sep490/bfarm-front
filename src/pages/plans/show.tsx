import { useParams, useNavigate } from "react-router";
import { Affix, Card, Tabs } from "antd";
import { PlanGeneralInformation } from "../../components/plan/plan-general-infomation";
import { PlanObservation } from "../../components/plan/plan-obervation";
import { ShowActivities } from "../../components/plan/show-activities";
import { Show } from "@refinedev/antd";
import { useTheme } from "antd-style";

export const PlanShow: React.FC = () => {
  const { id, "*": restPath } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  let tab, sub;
  if (restPath) {
    [tab, sub] = restPath.split("/");
  }

  if (!id) {
    return <div>Không tìm thấy kế hoạch</div>;
  }

  const activeTab = tab || "information"; // Nếu không có tab, mặc định là "information"

  const handleTabChange = (key: string) => {
    if (key !== activeTab) {
      navigate(`/plans/${id}/${key}`);
    }
  };

  return (
    <Card
      style={{
        background: theme.appearance === "dark" ? "transparent" : "white",
      }}
    >
      <Tabs
        style={{ width: "100%", height: "100%" }}
        centered
        activeKey={activeTab}
        onChange={handleTabChange}
      >
        <Tabs.TabPane key="information" tab="Thông tin">
          {activeTab === "information" && <PlanGeneralInformation id={id} />}
        </Tabs.TabPane>

        <Tabs.TabPane key="obsession" tab="Theo dõi môi trường">
          {activeTab === "obsession" && <PlanObservation id={id} />}
        </Tabs.TabPane>

        <Tabs.TabPane key="progress" tab="Tiến trình">
          {activeTab === "progress" && (
            <ShowActivities id={id} tab={tab} sub={sub} />
          )}
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};
