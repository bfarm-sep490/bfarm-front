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
import { IYield } from "@/interfaces";
import { YieldDrawerForm } from "../drawer-form";
import { YieldTypeTag } from "../type";
import { YieldSizeTag } from "../size";

type Props = {
  id?: BaseKey;
  onClose?: () => void;
};

const YieldStatusTag = ({ isAvailable }: { isAvailable: boolean }) => {
  return (
    <Tag color={isAvailable ? "green" : "red"}>
      {isAvailable ? "Available" : "Not Available"}
    </Tag>
  );
};

export const YieldDrawerShow: React.FC<Props> = ({ id, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const { token } = theme.useToken();
  const breakpoint = Grid.useBreakpoint();

  const { queryResult } = useShow<IYield, HttpError>({
    resource: "yields",
    id: id,
  });

  const yieldData = queryResult?.data?.data;

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
          {yieldData && (
            <>
              <Flex
                vertical
                style={{ backgroundColor: token.colorBgContainer }}
              >
                <Flex vertical style={{ padding: "16px" }}>
                  <Typography.Title level={5}>
                    {yieldData.yield_name}
                  </Typography.Title>
                </Flex>
              </Flex>

              <Divider />
              <List
                dataSource={[
                  { label: "Description", value: yieldData.description },
                  {
                    label: "Area",
                    value: `${yieldData.area} ${yieldData.area_unit}`,
                  },
                  {
                    label: "Type",
                    value: <YieldTypeTag value={yieldData.type} />,
                  },
                  {
                    label: "Size",
                    value: <YieldSizeTag value={yieldData.size} />,
                  },
                  {
                    label: "Status",
                    value: yieldData.is_available ? (
                      <Tag color="green">Available</Tag>
                    ) : (
                      <Tag color="red">Unavailable</Tag>
                    ),
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
              <Flex
                align="center"
                justify="space-between"
                style={{ padding: "16px 16px 16px 0" }}
              >
                <DeleteButton
                  type="text"
                  recordItemId={yieldData.id}
                  resource="yields"
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

      {/* Drawer Form Edit */}
      {isEditing && yieldData && (
        <YieldDrawerForm
          id={yieldData.id}
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
