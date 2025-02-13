
import { SeedDrawerForm } from "@/components/seed/drawer-form";
import { useGetToPath, useGo } from "@refinedev/core";
import { useSearchParams } from "react-router";

export const SeedCreate = () => {
      const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
    return <SeedDrawerForm action="create" onMutationSuccess={() => {
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
    />;
};
