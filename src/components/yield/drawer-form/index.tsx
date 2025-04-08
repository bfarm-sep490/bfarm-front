/* eslint-disable prettier/prettier */
import { SaveButton, useDrawerForm } from "@refinedev/antd";
import { type BaseKey, useApiUrl, useGetToPath, useGo } from "@refinedev/core";
import { Form, Input, InputNumber, Select, Button, Modal, Spin } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

type Props = {
  id?: BaseKey;
  action: "edit" | "create";
  open?: boolean;
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

export const YieldDrawerForm = (props: Props) => {
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const getToPath = useGetToPath();
  const [searchParams] = useSearchParams();
  const go = useGo();
  const apiUrl = useApiUrl();

  const { formProps, close, saveButtonProps } = useDrawerForm<any>({
    resource: "yields",
    id: props?.id,
    action: props.action,
    redirect: false,
    queryOptions: {
      enabled: props.action === "edit",
      onSuccess: (data) => {
        formProps.form.setFieldsValue(data?.data);
      },
    },
    onMutationSuccess: () => {
      props.onMutationSuccess?.();
    },
  });

  const onModalClose = () => {
    close();

    if (props?.onClose) {
      props.onClose();
      return;
    }
    go({
      to: searchParams.get("to") ?? getToPath({ action: "list" }) ?? "",
      query: { to: undefined },
      options: { keepQuery: true },
      type: "replace",
    });
  };

  const { t } = useTranslation();

  const title =
    props.action === "edit" ? t("yield.editLand") : t("yield.addLand");

  return (
    <Modal
      open={true}
      title={title}
      onCancel={onModalClose}
      footer={null}
      width={700}
      destroyOnClose
      style={{ maxHeight: "1000px" }}
      bodyStyle={{ height: "900px", overflowY: "auto" }}
    >
      <Spin spinning={formLoading}>
        <Form
          form={formProps?.form}
          layout="vertical"
          onFinish={formProps?.onFinish}
          onValuesChange={formProps?.onValuesChange}
        >
          <Form.Item
            label={t("yield.landName")}
            name="yield_name"
            rules={[{ required: true, message: t("yield.required.landName") }]}
          >
            <Input placeholder={t("yield.placeholder.landName")} />
          </Form.Item>

          <Form.Item
            label={t("yield.area")}
            name="area"
            rules={[{ required: true, message: t("yield.required.area") }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder={t("yield.placeholder.area")}
            />
          </Form.Item>

          <Form.Item
            label={t("yield.areaUnit")}
            name="area_unit"
            rules={[{ required: true, message: t("yield.required.areaUnit") }]}
          >
            <Input placeholder={t("yield.placeholder.areaUnit")} />
          </Form.Item>

          <Form.Item
            label={t("yield.description")}
            name="description"
            rules={[
              { required: true, message: t("yield.required.description") },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder={t("yield.placeholder.description")}
            />
          </Form.Item>

          <Form.Item
            label={t("yield.soilType")}
            name="type"
            rules={[{ required: true, message: t("yield.required.soilType") }]}
          >
            <Select placeholder={t("yield.placeholder.soilType")}>
              <Select.Option value="Đất xám">
                {t("yield.soilTypes.gray")}
              </Select.Option>
              <Select.Option value="Đất cát">
                {t("yield.soilTypes.sandy")}
              </Select.Option>
              <Select.Option value="Đất đỏ">
                {t("yield.soilTypes.red")}
              </Select.Option>
              <Select.Option value="Đất đen">
                {t("yield.soilTypes.black")}
              </Select.Option>
              <Select.Option value="Đất phèn">
                {t("yield.soilTypes.acidSulfate")}
              </Select.Option>
              <Select.Option value="Đất chua">
                {t("yield.soilTypes.acidic")}
              </Select.Option>
              <Select.Option value="Đất hữu cơ">
                {t("yield.soilTypes.organic")}
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={t("yield.status")}
            name="status"
            rules={[{ required: true, message: t("yield.required.status") }]}
          >
            <Select placeholder={t("yield.placeholder.status")}>
              <Select.Option value="Available">
                {t("yield.available")}
              </Select.Option>
              <Select.Option value="Maintenance">
                {t("yield.maintenance")}
              </Select.Option>
              <Select.Option value="In-Use">{t("yield.inUse")}</Select.Option>
            </Select>
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 16,
            }}
          >
            <Button onClick={onModalClose}>{t("actions.cancel")}</Button>
            <SaveButton {...saveButtonProps} htmlType="submit" type="primary">
              {t("buttons.save")}
            </SaveButton>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};
