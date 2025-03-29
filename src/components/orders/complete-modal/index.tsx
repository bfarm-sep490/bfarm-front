import { TextField } from "@refinedev/antd";
import { useBack, useList, useOne } from "@refinedev/core";
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
  Tooltip,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export const CompleteOrderModal = () => {
  const [count, setCount] = useState<number>(0);
  const [quantity, setQuantity] = useState(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [orderProducts, setOrderProducts] = useState<
    { id: number; quantity: number; per_package: number }[]
  >([]);
  const { orderId } = useParams();
  const back = useBack();

  const { data: orderData } = useOne({
    resource: "orders",
    id: orderId ?? "",
  });
  const order = orderData?.data;

  const { data: packagedProductData } = useList({
    resource: "packaging-products",
    filters: [
      {
        field: "plan_id",
        operator: "eq",
        value: order?.plan_id,
      },
    ],
  });

  const packagedProducts = packagedProductData?.data ?? [];

  useEffect(() => {
    const totalQuantity = orderProducts.reduce(
      (acc, item) => acc + item.quantity * item.per_package,
      0
    );
    setQuantity(totalQuantity);
  }, [orderProducts]);

  const handleNextStep = () => {
    setCount((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCount((prev) => prev - 1);
  };

  const handleCheckboxChange = (checked: boolean, id: number) => {
    setSelectedIds((prevSelectedIds) =>
      checked
        ? [...prevSelectedIds, id]
        : prevSelectedIds.filter((itemId) => itemId !== id)
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
        item.id === id ? { ...item, quantity: numericValue } : item
      )
    );
  };

  const autoFill = () => {
    const targetQuantity = order?.preorder_quantity ?? 0;

    if (targetQuantity <= 0 || selectedIds.length === 0) return;

    const selectedProducts = packagedProducts
      .filter((product) => selectedIds.includes(Number(product.id)))
      .map((product) => ({
        id: Number(product.id),
        perPackage: Number(product.quantity_per_pack),
        maxPackages: product.pack_quantity,
        expiryDate: new Date(product.expired_date),
      }))
      .sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());

    let newOrderProducts = selectedProducts.map((product) => ({
      id: product.id,
      quantity: 0,
      per_package: product.perPackage,
    }));

    let totalAllocated = 0;
    let remainingTarget = targetQuantity;

    for (const product of selectedProducts) {
      if (remainingTarget <= 0) break;

      const exactPackages = remainingTarget / product.perPackage;

      const packagesToUse = Math.min(
        Math.floor(exactPackages),
        product.maxPackages
      );

      const productIndex = newOrderProducts.findIndex(
        (p) => p.id === product.id
      );
      if (productIndex !== -1) {
        newOrderProducts[productIndex].quantity = packagesToUse;
        const allocated = packagesToUse * product.perPackage;
        totalAllocated += allocated;
        remainingTarget -= allocated;
      }
    }

    if (remainingTarget > 0) {
      const remainingOptions = selectedProducts
        .filter((product) => {
          const currentAllocation =
            newOrderProducts.find((p) => p.id === product.id)?.quantity || 0;
          return currentAllocation < product.maxPackages;
        })
        .sort((a, b) => a.perPackage - b.perPackage);

      let smallestSuitablePackage = remainingOptions.find(
        (product) => product.perPackage >= remainingTarget
      );

      if (!smallestSuitablePackage && remainingOptions.length > 0) {
        smallestSuitablePackage = remainingOptions[0];
      }

      if (smallestSuitablePackage) {
        const productIndex = newOrderProducts.findIndex(
          (p) => p.id === smallestSuitablePackage.id
        );
        if (productIndex !== -1) {
          newOrderProducts[productIndex].quantity += 1;
          totalAllocated += smallestSuitablePackage.perPackage;
        }
      }
    }

    setOrderProducts(
      newOrderProducts as {
        id: number;
        quantity: number;
        per_package: number;
      }[]
    );
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Tên kế hoạch của sản phẩm",
      dataIndex: "plan_name",
    },
    {
      title: "Số lượng",
      dataIndex: "pack_quantity",
    },
    {
      title: "Số lượng trong mỗi gói",
      dataIndex: "quantity_per_pack",
      render: (value: number) => <TextField value={`${value} kg`} />,
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expired_date",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày đóng gói",
      dataIndex: "packaging_date",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Tên cây trồng",
      dataIndex: "plant_name",
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

  const chosenColumns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Tên kế hoạch của sản phẩm",
      dataIndex: "plan_name",
    },
    {
      title: "Số lượng",
      dataIndex: "pack_quantity",
    },
    {
      title: "Số lượng trong mỗi gói",
      dataIndex: "quantity_per_pack",
      render: (value: number) => <TextField value={`${value} kg`} />,
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expired_date",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày đóng gói",
      dataIndex: "packaging_date",
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Tên cây trồng",
      dataIndex: "plant_name",
    },
    {
      title: "Số lượng đã chọn",
      dataIndex: "id",
      render: (id: number, record: any) => {
        const orderProduct = orderProducts.find((item) => item.id === id);
        return (
          <InputNumber
            min={0}
            max={Number(record.pack_quantity)}
            value={orderProduct?.quantity || 0}
            onChange={(newValue) => handleQuantityChange(newValue, id)}
          />
        );
      },
    },
  ];

  const isQuantitySufficient = quantity >= (order?.preorder_quantity || 0);

  const percentageFulfilled = order?.preorder_quantity
    ? Math.floor((quantity / order.preorder_quantity) * 100)
    : 0;

  const excessQuantity = Math.max(
    0,
    quantity - (order?.preorder_quantity || 0)
  );

  return (
    <Modal
      width={1000}
      open={true}
      onCancel={back}
      footer={
        <>
          {count === 0 && (
            <Button
              onClick={() => {
                handleNextStep();
              }}
              disabled={selectedIds.length === 0}
            >
              Tiếp theo
            </Button>
          )}
          {count === 1 && (
            <Flex vertical={false} justify="end" gap={8}>
              <Button onClick={handlePrevStep}>Quay lại</Button>
              <Button
                type="primary"
                onClick={() => {
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
          )}
        </>
      }
      title="Hoàn thành đơn hàng"
    >
      <Steps current={count} style={{ marginTop: 24, marginBottom: 24 }}>
        <Steps.Step key={0} title="Chọn sản phẩm" />
        <Steps.Step key={1} title="Nhập số lượng" />
        <Steps.Step key={2} title="Xác nhận và thanh toán" />
      </Steps>
      {count === 0 && (
        <>
          <Typography.Title level={5}>Lựa chọn sản phẩm</Typography.Title>
          <Divider />
          <Table
            dataSource={packagedProducts}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
        </>
      )}
      {count === 1 && (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Flex vertical={true} justify="space-between" gap={8}>
              <Typography.Text>
                <Typography.Text strong>
                  Sản lượng dự kiến của đơn hàng:
                </Typography.Text>
                {" " + order?.preorder_quantity} kg
              </Typography.Text>
              <Typography.Text>
                <Typography.Text strong>Sản lượng đã chọn:</Typography.Text>
                {" " + quantity} kg ({percentageFulfilled}%)
              </Typography.Text>
              {excessQuantity > 0 && (
                <Typography.Text type="warning">
                  Dư thừa: {excessQuantity} kg
                </Typography.Text>
              )}
              {!isQuantitySufficient && (
                <Typography.Text
                  type="danger"
                  style={{ fontSize: 12, fontStyle: "italic" }}
                >
                  * Lưu ý chưa đủ sản lượng yêu cầu
                </Typography.Text>
              )}
            </Flex>
          </Card>
          <Flex
            justify="space-between"
            align="middle"
            style={{ marginBottom: 16 }}
          >
            <Typography.Title level={5} style={{ margin: 0 }}>
              Chọn số lượng cho từng sản phẩm
            </Typography.Title>
            <Tooltip title="Tự động phân bổ vừa đủ sản lượng thu hoạch theo yêu cầu">
              <Button
                type="primary"
                onClick={autoFill}
                disabled={selectedIds.length === 0}
              >
                Tự động phân bổ
              </Button>
            </Tooltip>
          </Flex>

          <Divider />
          <Table
            dataSource={packagedProducts.filter((item) =>
              selectedIds.includes(Number(item.id))
            )}
            columns={chosenColumns}
            rowKey="id"
            pagination={false}
          />
        </>
      )}
      {count === 2 && (
        <>
          <Typography.Title level={5}>Xác nhận và thanh toán</Typography.Title>
          <Divider />
          <Card style={{ alignItems: "center" }}>
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
                  <Typography.Text strong>Kế hoạch:</Typography.Text>
                  {" " + order?.plan_name}
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
                  <Typography.Text strong>Số sản phẩm đã chọn:</Typography.Text>
                  {" " + selectedIds.length}
                </Typography.Text>
                <Typography.Text>
                  <Typography.Text strong>Tổng số tiền</Typography.Text>
                  {" " + selectedIds.length}
                </Typography.Text>
              </Flex>
            </Flex>
            <Divider />
            <Typography.Title level={5}>Các sản phẩm đã chọn</Typography.Title>
            <Table
              dataSource={packagedProducts
                .filter((item) => selectedIds.includes(Number(item.id)))
                .map((item) => {
                  const orderProduct = orderProducts.find(
                    (op) => op.id === item.id
                  );
                  return {
                    ...item,
                    selected_quantity: orderProduct?.quantity || 0,
                    total_weight:
                      (orderProduct?.quantity || 0) *
                      (item.quantity_per_pack || 0),
                  };
                })}
              columns={[
                { title: "ID", dataIndex: "id" },
                { title: "Tên sản phẩm", dataIndex: "plan_name" },
                {
                  title: "Số gói đã chọn",
                  dataIndex: "selected_quantity",
                },
                {
                  title: "Tổng khối lượng",
                  dataIndex: "total_weight",
                  render: (value: number) => `${value} kg`,
                },
              ]}
              rowKey="id"
              pagination={false}
            />
            <Divider />

            <Flex justify="center">
              <Button type="primary" size="large">
                Xác nhận và hoàn thành đơn hàng
              </Button>
            </Flex>
          </Card>
        </>
      )}
    </Modal>
  );
};
