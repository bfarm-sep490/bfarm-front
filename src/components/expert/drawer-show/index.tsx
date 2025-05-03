import {
  type BaseKey,
  type HttpError,
  useGetToPath,
  useGo,
  useNavigation,
  useShow,
  useTranslate,
} from "@refinedev/core";
import { Avatar, Button, Divider, Flex, Grid, List, Typography, theme, Tag } from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { DateField, DeleteButton, TextField } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { ExpertStatus, IExpert } from "@/interfaces";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

const ExpertStatusTag = ({ status }: { status: boolean }) => {
  const colorMap = {
    true: "green",
    false: "red",
  };

  return (
    <Tag color={colorMap[status.toString() as "true" | "false"]}>
      {status ? "Hoạt động" : "Không hoạt động"}
    </Tag>
  );
};

export const ExpertDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { query: queryResult } = useShow<any, HttpError>({
    resource: "experts",
    id: props?.id,
  });
  const expert = queryResult?.data?.data;

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
      <Flex vertical align="center" justify="center">
        <Avatar
          shape="square"
          style={{
            aspectRatio: 1,
            objectFit: "contain",
            width: "240px",
            height: "240px",
            margin: "16px auto",
            borderRadius: "8px",
          }}
          src={expert?.avatar_image}
          alt={expert?.name}
        />
      </Flex>
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
          <Typography.Title level={5}>{expert?.name}</Typography.Title>
        </Flex>

        <Divider style={{ margin: 0, padding: 0 }} />
        <List
          dataSource={[
            {
              label: (
                <Typography.Text type="secondary">{t("experts.fields.phone")}</Typography.Text>
              ),
              value: expert?.phone,
            },
            {
              label: (
                <Typography.Text type="secondary">{t("experts.fields.email")}</Typography.Text>
              ),
              value: expert?.email,
            },
            {
              label: (
                <Typography.Text type="secondary">{t("experts.fields.status")}</Typography.Text>
              ),
              value: expert?.is_active && <ExpertStatusTag status={expert?.is_active} />,
            },
            {
              label: (
                <Typography.Text type="secondary">{t("experts.fields.created_at")}</Typography.Text>
              ),
              value: <DateField format="DD/MM/YYYY" value={expert?.created_at} />,
            },
            {
              label: (
                <Typography.Text type="secondary">{t("experts.fields.updated_at")}</Typography.Text>
              ),
              value: expert?.updated_at ? (
                <DateField value={expert?.updated_at} />
              ) : (
                <TextField value={t("experts.fields.not_updated")} />
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
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: "16px 16px 16px 0",
        }}
      >
        <DeleteButton
          type="text"
          recordItemId={expert?.id}
          resource="experts"
          onSuccess={handleDrawerClose}
        />
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            if (props?.onEdit) {
              return props.onEdit();
            }

            return go({
              to: `${editUrl("experts", expert?.id?.toString() || "")}`,
              query: { to: "/experts" },
              options: { keepQuery: true },
              type: "replace",
            });
          }}
        >
          {t("actions.edit")}
        </Button>
      </Flex>
    </Drawer>
  );
};
