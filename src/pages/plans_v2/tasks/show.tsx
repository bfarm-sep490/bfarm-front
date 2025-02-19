import React, { PropsWithChildren } from "react";
import { useBack, useTranslate } from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  ImageField,
  TagField,
  EmailField,
  DateField,
  TextField,
} from "@refinedev/antd";
import {
  Table,
  Space,
  Radio,
  Button,
  Breadcrumb,
  Flex,
  Typography,
} from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { HarvestedTaskList } from "./harvesting/table_list";
import { TaskList } from "./caring/table_list";

export const ShowTasksList = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const isHarvestingTask = location.pathname.includes("harvesting-task");
  const isProductingTask = location.pathname.includes("productive-task");
  const isInspectingTask = location.pathname.includes("inspecting-task");

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
        <Typography.Title level={3}>
          Danh sách công việc của kế hoạch #{id}
        </Typography.Title>
        <Flex justify="space-between" align="center">
          <Space>
            <Radio.Group
              defaultValue={
                isHarvestingTask
                  ? "harvesting"
                  : isInspectingTask
                  ? "inspecting"
                  : "productive"
              }
              onChange={(e) => {
                navigate(`/plans/${id}/${e.target.value}-tasks`);
              }}
            >
              <Radio.Button value="productive">Chăm sóc</Radio.Button>
              <Radio.Button value="harvesting">Thu hoạch</Radio.Button>
              <Radio.Button value="inspecting">Kiểm tra</Radio.Button>
            </Radio.Group>
          </Space>
          <Button
            onClick={() => navigate(`/plans`)}
            icon={<ArrowLeftOutlined />}
          >
            Plans
          </Button>
        </Flex>
        {isHarvestingTask ? (
          <HarvestedTaskList />
        ) : isInspectingTask ? (
          <TaskList type="inspecting" />
        ) : (
          <TaskList type={"productive"} />
        )}
        {children}
      </div>
    </>
  );
};
