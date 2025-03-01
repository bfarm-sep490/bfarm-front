import ReportProblemModal from "../../components/problem/report-modals";

const CancelModal = () => {
  return <ReportProblemModal action="cancel" onReport={() => { } } id={1} isOpen={false} onClose={function (): void {
      throw new Error("Function not implemented.");
  } } />;
};
