import { HarvestingProductList } from "@/components/production/harvesting/list";
import { List } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import { type PropsWithChildren } from "react";

export const HarvestingProductionListPage = ({ children }: PropsWithChildren) => {
  const translate = useTranslate();
  return (
    <List breadcrumb={false} title={translate("harvesting-products.harvesting-products")}>
      <HarvestingProductList />
      {children}
    </List>
  );
};
