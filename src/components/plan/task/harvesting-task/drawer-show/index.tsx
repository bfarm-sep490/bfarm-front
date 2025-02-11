import {
  type BaseKey,
  type HttpError,
  useGetToPath,
  useGo,
  useNavigation,
  useShow,
  useTranslate,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Grid,
  List,
  Typography,
  theme,
  Tag,
} from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../../../drawer";
import { DateField, DeleteButton, TextField } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { IProductiveTask } from "../../../../../interfaces";

type Props = {
  productive_task_id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

export const HarvestingTaskDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();
  const { query: queryResult } = useShow<IProductiveTask, HttpError>({
    resource: "productions",
    id: props?.productive_task_id,
  });
  const production_task = queryResult.data?.data;
  const handleDrawerClose = () => {
    if (props?.onClose) {
      props.onClose();
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
    <Drawer
      open={true}
      width={breakpoint.sm ? "378px" : "100%"}
      zIndex={1001}
      onClose={handleDrawerClose}
    >
      <Flex
        vertical
        style={{
          backgroundColor: token.colorBgContainer,
        }}
      >
        <Flex
          vertical
          style={{
            padding: "16px",
          }}
        >
          <Typography.Title level={5}>
            {production_task?.task_name}
          </Typography.Title>
        </Flex>

        <Divider style={{ margin: 0, padding: 0 }} />
        <List
          dataSource={[
            {
              label: (
                <Typography.Text type="secondary">Task Type</Typography.Text>
              ),
              value: production_task?.task_type && (
                <TextField value={production_task?.task_type} />
              ),
            },
            {
              label: (
                <Typography.Text type="secondary">Start Date</Typography.Text>
              ),
              value: production_task?.start_date && (
                <DateField
                  value={production_task?.start_date}
                  format="DD/MM/YYYY"
                />
              ),
            },
            {
              label: (
                <Typography.Text type="secondary">End Date</Typography.Text>
              ),
              value: production_task?.end_date && (
                <DateField
                  value={production_task?.end_date}
                  format="DD/MM/YYYY"
                />
              ),
            },
            {
              label: (
                <Typography.Text type="secondary">
                  Completed Date
                </Typography.Text>
              ),
              value: production_task?.complete_date && (
                <DateField
                  value={production_task?.complete_date}
                  format="DD/MM/YYYY"
                />
              ),
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                style={{
                  padding: "0 16px",
                }}
                avatar={item.label}
                title={item.value}
              />
            </List.Item>
          )}
        />
      </Flex>
    </Drawer>
  );
};
