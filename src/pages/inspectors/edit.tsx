import { FarmerDrawerForm } from "@/components/farmer";
import { InspectorDrawerForm } from "@/components/inspectors/drawer-form";
import { useGetToPath, useGo } from "@refinedev/core";
import { useSearchParams } from "react-router";

export const InspectorEdit = () => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  return (
    <InspectorDrawerForm
      action="edit"
      onMutationSuccess={() => {
        go({
          to:
            searchParams.get("to") ??
            getToPath({
              action: "list",
            }) ??
            "",
          query: {
            to: undefined,
          },
          options: {
            keepQuery: true,
          },
          type: "replace",
        });
      }}
    />
  );
};
