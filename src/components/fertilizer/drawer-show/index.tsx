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
  type BaseKey,
  type HttpError,
  useGetToPath,
  useGo,
  useShow,
  useTranslate,
} from "@refinedev/core";
import { Avatar, Button, Divider, Flex, Grid, List, Typography, theme, Tag } from "antd";
import { useSearchParams } from "react-router";
import { Drawer } from "../../drawer";
import { DeleteButton } from "@refinedev/antd";
import { EditOutlined } from "@ant-design/icons";
import { IFertilizer, FertilizerStatus } from "@/interfaces";
import { FertilizerDrawerForm } from "../drawer-form";
import { FertilizerTypeTag } from "../type";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
};

const FertilizerStatusTag = ({ status }: { status: FertilizerStatus }) => {
  const colorMap = {
    Available: "green",
    Unavailable: "red",
  };
  return <Tag color={colorMap[status]}>{status}</Tag>;
};

export const FertilizerDrawerShow: React.FC<Props> = ({ id, onClose }) => {
  const [isEditing, setIsEditing] = useState(false); // State mở form Edit
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow<IFertilizer, HttpError>({
    resource: "fertilizers",
    id: id,
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
          <Typography.Title level={5}>{fertilizer?.name}</Typography.Title>
          <Typography.Text type="secondary">{fertilizer?.description}</Typography.Text>
        </Flex>
        <Divider style={{ margin: 0, padding: 0 }} />
        <List
          dataSource={[
            {
              label: <Typography.Text type="secondary">Status</Typography.Text>,
              value: fertilizer?.status && <FertilizerStatusTag status={fertilizer.status} />,
            },
            {
              label: <Typography.Text type="secondary">Type</Typography.Text>,
              value: fertilizer?.type && <FertilizerTypeTag type={fertilizer.type} />,
            },
            {
              label: (
                <Typography.Text type="secondary">Available Quantity</Typography.Text>
              ),
              value: (
                <Typography.Text>
                  {fertilizer?.available_quantity} {fertilizer?.unit}
                </Typography.Text>
              ),
            },
            {
              label: <Typography.Text type="secondary">Total Quantity</Typography.Text>,
              value: (
                <Typography.Text>
                  {fertilizer?.total_quantity} {fertilizer?.unit}
                </Typography.Text>
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
          recordItemId={fertilizer?.id}
          resource="fertilizer"
          onSuccess={handleDrawerClose}
        />
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            if (props?.onEdit) {
              return props.onEdit();
            }

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
                  { label: "Description", value: fertilizer.description },
                  {
                    label: "Available Quantity",
                    value: `${fertilizer.available_quantity} ${fertilizer.unit}`,
                  },
                  {
                    label: "Total Quantity",
                    value: `${fertilizer.total_quantity} ${fertilizer.unit}`,
                  },
                  {
                    label: "Type",
                    value: <FertilizerTypeTag value={fertilizer.type} />,
                  },
                  {
                    label: "Status",
                    value: <FertilizerStatusTag status={fertilizer.status} />,
                  },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      style={{
                        padding: "0 16px",
                      }}
                      avatar={
                        <Typography.Text type="secondary">
                          {item.label}
                        </Typography.Text>
                      }
                      title={item.value}
                    />
                  </List.Item>
                )}
              />

              {/* Buttons */}
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
