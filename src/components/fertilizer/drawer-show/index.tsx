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
import { IFertilizer } from "@/interfaces";
import { FertilizerDrawerForm } from "../drawer-form";
import { FertilizerStatusTag } from "../status";
import { FertilizerTypeTag } from "../type";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
};

export const FertilizerDrawerShow: React.FC<Props> = ({ id, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow<IFertilizer, HttpError>({
    resource: "fertilizers",
    id,
  });

  const fertilizer = queryResult?.data?.data;

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
          {fertilizer && (
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
                  src={fertilizer.image}
                  alt={fertilizer.name}
                />
              </Flex>
              <Flex
                vertical
                style={{ backgroundColor: token.colorBgContainer }}
              >
                <Flex vertical style={{ padding: "16px" }}>
                  <Typography.Title level={5}>
                    {fertilizer.name}
                  </Typography.Title>
                </Flex>
              </Flex>

              <Divider />

              <List
                dataSource={[
                  { label: "Mô tả", value: fertilizer.description },
                  {
                    label: "Số lượng",
                    value: `${fertilizer.quantity} ${fertilizer.unit || ""}`,
                  },
                  {
                    label: "Loại phân bón",
                    value: <FertilizerTypeTag value={fertilizer.type} />,
                  },
                  {
                    label: "Trạng thái",
                    value: <FertilizerStatusTag value={fertilizer.status} />,
                  },
                ]}
                renderItem={(itemData) => (
                  <List.Item>
                    <List.Item.Meta
                      style={{ padding: "0 16px" }}
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
                  recordItemId={fertilizer.id}
                  resource="fertilizers"
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
      {isEditing && fertilizer && (
        <FertilizerDrawerForm
          id={fertilizer.id}
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
