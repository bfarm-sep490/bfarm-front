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

export const PackagedProductListPage = ({ children }: PropsWithChildren) => {
  const go = useGo();

  const { replace } = useNavigation();
  const { pathname } = useLocation();
  const { createUrl } = useNavigation();

  return (
    <>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        Danh sách sản phẩm đóng gói
      </Typography.Title>
      <PackagedProductList />
      {children}
    </>
  );
};
