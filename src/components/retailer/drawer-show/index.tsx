import { useList, type HttpError, useTranslate, useBack } from "@refinedev/core";
import {
  Avatar,
  Card,
  Flex,
  Typography,
  Tag,
  Spin,
  Alert,
  Row,
  Col,
  Space,
  Divider,
  Button,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  IdcardOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { IRetailer } from "@/interfaces";
import { useParams } from "react-router-dom";
import "../../plan/detail/dashboard-problems/index.css";

export const RetailerDrawerShow: React.FC = () => {
  const { id } = useParams();
  const parsedId = id ? parseInt(id) : undefined;

  const { data, isLoading, isError, error } = useList<IRetailer, HttpError>({
    resource: "retailers",
  });

  const t = useTranslate();
  const back = useBack();

  const retailer = data?.data.find((item) => item.id === parsedId);

  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "-";
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ height: "70vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Lỗi"
        description={error?.message || "Không thể tải thông tin khách hàng."}
        type="error"
        showIcon
      />
    );
  }

  if (!retailer) {
    return (
      <Alert
        message="Không tìm thấy"
        description={`Không tìm thấy khách hàng với ID ${id}.`}
        type="warning"
        showIcon
      />
    );
  }
  return (
    <>
      {" "}
      <Button type="text" style={{ width: "40px", height: "40px" }} onClick={() => back()}>
        <ArrowLeftOutlined style={{ width: "50px", height: "50px" }} />
      </Button>
      <Card
        style={{ width: "100%", margin: "24px 0" }}
        bordered={false}
        className="retailer-detail-card"
      >
        <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {t("retailers.title")}
          </Typography.Title>
          <Tag
            color={retailer.is_active ? "success" : "error"}
            style={{ fontSize: "14px", padding: "4px 12px" }}
          >
            {retailer.is_active ? t("retailers.active") : t("retailers.inactive")}
          </Tag>
        </Flex>

        <Row gutter={[32, 24]}>
          <Col xs={24} md={8}>
            <Card
              className="card"
              bordered
              style={{
                textAlign: "center",
                height: "100%",
                background: "#fafafa",
              }}
              bodyStyle={{ padding: "24px" }}
            >
              <Flex vertical align="center" gap="middle">
                <Avatar
                  shape="square"
                  size={180}
                  src={retailer.avatar_image}
                  alt={retailer.name}
                  icon={<UserOutlined />}
                  style={{
                    borderRadius: 8,
                    border: "4px solid white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                />
                <Space direction="vertical" size={2} style={{ width: "100%" }}>
                  <Typography.Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>
                    {retailer.name}
                  </Typography.Title>

                  <Typography.Text type="secondary">
                    <MailOutlined style={{ marginRight: 8 }} />
                    {retailer.email}
                  </Typography.Text>

                  <Divider style={{ margin: "16px 0" }} />
                </Space>
              </Flex>
            </Card>
          </Col>

          <Col xs={24} md={16}>
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              <Card
                className="card"
                title={
                  <Flex align="center" gap="small">
                    <UserOutlined />
                    <span>{t("common.personalInfo")}</span>
                  </Flex>
                }
                bordered
              >
                <Row gutter={[24, 16]}>
                  <Col xs={24} sm={12}>
                    <Card
                      size="small"
                      bordered={false}
                      style={{ background: "#f5f7fa", height: "100%" }}
                    >
                      <Flex vertical>
                        <Typography.Text type="secondary">
                          <PhoneOutlined /> {t("retailers.phone")}
                        </Typography.Text>
                        <Typography.Text strong style={{ fontSize: 16, marginTop: 4 }}>
                          {formatPhoneNumber(retailer.phone)}
                        </Typography.Text>
                      </Flex>
                    </Card>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Card
                      size="small"
                      bordered={false}
                      style={{ background: "#f5f7fa", height: "100%" }}
                    >
                      <Flex vertical>
                        <Typography.Text type="secondary">
                          <CalendarOutlined /> {t("retailers.dob")}
                        </Typography.Text>
                        <Typography.Text strong style={{ fontSize: 16, marginTop: 4 }}>
                          {formatDate(retailer.dob)}
                        </Typography.Text>
                      </Flex>
                    </Card>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Card
                      size="small"
                      bordered={false}
                      style={{ background: "#f5f7fa", height: "100%" }}
                    >
                      <Flex vertical>
                        <Typography.Text type="secondary">
                          <ClockCircleOutlined /> {t("retailers.created_at")}
                        </Typography.Text>
                        <Typography.Text strong style={{ fontSize: 16, marginTop: 4 }}>
                          {formatDate(retailer.created_at)}
                        </Typography.Text>
                      </Flex>
                    </Card>
                  </Col>
                </Row>
              </Card>

              <Card
                className="card"
                title={
                  <Flex align="center" gap="small">
                    <EnvironmentOutlined />
                    <span>{t("common.locationInfo")}</span>
                  </Flex>
                }
                bordered
              >
                <Row gutter={[24, 16]}>
                  <Col xs={24}>
                    <Card size="small" bordered={false} style={{ background: "#f5f7fa" }}>
                      <Flex vertical>
                        <Typography.Text type="secondary">
                          <HomeOutlined /> {t("retailers.address")}
                        </Typography.Text>
                        <Typography.Text strong style={{ fontSize: 16, marginTop: 4 }}>
                          {retailer.address || "-"}
                        </Typography.Text>
                      </Flex>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Space>
          </Col>
        </Row>
      </Card>
    </>
  );
};
