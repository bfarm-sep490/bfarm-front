import { useParams } from "react-router";
import { CaringTaskPage } from "../../../components/caring-task/drawer-form";

export const CaringCreate = () => {
  const { taskId } = useParams();
  return <CaringTaskPage action={"create"} />;
};
