import React, { useState } from "react";
import {
  type BaseKey,
  type HttpError,
  useGetToPath,
  useGo,
  useShow,
  useTranslate,
} from "@refinedev/core";
import { Avatar, Button, Divider, Flex, Grid, List, Typography, theme } from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { DeleteButton } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { IPesticide } from "@/interfaces";
import { PesticideDrawerForm } from "../drawer-form";
import { PesticideStatusTag } from "../status";
import { PesticideTypeTag } from "../type";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
};

export const PesticideDrawerShow: React.FC<Props> = ({ id, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow<IPesticide, HttpError>({
    resource: "pesticides",
    id,
  });

  const pesticide = queryResult?.data?.data;

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
          {pesticide && (
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
                  src={pesticide.image}
                  alt={pesticide.name}
                />
              </Flex>

              {/* Name */}
              <Flex vertical style={{ backgroundColor: token.colorBgContainer }}>
                <Flex vertical style={{ padding: "16px" }}>
                  <Typography.Title level={5}>{pesticide.name}</Typography.Title>
                </Flex>
              </Flex>

              <Divider />

              <List
                dataSource={[
                  { label: "Description", value: pesticide.description },
                  {
                    label: "Quantity",
                    value: `${pesticide.quantity} ${pesticide.unit}`,
                  },
                  {
                    label: "Type",
                    value: <PesticideTypeTag value={pesticide.type} />,
                  },
                  {
                    label: "Status",
                    value: <PesticideStatusTag value={pesticide.status} />,
                  },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      style={{
                        padding: "0 16px",
                      }}
                      avatar={<Typography.Text type="secondary">{item.label}</Typography.Text>}
                      title={item.value}
                    />
                  </List.Item>
                )}
              />

              <Flex align="center" justify="space-between" style={{ padding: "16px 16px 16px 0" }}>
                <DeleteButton
                  type="text"
                  recordItemId={pesticide.id}
                  resource="pesticides"
                  onSuccess={handleDrawerClose}
                />
                <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
                  {t("actions.edit")}
                </Button>
              </Flex>
            </>
          )}
        </Drawer>
      )}

      {isEditing && pesticide && (
        <PesticideDrawerForm
          id={pesticide.id}
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
