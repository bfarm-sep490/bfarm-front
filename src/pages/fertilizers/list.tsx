import { AntdInferencer } from "@refinedev/inferencer/antd";
import { PropsWithChildren } from "react";

export const FertilizersList = ({ children }: PropsWithChildren) => {
  return (
    <>
      <AntdInferencer />
      {children}
    </>
  );
};
