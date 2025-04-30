import { FarmerListTable } from "@/components/farmer";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { CreateButton, List } from "@refinedev/antd";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { Segmented } from "antd";
import { type PropsWithChildren, useState } from "react";
import { useLocation } from "react-router";

type View = "table" | "card";

export const FarmerList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();

  const [view, setView] = useState<View>((localStorage.getItem("farmers-view") as View) || "table");

  const handleViewChange = (value: View) => {
    replace("");

    setView(value);
    localStorage.setItem("farmers-view", value);
  };

  const t = useTranslate();

  return (
    <List
      breadcrumb={false}
      title={t("resources.farmers.name", "Nông dân")}
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
              to: `${createUrl("farmers")}`,
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
          {t("farmer.add_farmer", "Tạo mới")}{" "}
        </CreateButton>,
      ]}
    >
      {view === "table" && <FarmerListTable />}
      {view === "card" && <FarmerListTable />}
      {children}
    </List>
  );
};
