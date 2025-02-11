import { ExpertDrawerForm } from "@/components/expert";
import { useGetToPath, useGo } from "@refinedev/core";
import { useSearchParams } from "react-router";

export const ExpertEdit = () => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  return (
    <ExpertDrawerForm
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
