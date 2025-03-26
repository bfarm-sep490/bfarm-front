import { useParams } from "react-router";
import PackagingTaskForm from "@/components/packaging-task/drawer-form";
import { InspectionListTable } from "@/components/inspection";

export const InspectingTaskList = () => {
  const { taskId } = useParams();
  return <InspectionListTable />;
};
