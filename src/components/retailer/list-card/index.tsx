import React, { CSSProperties } from "react";
import { useSimpleList } from "@refinedev/antd";
import { useGo, useNavigation, useTranslate, HttpError } from "@refinedev/core";

import { Card, Divider, Flex, List, Tag, Typography, Avatar, theme } from "antd";

import { EyeOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";
import { PaginationTotal } from "@/components/paginationTotal";
import { useStyles } from "./styled";
import { RetailerStatusTag } from "../status";

interface IRetailer {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar_image?: string;
  dob?: string;
  is_active: boolean;
}

const additionalStyles = {
  avatar: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderRadius: "8px",
  } as CSSProperties,
  viewTag: {
    position: "absolute",
    top: "10px",
    left: "10px",
    zIndex: 1,
    cursor: "pointer",
  } as CSSProperties,
};

export const RetailersListCard = () => {
  const t = useTranslate();
  const { token } = theme.useToken();
  const { styles, cx } = useStyles();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { listProps } = useSimpleList<IRetailer, HttpError>({
    resource: "retailers",
    pagination: {
      current: 1,
      pageSize: 12,
    },
  });

  return (
    <>
      <Divider style={{ margin: "16px 0px" }} />
      <List
        {...listProps}
        pagination={{
          ...listProps.pagination,
          showTotal: (total) => <PaginationTotal total={total} entityName="retailers" />,
        }}
        grid={{
          gutter: [16, 16],
          column: 4,
          xxl: 4,
          xl: 4,
          lg: 3,
          md: 2,
          sm: 1,
          xs: 1,
        }}
        renderItem={(retailer) => (
          <List.Item style={{ height: "100%" }}>
            <Card
              hoverable
              bordered={false}
              className={styles.card}
              styles={{
                body: {
                  padding: 16,
                },
                cover: {
                  position: "relative",
                },
                actions: {
                  marginTop: "auto",
                },
              }}
              cover={
                <div style={{ position: "relative" }}>
                  <Tag
                    icon={<EyeOutlined />}
                    style={additionalStyles.viewTag}
                    className={cx(styles.viewButton, "viewButton")}
                    onClick={() => {
                      return go({
                        to: `${showUrl("retailers", retailer.id)}`,
                        query: {
                          to: pathname,
                        },
                        options: {
                          keepQuery: true,
                        },
                        type: "replace",
                      });
                    }}
                  >
                    View
                  </Tag>
                  <img
                    src={retailer.avatar_image?.trim() || "/images/default-avatar.png"}
                    alt={retailer.name}
                    style={additionalStyles.avatar}
                  />
                </div>
              }
              actions={[
                <Flex
                  key="actions"
                  justify="space-between"
                  align="center"
                  style={{ padding: "0 16px", width: "100%" }}
                >
                  <RetailerStatusTag isActive={retailer.is_active} />
                </Flex>,
              ]}
            >
              <Card.Meta
                title={
                  <Typography.Title
                    level={5}
                    ellipsis={{
                      rows: 1,
                      tooltip: retailer.name,
                    }}
                    style={{ marginBottom: 0 }}
                  >
                    {retailer.name}
                  </Typography.Title>
                }
                description={
                  <div>
                    <Typography.Paragraph
                      style={{ marginBottom: 4 }}
                      ellipsis={{
                        rows: 1,
                        tooltip: retailer.email,
                      }}
                    >
                      <MailOutlined style={{ marginRight: 6 }} />
                      {retailer.email}
                    </Typography.Paragraph>
                    <Typography.Paragraph
                      style={{ marginBottom: 0 }}
                      ellipsis={{
                        rows: 1,
                        tooltip: retailer.phone,
                      }}
                    >
                      <PhoneOutlined style={{ marginRight: 6 }} />
                      {retailer.phone}
                    </Typography.Paragraph>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};
