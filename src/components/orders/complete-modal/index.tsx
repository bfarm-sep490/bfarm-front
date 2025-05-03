import { MoneyCollectOutlined, QrcodeOutlined, TruckOutlined } from "@ant-design/icons";
import { TextField, useForm, useModalForm } from "@refinedev/antd";
import { useBack, useGo, useList, useOne } from "@refinedev/core";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Flex,
  InputNumber,
  Modal,
  Steps,
  Table,
  Typography,
  Row,
  Col,
  Alert,
  Form,
  notification,
  Spin,
  Space,
  theme,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { usePayOS } from "@payos/payos-checkout";
import { round } from "lodash";

type OrderProduct = {
  id: number;
  quantity: number;
  per_package: number;
};

type PackagedProduct = {
  packaging_type_id: number;
  id: number;
  plan_id: string;
  plan_name: string;
  available_packs: number;
  quantity_per_pack: number;
  expired_date: string;
  packaging_date: string;
  plant_name: string;
  evaluated_result: "Grade 1" | "Grade 2" | "Grade 3";
  status: string;
};
type Props = {
  onClose?: () => void;
  onMutationSuccess?: () => void;
  open?: boolean;
  onCancel?: () => void;
};

export const CompleteOrderModal = (props: Props) => {
  const [isSuccessPayment, setIsSuccessPayment] = useState(false);
  const [payOSOpen, setPayOSOpen] = useState(false);
  const [payOSConfig, setPayOSConfig] = useState({
    RETURN_URL: "http://localhost:5173/payment-success",
    ELEMENT_ID: "embedded-payment-container",
    CHECKOUT_URL: "",
    embedded: true,
    onSuccess: (event: any) => {
      setPayOSOpen(false);
      setIsSuccessPayment(true);
    },
  });
  const { open, exit } = usePayOS(payOSConfig);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const [quantity, setQuantity] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [searchParams] = useSearchParams();
  const go = useGo();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const back = useBack();
  const [api, contextHolder] = notification.useNotification();
  const {
    data: productTypeData,
    isLoading: productTypeLoading,
    refetch: productTypeRefetch,
  } = useList({
    resource: "packaging-types",
    queryOptions: {
      enabled: !!orderId,
    },
  });
  const {
    data: orderData,
    isLoading: orderLoading,
    refetch: orderRefect,
  } = useOne({
    resource: "orders",
    id: orderId ?? "",
    queryOptions: {
      enabled: !!orderId,
    },
  });
  const order = orderData?.data;
  const packagingType = productTypeData?.data?.find((x) => x.id === order?.packaging_type_id);
  const {
    data: plantData,
    isLoading: plantLoading,
    refetch: plantRefect,
  } = useOne({
    resource: "plants",
    id: order?.plant_id,
    queryOptions: {
      enabled: !!order?.plant_id,
    },
  });

  const plant = plantData?.data;

  const {
    data: packagedProductData,
    isLoading: packagedProductLoading,
    refetch: packagedProductRefect,
  } = useList({
    resource: "packaging-products",
    filters: [
      {
        field: "order_id",
        operator: "eq",
        value: order?.id,
      },
      {
        field: "status",
        operator: "eq",
        value: "Active",
      },
    ],
    queryOptions: {
      enabled: !!order?.plan_id,
    },
  });
  useEffect(() => {
    if (props?.open === true) {
      orderRefect();
      plantRefect();
      productTypeRefetch();
      packagedProductRefect();
    } else {
      setPayOSConfig({ ...payOSConfig, CHECKOUT_URL: "" });
      setCurrentStep(0);
      setPayOSOpen(false);
      setIsSuccessPayment(false);
      setIsCheckoutLoading(false);
      setSelectedIds([]);
      setOrderProducts([]);
      setQuantity(0);
      setAmount(0);
      setSelectedMethod("");
      exit();
    }
  }, [props?.open]);
  const packagedProducts: PackagedProduct[] = useMemo(() => {
    return (packagedProductData?.data as PackagedProduct[]) ?? [];
  }, [packagedProductData?.data]);
  const isLoading = orderLoading || plantLoading || packagedProductLoading || productTypeLoading;

  useEffect(() => {
    const totalQuantity = orderProducts.reduce(
      (acc, item) => acc + item.quantity * item.per_package,
      0,
    );
    setQuantity(totalQuantity);
  }, [orderProducts]);

  useEffect(() => {
    if (!packagedProducts.length || !plant) return;

    setAmount(
      orderProducts.reduce((acc, item) => {
        const product = packagedProducts.find((p) => p.id === item.id);
        if (!product) return acc;

        const price =
          product.evaluated_result === "Grade 1"
            ? plant.delta_one
            : product.evaluated_result === "Grade 2"
              ? plant.delta_two
              : plant.delta_three;

        return acc + item.quantity * item.per_package * price * plant.base_price;
      }, 0),
    );
  }, [orderProducts, packagedProducts, plant]);

  const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  const handlePrevStep = () => setCurrentStep((prev) => prev - 1);

  const handleCheckboxChange = (checked: boolean, id: number) => {
    setSelectedIds((prevSelectedIds) =>
      checked ? [...prevSelectedIds, id] : prevSelectedIds.filter((itemId) => itemId !== id),
    );

    setOrderProducts((prevOrderProducts) => {
      if (checked) {
        const product = packagedProducts.find((item) => item.id === id);
        return [
          ...prevOrderProducts,
          {
            id,
            quantity: 0,
            per_package: product?.quantity_per_pack ?? 0,
          },
        ];
      } else {
        return prevOrderProducts.filter((item) => item.id !== id);
      }
    });
  };

  const handleQuantityChange = (value: number | null, id: number) => {
    const numericValue = value ?? 0;

    setOrderProducts((prevOrderProducts) =>
      prevOrderProducts.map((item) =>
        item.id === id ? { ...item, quantity: numericValue } : item,
      ),
    );
  };

  const isQuantitySufficient = quantity >= (order?.preorder_quantity || 0);
  const [isCorrectKindGoods, setIsCorrectKindGoods] = useState<boolean>(true);
  useEffect(() => {
    if (!packagedProducts.length || !orderProducts.length || !order || !productTypeData?.data)
      return;

    let correctType = true;

    for (const item of orderProducts) {
      if (item.quantity <= 0) continue;

      const product = packagedProducts.find((p) => p.id === item.id);
      if (!product) continue;

      if (product.packaging_type_id !== order.packaging_type_id) {
        correctType = false;
        break;
      }
    }

    setIsCorrectKindGoods(correctType);
  }, [orderProducts, packagedProducts, order, productTypeData?.data]);
  const percentageFulfilled = order?.preorder_quantity
    ? Math.floor((quantity / order.preorder_quantity) * 100)
    : 0;
  const excessQuantity = Math.max(0, quantity - (order?.preorder_quantity || 0));

  const { modalProps, formProps, onFinish } = useModalForm({
    resource: `payments/remaining-payment/${selectedMethod === "cashPayment" ? "cash" : "payos"}`,
    action: "create",
    createMutationOptions: {
      onSuccess: async (data: any) => {
        if (data !== null && selectedMethod === "cashPayment") {
          back();
        } else if (data !== null && selectedMethod !== "cashPayment") {
          const url = data?.data.checkoutUrl;
          setPayOSConfig((oldConfig) => ({
            ...oldConfig,
            CHECKOUT_URL: url,
          }));
          setPayOSOpen(true);
        } else {
          api.error({
            message: "Thất bại",
            description: "Vui lòng thử lại",
          });
        }
      },
      onError: (data: any) => {
        api.error({
          message: "Thất bại",
          description: "Vui lòng thử lại",
        });
      },
    },
  });
  useEffect(() => {
    if (payOSConfig.CHECKOUT_URL != null) {
      open();
      setIsCheckoutLoading(false);
    }
  }, [payOSConfig]);
  const handlePayment = async () => {
    if (!formProps.form) return;
    setIsCheckoutLoading(true);
    formProps.form.setFieldsValue({
      amount: round(amount - order?.deposit_price),
      orderId,
      description: selectedMethod === "cashPayment" ? "Thanh toán tiền mặt" : "Thanh toán qua QR",
      product: orderProducts.map((item) => ({
        productId: item.id,
        quantityOfPacks: item.quantity,
      })),
    });

    onFinish();
  };

  const selectionColumns = [
    { title: "ID", dataIndex: "id" },
    {
      title: "Loại bao bì",
      dataIndex: "packaging_type_id",
      render: (value: number) => (
        <TextField value={productTypeData?.data?.find((x: any) => x.id === value)?.name} />
      ),
    },
    { title: "Số lượng thành phẩm", dataIndex: "available_packs" },
    {
      title: "Sản lượng trong mỗi thành phẩm (kg)",
      dataIndex: "quantity_per_pack",
      render: (value: number) => <TextField value={`${value} kg`} />,
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expired_date",
      render: (value: string) => dayjs(value).format("hh:mm DD/MM/YYYY"),
    },
    {
      title: "Ngày đóng gói",
      dataIndex: "packaging_date",
      render: (value: string) => dayjs(value).format("hh:mm DD/MM/YYYY"),
    },
    {
      title: "Kiểm định",
      dataIndex: "evaluated_result",
      render: (value: string) => (
        <TextField
          value={value === "Grade 1" ? "Loại 1" : value === "Grade 2" ? "Loại 2" : "Loại 3"}
        />
      ),
    },
    {
      title: "Lựa chọn",
      dataIndex: "id",
      render: (value: number) => (
        <Checkbox
          checked={selectedIds.includes(value)}
          onChange={(e) => handleCheckboxChange(e.target.checked, value)}
        />
      ),
    },
  ];

  const quantityColumns = [
    { title: "ID", dataIndex: "id" },
    { title: "Số lượng thành phẩm", dataIndex: "available_packs" },
    {
      title: "Sản luợnng trong mỗi thành phẩm (kg)",
      dataIndex: "quantity_per_pack",
      render: (value: number) => <TextField value={`${value} kg`} />,
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expired_date",
      render: (value: string) => dayjs(value).format("hh:mm DD/MM/YYYY"),
    },
    {
      title: "Ngày đóng gói",
      dataIndex: "packaging_date",
      render: (value: string) => dayjs(value).format("hh:mm DD/MM/YYYY"),
    },
    {
      title: "Kiểm định",
      dataIndex: "evaluated_result",
      render: (value: string) => (
        <TextField
          value={value === "Grade 1" ? "Loại 1" : value === "Grade 2" ? "Loại 2" : "Loại 3"}
        />
      ),
    },
    {
      title: "Số lượng thành phẩm đã chọn",
      dataIndex: "id",
      render: (id: number, record: PackagedProduct) => {
        const orderProduct = orderProducts.find((item) => item.id === id);
        return (
          <InputNumber
            min={0}
            max={Number(record.available_packs)}
            value={orderProduct?.quantity || 0}
            onChange={(newValue) => handleQuantityChange(newValue, id)}
          />
        );
      },
    },
  ];

  const confirmationColumns = useMemo(
    () => [
      { title: "ID", dataIndex: "id" },
      { title: "Tên sản phẩm", dataIndex: "plan_name" },
      { title: "Số gói đã chọn", dataIndex: "selected_quantity" },
      {
        title: "Tổng khối lượng",
        dataIndex: "total_weight",
        render: (value: number) => `${value} kg`,
      },
      {
        title: "Kiểm định",
        dataIndex: "evaluated_result",
        render: (value: string) => (
          <TextField
            value={value === "Grade 1" ? "Loại 1" : value === "Grade 2" ? "Loại 2" : "Loại 3"}
          />
        ),
      },
      {
        title: "Tỉ lệ giá",
        dataIndex: "evaluated_result",
        render: (value: string) => (
          <TextField
            value={
              value === "Grade 1"
                ? plant?.delta_one
                : value === "Grade 2"
                  ? plant?.delta_two
                  : plant?.delta_three
            }
          />
        ),
      },
      {
        title: "Tổng tiền",
        dataIndex: "evaluated_result",
        render: (value: string, record: any) => {
          const deltaValue =
            value === "Grade 1"
              ? plant?.delta_one
              : value === "Grade 2"
                ? plant?.delta_two
                : plant?.delta_three;

          return (
            <TextField
              value={(deltaValue * record.total_weight * plant?.base_price).toLocaleString()}
            />
          );
        },
      },
    ],
    [plant],
  );
  const { token } = theme.useToken();
  const confirmationData = useMemo(() => {
    return packagedProducts
      .filter((item) => selectedIds.includes(Number(item.id)))
      .map((item) => {
        const orderProduct = orderProducts.find((op) => op.id === item.id);
        return {
          ...item,
          selected_quantity: orderProduct?.quantity || 0,
          total_weight: (orderProduct?.quantity || 0) * (item.quantity_per_pack || 0),
        };
      });
  }, [packagedProducts, selectedIds, orderProducts]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Card style={{ marginBottom: 16 }} title="Yêu cầu đơn hàng">
              <Flex vertical={true} justify="space-between" gap={8}>
                <Typography.Text>
                  <Typography.Text strong>Loại bao bì: </Typography.Text>
                  {packagingType?.name}
                </Typography.Text>
                <Typography.Text>
                  <Typography.Text strong>Sản lượng dự kiến của đơn hàng:</Typography.Text>
                  {" " + order?.preorder_quantity} kg
                </Typography.Text>
                <Typography.Text>
                  <Typography.Text strong>Sản lượng đã chọn:</Typography.Text>
                  {" " + quantity} kg ({percentageFulfilled}%)
                </Typography.Text>
                {excessQuantity > 0 && (
                  <Typography.Text type="warning">Dư thừa: {excessQuantity} kg</Typography.Text>
                )}
                {!isQuantitySufficient && (
                  <Typography.Text type="danger" style={{ fontSize: 12, fontStyle: "italic" }}>
                    * Lưu ý chưa đủ sản lượng yêu cầu
                  </Typography.Text>
                )}
                {isCorrectKindGoods === false && (
                  <Typography.Text type="danger" style={{ fontSize: 12, fontStyle: "italic" }}>
                    * Có hàng chưa đúng mẫu bao
                  </Typography.Text>
                )}
              </Flex>
            </Card>
            <Typography.Title level={5}>Lựa chọn sản phẩm</Typography.Title>
            <Divider />
            <Table
              dataSource={packagedProducts?.filter((item) => item?.available_packs > 0)}
              columns={selectionColumns}
              rowKey="id"
              pagination={false}
            />
          </>
        );

      case 1:
        return (
          <>
            <Card style={{ marginBottom: 16 }} title="Yêu cầu đơn hàng">
              <Flex vertical={true} justify="space-between" gap={8}>
                <Typography.Text>
                  <Typography.Text strong>Loại bao bì: </Typography.Text>
                  {packagingType?.name}
                </Typography.Text>
                <Typography.Text>
                  <Typography.Text strong>Sản lượng dự kiến của đơn hàng:</Typography.Text>
                  {" " + order?.preorder_quantity} kg
                </Typography.Text>
                <Typography.Text>
                  <Typography.Text strong>Sản lượng đã chọn:</Typography.Text>
                  {" " + quantity} kg ({percentageFulfilled}%)
                </Typography.Text>
                {excessQuantity > 0 && (
                  <Typography.Text type="warning">Dư thừa: {excessQuantity} kg</Typography.Text>
                )}
                {!isQuantitySufficient && (
                  <Typography.Text type="danger" style={{ fontSize: 12, fontStyle: "italic" }}>
                    * Lưu ý chưa đủ sản lượng yêu cầu
                  </Typography.Text>
                )}
                {isCorrectKindGoods === false && (
                  <Typography.Text type="danger" style={{ fontSize: 12, fontStyle: "italic" }}>
                    * Có hàng chưa đúng mẫu bao
                  </Typography.Text>
                )}
              </Flex>
            </Card>
            <Flex justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Typography.Title level={5} style={{ margin: 0 }}>
                Chọn số lượng cho từng sản phẩm
              </Typography.Title>
            </Flex>
            <Divider />
            <Table
              dataSource={packagedProducts.filter((item) => selectedIds.includes(Number(item.id)))}
              columns={quantityColumns}
              rowKey="id"
              pagination={false}
            />
          </>
        );

      case 2:
        return (
          <>
            <Typography.Title level={5}>Xác nhận và thanh toán</Typography.Title>
            <Divider />
            <Card>
              <Flex vertical={false} justify="start" gap={100}>
                <Flex vertical={true} gap={8}>
                  <Typography.Text>
                    <Typography.Text strong>Đơn hàng ID:</Typography.Text>
                    {" " + orderId}
                  </Typography.Text>
                  <Typography.Text>
                    <Typography.Text strong>Tên khách hàng:</Typography.Text>
                    {" " + order?.retailer_name}
                  </Typography.Text>
                  <Typography.Text>
                    <Typography.Text strong>Cây trồng:</Typography.Text>
                    {" " + order?.plant_name}
                  </Typography.Text>
                  <Typography.Text>
                    <Typography.Text strong>Giá cơ bản:</Typography.Text>
                    {" " + plant?.base_price.toLocaleString()} VND/kg
                  </Typography.Text>
                </Flex>

                <Flex vertical={true} gap={8}>
                  <Typography.Text>
                    <Typography.Text strong>Sản lượng yêu cầu:</Typography.Text>
                    {" " + order?.preorder_quantity} kg
                  </Typography.Text>
                  <Typography.Text>
                    <Typography.Text strong>Sản lượng thực tế:</Typography.Text>
                    {" " + quantity} kg
                    {excessQuantity > 0 && (
                      <Typography.Text type="warning">
                        {" "}
                        (dư thừa: {excessQuantity} kg)
                      </Typography.Text>
                    )}
                    {!isQuantitySufficient && (
                      <Typography.Text type="danger">
                        {" "}
                        (thiếu: {order?.preorder_quantity - quantity} kg)
                      </Typography.Text>
                    )}
                  </Typography.Text>

                  <Typography.Text>
                    <Typography.Text strong>Tổng số tiền:</Typography.Text>
                    {" " + amount.toLocaleString()} VND
                  </Typography.Text>
                  <Typography.Text>
                    <Typography.Text strong>Tiền đã cọc</Typography.Text>
                    {" " + order?.deposit_price.toLocaleString()} VND
                  </Typography.Text>

                  <Typography.Text>
                    <Typography.Text
                      strong
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      Tiền thanh toán còn lại:{" "}
                      {" " + (amount - (order?.deposit_price || 0)).toLocaleString()} VND
                    </Typography.Text>
                  </Typography.Text>
                </Flex>
              </Flex>

              <Divider />

              <Typography.Title level={5}>Các sản phẩm đã chọn</Typography.Title>
              <Table
                pagination={{ pageSize: 5 }}
                dataSource={confirmationData}
                columns={confirmationColumns}
                rowKey="id"
              />

              <Typography.Title level={5}>Phương thức thanh toán</Typography.Title>
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Card
                    hoverable
                    style={{
                      width: "100%",
                      border:
                        selectedMethod === "cashPayment"
                          ? "2px solid #33CC33"
                          : "1px solid #d9d9d9",
                    }}
                    onClick={() => setSelectedMethod("cashPayment")}
                  >
                    <Flex vertical={false} justify="space-between" gap={8}>
                      <Typography.Title
                        level={5}
                        style={{
                          color:
                            selectedMethod === "cashPayment" ? " #33CC33" : token?.colorBgSolid,
                        }}
                      >
                        Thanh toán bằng tiền mặt
                      </Typography.Title>
                      <MoneyCollectOutlined
                        style={{
                          color: selectedMethod === "cashPayment" ? "#33CC33" : token?.colorBgSolid,
                          fontSize: "50px",
                        }}
                      />
                    </Flex>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    hoverable
                    style={{
                      width: "100%",
                      border:
                        selectedMethod === "qrPayment" ? "2px solid #33CC33" : "1px solid #d9d9d9",
                    }}
                    onClick={() => setSelectedMethod("qrPayment")}
                  >
                    <Flex vertical={false} justify="space-between" gap={8}>
                      <Typography.Title
                        level={5}
                        style={{
                          color: selectedMethod === "qrPayment" ? " #33CC33" : token?.colorBgSolid,
                        }}
                      >
                        Thanh toán bằng QR Code
                      </Typography.Title>
                      <QrcodeOutlined
                        style={{
                          color: selectedMethod === "qrPayment" ? " #33CC33" : token?.colorBgSolid,
                          fontSize: "50px",
                        }}
                      />{" "}
                    </Flex>
                  </Card>
                </Col>
              </Row>
              <Flex justify="center" align="middle" gap={8} style={{ marginTop: 16 }}>
                <Button
                  loading={isLoading}
                  type="primary"
                  size="large"
                  onClick={() => {
                    handlePayment();
                    if (selectedMethod === "qrPayment") {
                      setCurrentStep(currentStep + 1);
                    }
                  }}
                  disabled={selectedMethod === ""}
                >
                  Xác nhận và thanh toán đơn hàng
                </Button>
              </Flex>
            </Card>
          </>
        );

      default:
        return null;
    }
  };

  const renderFooter = () => {
    switch (currentStep) {
      case 0:
        return (
          <Button onClick={handleNextStep} disabled={selectedIds.length === 0}>
            Tiếp theo
          </Button>
        );

      case 1:
        return (
          <Flex vertical={false} justify="end" gap={8}>
            <Button onClick={handlePrevStep}>Quay lại</Button>
            <Button
              type="primary"
              onClick={() => {
                // Filter out products with zero quantity
                const newOrderProducts = orderProducts.filter((item) => item.quantity > 0);
                const newIds = selectedIds.filter((item) =>
                  newOrderProducts.some((op) => op.id === item),
                );

                setSelectedIds(newIds);
                setOrderProducts(newOrderProducts);
                handleNextStep();
              }}
            >
              Xác nhận hoàn thành
            </Button>
          </Flex>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      loading={orderLoading || plantLoading || packagedProductLoading}
      onCancel={props?.onCancel}
      onClose={props?.onClose}
      width={1000}
      open={props?.open}
      footer={renderFooter()}
      title="Hoàn thành đơn hàng"
    >
      {contextHolder}
      {!isCheckoutLoading && (
        <>
          <Steps current={currentStep} style={{ marginTop: 24, marginBottom: 24 }}>
            <Steps.Step key={0} title="Chọn sản phẩm" />
            <Steps.Step key={1} title="Nhập số lượng" />
            <Steps.Step key={2} title="Xác nhận và thanh toán" />
          </Steps>
          {renderStepContent()}
        </>
      )}
      {isCheckoutLoading && (
        <>
          <Flex justify="center" align="middle" style={{ height: "100%", width: "100%" }}>
            <Space>
              <Spin></Spin>
              <Typography.Text type="secondary">Đang xử lý thanh toán...</Typography.Text>
            </Space>
          </Flex>
        </>
      )}

      {payOSOpen && (
        <>
          <div style={{ maxWidth: "400px", padding: "2px" }}>
            Sau khi thực hiện thanh toán thành công, vui lòng đợi từ 5 - 10s để hệ thống tự động cập
            nhật.
          </div>
          <div
            id="embedded-payment-container"
            style={{
              height: "350px",
            }}
          ></div>
        </>
      )}

      {isSuccessPayment && (
        <Flex vertical={true} justify="center" align="middle" gap={8}>
          <img
            src="../../public/images/success-svgrepo-com.svg"
            alt="Success"
            style={{
              width: "300px",
              height: "300px",
            }}
          />
          <Typography.Title level={5}>Đơn hàng đã được hoàn thành thành công!</Typography.Title>
        </Flex>
      )}
    </Modal>
  );
};
export const CancelOrderModal = () => {
  const { orderId } = useParams();
  const back = useBack();
  const [error, setError] = useState<string | null>(null);
  const { formProps, saveButtonProps } = useForm({
    resource: "orders",
    id: orderId,
    action: "edit",
    queryOptions: {
      enabled: false,
    },
    onMutationSuccess: () => {
      back();
    },
    onMutationError: (error) => {
      setError(error.message);
    },
  });
  return (
    <Form {...formProps}>
      <Modal
        open={true}
        onCancel={back}
        onClose={back}
        title={"Hủy đơn hàng"}
        onOk={formProps?.onFinish}
        footer={
          <>
            <Flex justify="end" gap={8}>
              <Button onClick={back}>Quay lại</Button>
              <Button type="primary" {...saveButtonProps}>
                Xác nhận hủy đơn hàng
              </Button>
            </Flex>
          </>
        }
      >
        {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}
        <Typography.Title level={5}>Bạn có chắc chắn muốn hủy đơn hàng này không?</Typography.Title>

        <Typography.Title level={5} type="danger" style={{ fontStyle: "italic" }}>
          * Lưu ý: Đơn hàng đã hủy sẽ không thể khôi phục lại được.
        </Typography.Title>
      </Modal>
    </Form>
  );
};
