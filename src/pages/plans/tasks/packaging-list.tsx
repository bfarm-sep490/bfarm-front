import { useTable } from "@refinedev/antd";
import { useParams } from "react-router";
import { CaringListTable } from "../../../components/caring-task/list-table";
import { PropsWithChildren } from "react";
import { Table, TableProps } from "antd";
import { PakagingTaskList } from "../../../components/packaging-task/list-table";

export const PackagingTaskListInPlan = ({ children }: PropsWithChildren) => {
  const { id } = useParams();
  const { tableProps } = useTable({
    syncWithLocation: true,
    resource: "caring-tasks",
  });
  return (
    <PakagingTaskList
      tableProps={tableProps}
      children={children}
      showNavigation={`/plans/${id}/packaging-tasks`}
    />
  );
};
