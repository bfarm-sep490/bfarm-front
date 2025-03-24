import { FarmerListTable } from "@/components/farmer";
import { FarmerListTableInPlan } from "@/components/plan/farmers/list";
import { AppstoreOutlined, ArrowLeftOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { CreateButton, List } from "@refinedev/antd";
import { useBack, useGo, useNavigation } from "@refinedev/core";
import { Button, Segmented } from "antd";
import { type PropsWithChildren, useState } from "react";
import { useLocation } from "react-router";

export const FarmerListInPlan = ({ children }: PropsWithChildren) => {
  const go = useGo();
  const back = useBack();
  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();

  return (
    <>
      <Button type="text" style={{ width: "40px", height: "40px" }} onClick={() => back()}>
        <ArrowLeftOutlined style={{ width: "50px", height: "50px" }} />
      </Button>
      <List
        breadcrumb={false}
        headerButtons={(props) => [
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
            Assigned New Farmer
          </CreateButton>,
        ]}
      >
        <FarmerListTableInPlan />
        {children}
      </List>
    </>
  );
};
