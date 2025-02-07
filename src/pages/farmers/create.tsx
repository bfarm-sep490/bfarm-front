import { FarmerDrawerForm } from "@/components/farmer";
import { useGetToPath, useGo } from "@refinedev/core";
import { useSearchParams } from "react-router";

export const FarmerCreate = () => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  return (
    <FarmerDrawerForm
      action="create"
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
