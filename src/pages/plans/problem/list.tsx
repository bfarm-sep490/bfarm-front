import { PropsWithChildren } from "react";
import { useTable } from "@refinedev/antd";
import { Button, Flex, Typography } from "antd";
import { useNavigate, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ProblemListTable } from "../../../components/problem/list-table";

export const ShowProblemList = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { tableProps } = useTable({
    resource: `plans/${id}/problems`,
  });
  return (
    <>
      <Button
        type="text"
        style={{ width: "40px", height: "40px" }}
        onClick={() => navigate(`/plans/${id}`)}
      >
        <ArrowLeftOutlined style={{ width: "50px", height: "50px" }} />
      </Button>
      <div>
        <Flex justify="end" align="center">
          <Button onClick={() => navigate(`/plans`)} icon={<ArrowLeftOutlined />}>
            Plans
          </Button>
        </Flex>
        <Typography.Title level={3}>Danh sách vấn đề của kế hoạch #{id}</Typography.Title>
        <ProblemListTable
          tableProps={tableProps}
          showNavigation={`/plans/${id}/problems`}
          children={children}
        />
      </div>
    </>
  );
};
