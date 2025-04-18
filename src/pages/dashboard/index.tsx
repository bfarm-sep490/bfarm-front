import React, { useEffect, useMemo, useState } from "react";
import { Card, Flex, Progress, Table, theme, Typography, Image, Empty } from "antd";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useList } from "@refinedev/core";
import { DateField, TextField } from "@refinedev/antd";
import InfiniteScroll from "react-infinite-scroll-component";

import { StatusTag } from "@/components/caring-task/status-tag";
import { OrderStatusTag } from "@/components/orders/order-status";
import { DashboardPieOrders } from "@/components/dashboard/dashboard-pie-orders";
import { RemainingProductsTable } from "@/components/dashboard/table-remaining-products";
import { DashboardOrdersTracking } from "@/components/dashboard/dashboard-orders-tracking";
import { DashboardPlanTracking } from "@/components/dashboard/dashboard-plans-tracking";
import { DashboardTopPlants } from "@/components/dashboard/dashboard-top-plants";
import { DashboardTransactions } from "@/components/dashboard/dashboard-transactions";

type OrderStatus =
  | "PendingConfirmation"
  | "PendingDeposit"
  | "Cancel"
  | "Reject"
  | "Deposit"
  | "Paid";

type PlanStatus = "Ongoing" | "Complete" | "Cancel";

interface Plant {
  id: string;
  plant_name: string;
  image_url?: string;
  number_order?: number;
}

interface Order {
  id: string;
  status: OrderStatus;
  plant_id?: string;
  retailer_name?: string;
  deposit_price: number;
  estimate_pick_up_date: string;
  preorder_quantity: number;
  created_at: string;
}

interface Plan {
  id: string;
  plan_name: string;
  start_date: string;
  end_date: string;
  status: PlanStatus;
  plant_id?: string;
  yield_name?: string;
}

export const DashboardPage: React.FC = () => {
  const [activeOrderTab, setActiveOrderTab] = useState<"Pending" | "PendingConfirm" | "Deposit">(
    "Pending",
  );
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [pendingConfirmOrders, setPendingConfirmOrders] = useState<Order[]>([]);
  const [depositeOrders, setDepositeOrders] = useState<Order[]>([]);
  const { token } = theme.useToken();
  const [visiblePlants, setVisiblePlants] = useState(5);

  const { data: harvestingProductData, isLoading: harvestingProductLoading } = useList<any>({
    resource: "harvesting-product",
  });

  const { data: packagingProductData, isLoading: packagingProductLoading } = useList<any>({
    resource: "packaging-products",
  });

  const { data: orderData, isLoading: orderLoading } = useList<Order>({
    resource: "orders",
  });

  const { data: plantData, isLoading: plantLoading } = useList<Plant>({
    resource: "plants",
  });

  const { data: plansData, isLoading: plansLoading } = useList<Plan>({
    resource: "plans",
    filters: [
      {
        field: "status",
        operator: "eq",
        value: "Ongoing",
      },
    ],
  });
  const { data: transactionsData, isLoading: transactionsLoading } = useList<any>({
    resource: "transactions/dashboard",
  });

  return (
    <>
      <Flex gap={10} style={{ marginBottom: 10 }}>
        <DashboardTransactions
          transactionsData={transactionsData}
          loading={transactionsLoading}
          style={{ width: "70%" }}
        />
        <DashboardPieOrders orderData={orderData} style={{ width: "30%" }} loading={orderLoading} />
      </Flex>

      <Flex gap={10} style={{ marginBottom: 10 }}>
        <RemainingProductsTable
          loading={
            packagingProductLoading || harvestingProductLoading || orderLoading || plantLoading
          }
          style={{ width: "50%" }}
          orderData={orderData}
          plantData={plantData}
          packagingProductData={packagingProductData}
          harvestingProductData={harvestingProductData}
        />
        <DashboardOrdersTracking
          orderData={orderData}
          plantData={plantData}
          loading={orderLoading || plantLoading}
          style={{ width: "50%" }}
        />
      </Flex>
      <Flex vertical={false} gap={10}>
        <DashboardPlanTracking
          style={{ width: "70%" }}
          plansData={plansData}
          plantData={plantData}
          loading={plantLoading || plansLoading}
        />
        <DashboardTopPlants
          orderData={orderData}
          plantData={plantData}
          loading={orderLoading || plantLoading}
          style={{ width: "30%" }}
        />
      </Flex>
    </>
  );
};
