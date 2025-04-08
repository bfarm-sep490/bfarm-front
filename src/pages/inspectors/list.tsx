/* eslint-disable prettier/prettier */
import { InspectorListTable } from "@/components/inspectors/table-list";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { CreateButton, List } from "@refinedev/antd";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { Segmented } from "antd";
import { type PropsWithChildren, useState } from "react";
import { useLocation } from "react-router";

type View = "table" | "card";

export const InspectorList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();

  const [view, setView] = useState<View>(
    (localStorage.getItem("inspectors-view") as View) || "table"
  );

  const handleViewChange = (value: View) => {
    replace("");

    setView(value);
    localStorage.setItem("farmers-view", value);
  };

  const t = useTranslate();

  return (
    <List
      breadcrumb={false}
      title={t("resources.inspectors.name", "Nhà kiểm định")}
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
              to: `${createUrl("inspectors")}`,
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
          {t("inspectors.create")}
        </CreateButton>,
      ]}
    >
      {view === "table" && <InspectorListTable />}
      {view === "card" && <InspectorListTable />}
      {children}
    </List>
  );
};
