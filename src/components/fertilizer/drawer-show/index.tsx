import React, { useState } from "react";

import {
  type BaseKey,
  type HttpError,
  useGetToPath,
  useGo,
  useShow,
  useTranslate,
} from "@refinedev/core";
import { Grid, theme, Tag } from "antd";
import { useSearchParams } from "react-router";
import { FertilizerDrawerForm } from "../drawer-form";
import { IFertilizer } from "@/interfaces";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
};

export const FertilizerDrawerShow: React.FC<Props> = ({ id, onClose }) => {
  const [isEditing, setIsEditing] = useState(false); // State mở form Edit
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow<IFertilizer, HttpError>({
    resource: "fertilizers",
    id,
  });

  const fertilizer = queryResult?.data?.data;

  const handleDrawerClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    go({
      to: searchParams.get("to") ?? getToPath({ action: "list" }) ?? "",
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  return (
    <>
      {isEditing && fertilizer && (
        <FertilizerDrawerForm
          id={fertilizer.id}
          action="edit"
          onClose={() => setIsEditing(false)}
          onMutationSuccess={() => {
            setIsEditing(false);
            queryResult.refetch();
          }}
        />
      )}
      ;
    </>
  );
};
