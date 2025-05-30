import { PropsWithChildren } from "react";
import { BaseRecord, useTranslate } from "@refinedev/core";
import { DateField, TextField } from "@refinedev/antd";
import { Table, Typography, TableProps, Flex } from "antd";
import { useNavigate, useParams } from "react-router";
import { ProblemStatusTag } from "./status-tag";

type TableProblemProps = {
  tableProps: TableProps<BaseRecord>;
  showNavigation?: string;
};
export const ProblemListTable = ({
  children,
  tableProps,
  showNavigation,
}: PropsWithChildren & TableProblemProps) => {
  const { id } = useParams();
  const translate = useTranslate();

  const navigate = useNavigate();

  return (
    <Flex gap={16} vertical>
      <Typography.Title level={3}>{translate("problems.problems")}</Typography.Title>
      <Table
        onRow={(row) => ({
          onClick: () => {
            navigate(`/problems/${row.id}`);
          },
        })}
        rowHoverable
        {...tableProps}
        rowKey="id"
        scroll={{ x: "max-content" }}
      >
        <Table.Column
          dataIndex="id"
          title={translate("ID")}
          render={(value) => <TextField value={"#" + value} />}
        />
        <Table.Column dataIndex="problem_name" title={translate("problem_name", "Tên vấn đề")} />
        <Table.Column dataIndex="farmer_name" title={translate("farmer_name", "Tên nông dân")} />
        <Table.Column dataIndex="plan_name" title={translate("plan_name", "Tên kế hoạch")} />
        <Table.Column
          dataIndex="created_date"
          title={translate("problem.created_date", "Ngày phát sinh")}
          render={(value) => <DateField format="DD/MM/YYYY" value={value} />}
        />

        <Table.Column
          dataIndex="status"
          title={translate("problem.status", "Trạng thái")}
          render={(value) => <ProblemStatusTag status={value} />}
        />
      </Table>

      {children}
    </Flex>
  );
};
