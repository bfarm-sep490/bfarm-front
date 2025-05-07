import { BactchListTable } from "@/components/batches/list-table";
import { List } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";

export const BatchListPage: React.FC = () => {
  const translate = useTranslate();
  return (
    <List breadcrumb={false} title={translate("batches.batches")}>
      <BactchListTable />
    </List>
  );
};
