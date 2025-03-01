import { PropsWithChildren } from "react";
import { ProblemListInProblem } from "../../components/problem/list-table";

export const ProblemListInProblems: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  return <ProblemListInProblem></ProblemListInProblem>;
};
