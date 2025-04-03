import { FarmerListTable } from "@/components/farmer";
import { FarmerListTableInPlan } from "@/components/plan/farmers/list";
import { HarvestingProductList } from "@/components/production/harvesting/list";
import { PackagedProductList } from "@/components/production/packaging/list";
import { AppstoreOutlined, ArrowLeftOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { CreateButton, List } from "@refinedev/antd";
import { useBack, useGo, useNavigation } from "@refinedev/core";
import { Button, Segmented, Typography } from "antd";
import { type PropsWithChildren, useState } from "react";
import { useLocation } from "react-router";

export const HarvestingProductionListPage = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        Danh sách sản phẩm thu hoạch
      </Typography.Title>
      <HarvestingProductList />
      {children}
    </>
  );
};
