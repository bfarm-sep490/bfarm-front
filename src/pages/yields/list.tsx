import { YieldListCard, YieldListTable } from "@/components/yield";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { CreateButton, List } from "@refinedev/antd";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { Segmented } from "antd";
import { type PropsWithChildren, useState } from "react";
import { Outlet, useLocation } from "react-router";

type View = "table" | "card";

export const YieldsList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();

  const [view, setView] = useState<View>((localStorage.getItem("yield-view") as View) || "table");

  const handleViewChange = (value: View) => {
    replace("");

    setView(value);
    localStorage.setItem("yield-view", value);
  };

  const t = useTranslate();

  return (
    <List
      breadcrumb={false}
      title={t("resources.yield.name", "Khu đất")}
      headerButtons={(props) => [
        <Segmented<View>
          key="view"
          size="large"
          value={view}
          style={{ marginRight: 24 }}
          options={[
            {
              label: "",
              value: "table",
              icon: <UnorderedListOutlined />,
            },
            {
              label: "",
              value: "card",
              icon: <AppstoreOutlined />,
            },
          ]}
          onChange={handleViewChange}
        />,
        <CreateButton
          {...props.createButtonProps}
          key="create"
          size="large"
          onClick={() => {
            return go({
              to: `${createUrl("yield")}`,
              query: {
                to: pathname,
              },
              options: {
                keepQuery: true,
              },
              type: "replace",
            });
          }}
        >
          {t("yield.create")}
        </CreateButton>,
      ]}
    >
      {view === "table" && <YieldListTable />}
      {view === "card" && <YieldListCard />}
      {children}
      <Outlet />
    </List>
  );
};
