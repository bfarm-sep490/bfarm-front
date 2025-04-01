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
import { FarmerStatus } from "@/interfaces";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
  onEdit?: () => void;
};

const FarmerStatusTag = ({ status }: { status: FarmerStatus }) => {
  const colorMap = {
    Inactive: "red",
    Active: "success",
  };

  return <Tag color={colorMap[status]}>{status}</Tag>;
};

export const FarmerDrawerShow = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const { editUrl } = useNavigation();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { query: queryResult } = useShow<any, HttpError>({
    resource: "farmers",
    id: props?.id,
  });
  const farmer = queryResult?.data?.data?.[0];

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
  const translate = useTranslate();
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
          src={farmer?.avatar_image}
          alt={farmer?.name}
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
          <Typography.Title level={5}>{farmer?.name}</Typography.Title>
        </Flex>

        <Divider style={{ margin: 0, padding: 0 }} />
        <List
          dataSource={[
            {
              label: (
                <Typography.Text type="secondary">
                  {translate("farmer.phone", "Điện thoại")}
                </Typography.Text>
              ),
              value: farmer?.phone,
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {translate("farmer.email", "Email")}
                </Typography.Text>
              ),
              value: farmer?.email,
            },

            {
              label: (
                <Typography.Text type="secondary">
                  {" "}
                  {translate("farmer.status", "Trạng thái")}
                </Typography.Text>
              ),
              value: farmer?.status && <FarmerStatusTag status={farmer.status} />,
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {" "}
                  {translate("farmer.created_at", "Ngày tạo")}
                </Typography.Text>
              ),
              value: farmer?.created_at && <DateField value={farmer?.created_at} />,
            },
            {
              label: (
                <Typography.Text type="secondary">
                  {translate("farmer.updated_at", "Ngày cập nhập")}
                </Typography.Text>
              ),
              value: farmer?.updated_at ? (
                <FarmerStatusTag status={farmer?.updated_at} />
              ) : (
                <TextField value={"Chưa cập nhập"} />
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
          recordItemId={farmer?.id}
          resource="farmers"
          onSuccess={handleDrawerClose}
        />
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            if (props?.onEdit) {
              return props.onEdit();
            }

            return go({
              to: `${editUrl("farmers", farmer?.id?.toString() || "")}`,
              query: { to: "/farmers" },
              options: { keepQuery: true },
              type: "replace",
            });
          }}
        >
          {t("actions.edit", "Cập nhập")}
        </Button>
      </Flex>
    </Drawer>
  );
};
