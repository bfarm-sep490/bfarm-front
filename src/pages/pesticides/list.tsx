import { PesticidesListCard, PesticidesListTable } from "@/components/pesticide";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { CreateButton, List } from "@refinedev/antd";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { Segmented } from "antd";
import { type PropsWithChildren, useState } from "react";
import { useLocation } from "react-router";

type View = "table" | "card";

export const PesticidesList = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();

  const [view, setView] = useState<View>(
    (localStorage.getItem("pesticide-view") as View) || "table",
  );

  const handleViewChange = (value: View) => {
    replace("");

    setView(value);
    localStorage.setItem("pesticide-view", value);
  };

  const t = useTranslate();

  return (
    <List
      breadcrumb={false}
      title={t("pesticides.pesticides")}
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
              to: `${createUrl("pesticides")}`,
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
          Thêm Thuốc
        </CreateButton>,
      ]}
    >
      {view === "table" && <PesticidesListTable />}
      {view === "card" && <PesticidesListCard />}
      {children}
    </List>
  );
};
