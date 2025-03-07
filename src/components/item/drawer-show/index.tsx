import React, { useState } from "react";
import {
  type BaseKey,
  type HttpError,
  useGetToPath,
  useGo,
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
import { Drawer } from "../../drawer";
import { DeleteButton } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { IItem } from "@/interfaces";
import { ItemDrawerForm } from "../drawer-form";
import { ItemStatusTag } from "../status";
import { ItemtypeTag } from "../type";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
};

export const ItemDrawerShow: React.FC<Props> = ({ id, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow<IItem, HttpError>({
    resource: "items",
    id: id,
  });

  const item = queryResult?.data?.data;

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
      {!isEditing && (
        <Drawer
          open={!!id}
          width={breakpoint.sm ? "400px" : "100%"}
          zIndex={1001}
          onClose={handleDrawerClose}
        >
          {item && (
            <>
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
                  src={item.image}
                  alt={item.name}
                />
              </Flex>
              <Flex
                vertical
                style={{ backgroundColor: token.colorBgContainer }}
              >
                <Flex vertical style={{ padding: "16px" }}>
                  <Typography.Title level={5}>{item.name}</Typography.Title>
                </Flex>
              </Flex>

              <Divider />

              <List
                dataSource={[
                  { label: "Description", value: item.description },
                  {
                    label: "Quantity",
                    value: `${item.quantity} ${item.unit}`,
                  },
                  {
                    label: "Type",
                    value: <ItemtypeTag value={item.type} />,
                  },
                  {
                    label: "Status",
                    value: <ItemStatusTag value={item.status} />,
                  },
                ]}
                renderItem={(itemData) => (
                  <List.Item>
                    <List.Item.Meta
                      style={{
                        padding: "0 16px",
                      }}
                      avatar={
                        <Typography.Text type="secondary">
                          {itemData.label}
                        </Typography.Text>
                      }
                      title={itemData.value}
                    />
                  </List.Item>
                )}
              />

              <Flex
                align="center"
                justify="space-between"
                style={{ padding: "16px 16px 16px 0" }}
              >
                <DeleteButton
                  type="text"
                  recordItemId={item.id}
                  resource="items"
                  onSuccess={handleDrawerClose}
                />
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setIsEditing(true)}
                >
                  {t("actions.edit")}
                </Button>
              </Flex>
            </>
          )}
        </Drawer>
      )}
      {isEditing && item && (
        <ItemDrawerForm
          id={item.id}
          action="edit"
          open={isEditing}
          onClose={() => setIsEditing(false)}
          onMutationSuccess={() => {
            setIsEditing(false);
            queryResult.refetch();
          }}
        />
      )}
    </>
  );
};
