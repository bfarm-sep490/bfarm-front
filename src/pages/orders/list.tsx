import { OrderListTable } from "@/components/orders/list-table.tsx";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { useBack, useTranslate } from "@refinedev/core";
import { Button } from "antd";
import { type PropsWithChildren } from "react";
import { useParams } from "react-router";

export const OrdersList = ({ children }: PropsWithChildren) => {
  const { id } = useParams();
  const back = useBack();
  const translate = useTranslate();
  return (
    <List canCreate={false} breadcrumb={false} title={translate("orders.orders")}>
      {id && (
        <Button
          type="text"
          style={{ width: "40px", height: "40px", marginBottom: 20 }}
          onClick={() => back()}
        >
          <ArrowLeftOutlined style={{ width: "50px", height: "50px" }} />
        </Button>
      )}
      <OrderListTable />
      {children}
    </List>
  );
};
