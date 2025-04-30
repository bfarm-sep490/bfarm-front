import { ExpertListTable } from "@/components/expert";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { CreateButton, List } from "@refinedev/antd";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { Segmented } from "antd";
import { type PropsWithChildren, useState } from "react";
import { useLocation } from "react-router";

type View = "table" | "card";

export const ExpertList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();

  const [view, setView] = useState<View>((localStorage.getItem("experts-view") as View) || "table");

  const handleViewChange = (value: View) => {
    replace("");

    setView(value);
    localStorage.setItem("experts-view", value);
  };

  const t = useTranslate();

  return (
    <List
      breadcrumb={false}
      title={t("resources.experts.name", "Chuyên gia")}
      headerButtons={(props: any) => [
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
              to: `${createUrl("experts")}`,
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
          {t("experts.form.add_expert", "Tạo mới")}{" "}
        </CreateButton>,
      ]}
    >
      {view === "table" && <ExpertListTable />}
      {view === "card" && <ExpertListTable />}
      {children}
    </List>
  );
};
