import { useList, useNavigation } from "@refinedev/core";

import { Map, MapMarker } from "../..";
import type { IOrder } from "../../../interfaces";
import Title from "antd/lib/typography/Title";
import { Button, Card, Divider, Tabs } from "antd";

const item_1 = (
  <>
    <div>
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
        <Divider></Divider>
      </Card>
    </div>
  </>
);
const item_2 = (
  <>
    <p>Báo cáo chăm sóc</p>
  </>
);
const item_3 = (
  <>
    <p>Báo cáo kiểm định</p>
  </>
);

const item_4 = (
  <>
    <p>Báo cáo thu hoạch</p>
  </>
);

const item_5 = (
  <>
    <p>Báo cáo đóng gói</p>
  </>
);
export const ShowActivities: React.FC = () => {
  const items = [
    {
      key: "1",
      label: "Tiến trình",
      children: item_1,
    },
    {
      key: "2",
      label: "Báo cáo chăm sóc",
      children: item_2,
    },

    {
      key: "3",
      label: "Báo cáo kiểm định",
      children: item_3,
    },

    {
      key: "4",
      label: "Báo cáo thu hoạch",
      children: item_4,
    },

    {
      key: "5",
      label: "Báo cáo đóng gói",
      children: item_5,
    },
  ];
  return <Tabs tabPosition={"left"} defaultActiveKey="1" items={items} />;
};
