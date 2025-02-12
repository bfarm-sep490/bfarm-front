import { BaseKey } from "@refinedev/core";
import Title from "antd/lib/typography/Title";
import { Button, Card, Divider, Tabs } from "antd";
import { ProductiveTaskListTable } from "../task/productive-task/list-table";
import { InspectingTaskListTable } from "../task/inspecting-task/list-table";
import { HarvestingTaskListTable } from "../task/harvesting-task/list-table";
import { PackagingTaskListTable } from "../task/packageing-task/list-table";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { set } from "lodash";

type ShowActivitiesProps = {
  id?: BaseKey;
  tab?: BaseKey;
  sub?: BaseKey;
};

export const ShowActivities = (props: ShowActivitiesProps) => {
  const navigate = useNavigate();

  const [key, setKey] = useState<string>("progress");

  useEffect(() => {
    if (props?.sub) {
      setKey(props?.tab + "/" + props?.sub);
    } else setKey(props?.tab as string);
  }, [props?.tab, props?.sub]);

  const handleTabChange = (key: string) => {
    navigate(`/plans/${props?.id}/${key}`);
  };

  return (
    <Tabs activeKey={key} onChange={handleTabChange} tabPosition="left">
      <Tabs.TabPane key="progress" tab="Tiến trình">
        {key === "progress" && (
          <div style={{ width: "100%" }}>
            <Title level={3}>Tiến trình: Giai đoạn chuẩn bị</Title>
            <Card style={{ width: "100%", backgroundColor: "transparent" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Button>Giai đoạn chuẩn bị</Button>
                <Button>Giai đoạn chăm sóc</Button>
                <Button>Giai đoạn thu hoạch</Button>
              </div>
              <Divider />
            </Card>
          </div>
        )}
      </Tabs.TabPane>

      <Tabs.TabPane key="progress/productive-tasks" tab="Báo cáo chăm sóc">
        {key === "progress/productive-tasks" && <ProductiveTaskListTable />}
      </Tabs.TabPane>

      <Tabs.TabPane key="progress/inspecting-tasks" tab="Báo cáo kiểm định">
        {key === "progress/inspecting-tasks" && <InspectingTaskListTable />}
      </Tabs.TabPane>

      <Tabs.TabPane key="progress/harvesting-tasks" tab="Báo cáo thu hoạch">
        {key === "progress/harvesting-tasks" && <HarvestingTaskListTable />}
      </Tabs.TabPane>

      <Tabs.TabPane key="progress/packaging-tasks" tab="Báo cáo đóng gói">
        {key === "progress/packaging-tasks" && <PackagingTaskListTable />}
      </Tabs.TabPane>
    </Tabs>
  );
};
