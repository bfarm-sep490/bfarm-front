import { useTable } from "@refinedev/antd";
import { useParams } from "react-router";
import { CaringListTable } from "../../../components/caring-task/list-table";
import { PropsWithChildren } from "react";
import { Table, TableProps } from "antd";

export const CaringTaskListInPlan = ({ children }: PropsWithChildren) => {
  const { id } = useParams();
  const { tableProps } = useTable({
    syncWithLocation: true,
    resource: "caring-tasks",
    filters: {
      initial: [
        {
          field: "planId",
          operator: "eq",
          value: id,
        },
      ],
    },
  });
  return (
    <CaringListTable
      tableProps={tableProps}
      children={children}
      showNavigation={`/plans/${id}/caring-tasks`}
    />
  );
};
