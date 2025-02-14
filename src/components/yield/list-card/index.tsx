import { NumberField, useSimpleList } from "@refinedev/antd";
import {
  type HttpError,
  useGo,
  useNavigation,
  useTranslate,
} from "@refinedev/core";

import {
  Card,
  Divider,
  Flex,
  List,
  Tag,
  Typography,
  theme,
} from "antd";

import { EyeOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";
import { IYield, YieldType, YieldAvailability, YieldSize } from "@/interfaces";
import { PaginationTotal } from "@/components/paginationTotal";
import { useStyles } from "./styled";

export const YieldListCard = () => {
  const { token } = theme.useToken();
  const { styles, cx } = useStyles();
  const t = useTranslate();
  const go = useGo();
  const { pathname } = useLocation();
  const { showUrl } = useNavigation();

  const { listProps } = useSimpleList<IYield, HttpError>({
    resource: "yield",
    pagination: {
      current: 1,
      pageSize: 12,
    },
  });

  console.log("Yield Data:", listProps?.dataSource); // 🛠 Debug API data

  // 🎨 Hàm lấy màu cho Type
  const getTypeColor = (type?: YieldType) => {
    const colorMap: Record<YieldType, string> = {
      "Đất Thịt": "brown",
      "Đất Mùn": "green",
    };
    return type ? colorMap[type] || "default" : "default";
  };

  // 🎨 Hàm lấy màu cho Availability
  const getAvailabilityColor = (status?: YieldAvailability) => {
    return status === "Available" ? "green" : "red";
  };

  // 🎨 Hàm lấy màu cho Size
  const getSizeColor = (size?: YieldSize) => {
    const colorMap: Record<YieldSize, string> = {
      Small: "blue",
      Medium: "orange",
      Large: "purple",
    };
    return size ? colorMap[size] || "default" : "default";
  };

  return (
    <>
      <Divider style={{ margin: "16px 0px" }} />
      <List
        {...listProps}
        dataSource={listProps?.dataSource || []} // ✅ Tránh lỗi khi data undefined
        pagination={{
          ...listProps.pagination,
          showTotal: (total) => (
            <PaginationTotal total={total} entityName="yield" />
          ),
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
        renderItem={(item) => (
          <List.Item style={{ height: "100%" }}>
            <Card
              hoverable
              bordered={false}
              className={styles.card}
              styles={{
                body: { padding: 16 },
                actions: { marginTop: "auto" },
              }}
              actions={[
                <Flex key="actions" justify="space-between" style={{ padding: "0 16px" }}>
                  <Tag color={getAvailabilityColor(item?.isAvailable)}>
                    {item?.isAvailable ?? "Unavailable"}
                  </Tag>
                </Flex>,
              ]}
            >
              <Card.Meta
                title={
                  <Flex align="center" justify="space-between">
                    <Typography.Title
                      level={5}
                      ellipsis={{ rows: 1, tooltip: item?.name }}
                      style={{ marginBottom: 0 }}
                    >
                      {item?.name ?? "Unknown"}
                    </Typography.Title>
                    <Tag color={getTypeColor(item?.type)}>
                      {item?.type ?? "-"}
                    </Tag>
                  </Flex>
                }
                description={
                  <Flex vertical gap={8}>
                    <Typography.Paragraph
                      ellipsis={{ rows: 2, tooltip: item?.description }}
                      style={{ marginBottom: 0 }}
                    >
                      {item?.description ?? "No description available"}
                    </Typography.Paragraph>
                    <Flex justify="space-between">
                      <Typography.Text type="secondary">
                        Area:{" "}
                        {item?.Area !== undefined ? (
                          <>
                            <NumberField value={item?.Area} /> {item?.AreaUnit}
                          </>
                        ) : (
                          "-"
                        )}
                      </Typography.Text>
                      <Typography.Text type="secondary">
                        Size:{" "}
                        <Tag color={getSizeColor(item?.size)}>
                          {item?.size ?? "-"}
                        </Tag>
                      </Typography.Text>
                    </Flex>
                  </Flex>
                }
              />
              <Flex justify="center" style={{ marginTop: "10px" }}>
                <Tag
                  icon={<EyeOutlined />}
                  onClick={() =>
                    go({
                      to: `${showUrl("yield", item?.id.toString())}`,
                      query: { to: pathname },
                      options: { keepQuery: true },
                      type: "replace",
                    })
                  }
                  className={cx(styles.viewButton, "viewButton")}
                >
                  View
                </Tag>
              </Flex>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};
