import { DateField, TagField, TextField } from "@refinedev/antd";
import { BaseKey, HttpError, useShow } from "@refinedev/core";
import { Flex, Table, Tabs, TabsProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/lib/typography/Title";
import { useEffect, useState } from "react";

type PlanGeneralInformationProps = {
  id: BaseKey;
};

type GeneralInformationProps = {
  data: any;
};

export const GeneralInformation = (props: GeneralInformationProps) => {
  return (
    <>
      <Title level={4}>{props.data?.name}</Title>

      <Flex justify="space-between" style={{ gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <Title level={5}>{"Thời gian:"}</Title>
          {props.data?.status !== "not-start" ? (
            <>
              <DateField value={`${props.data?.start_date}`} /> {" - "}
              {props.data?.end_date ? (
                <DateField value={` ${props.data.end_date}`} />
              ) : (
                "Đang tiếp tục"
              )}
            </>
          ) : (
            "Chưa bắt đầu"
          )}
          <Title level={5}>{"Tổng diện tích trồng"}</Title>
          <TextField
            value={`${props.data?.area || "Không tìm thấy dữ liệu"}
            `}
          />
          <Title level={5}>{"Khu đất:"}</Title>
          {props.data?.lands?.length > 0
            ? props.data?.lands.map((land: any) => (
                <TagField value={`${land?.name}`} key={land?.id} />
              ))
            : "Chưa có khu đất nào được gán"}
        </div>

        <div style={{ flex: 1 }}>
          <Title level={5}>{"Dự kiến sản lượng:"}</Title>
          <TextField
            value={`${props.data?.expected_yield || "Chưa có dữ liệu"} ${
              props.data?.expected_unit || ""
            }`}
          />
          <Title level={5}>{"Tổng sản lượng thu hoạch:"}</Title>
          <TextField
            value={
              props.data?.total_yield
                ? `${props.data?.total_yield} ${
                    props.data?.expected_unit || ""
                  }`
                : "Chưa có dữ liệu"
            }
          />
          <Title level={5}>{"Nhân viên:"}</Title>
          {props.data?.employees?.length > 0
            ? props.data?.employees.map((employee: any) => (
                <TagField
                  value={`${employee?.name} - ${employee?.role}`}
                  key={employee?.id}
                />
              ))
            : "Chưa có nhân viên nào được gán"}
        </div>
      </Flex>
    </>
  );
};
type PlantInformationProps = {
  data: any;
};
export const PlantInformation = (props: PlantInformationProps) => {
  return (
    <div>
      <Title level={4}>{props.data?.seed?.name}</Title>

      <Flex justify="space-between" style={{ gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <Title level={5}>{"Mô tả: "}</Title>
          <TextArea disabled={true} value={props.data?.seed?.description} />
        </div>
        <div style={{ flex: 1 }}>
          <Title level={5}>{"Nhiệt độ phù hợp:"}</Title>
          <TextField
            value={`${props.data?.seed?.min_temperature}°C - ${props.data?.seed?.max_temperature}°C`}
          />
          <Title level={5}>{"Độ ẩm không khí phù hợp:"}</Title>
          <TextField
            value={`${props.data?.seed?.min_humidity}% - ${props.data?.seed?.max_humidity}%`}
          />
          <Title level={5}>{"Độ ẩm đất phù hợp:"}</Title>
          <TextField
            value={`${props.data?.seed?.min_moisture}% - ${props.data?.seed?.max_moisture}%`}
          />
        </div>
      </Flex>
    </div>
  );
};

type PlanFarmerTableListProps = {
  data: any;
};

export const PlanFarmerTableList = (props: any) => {
  const column_farmers = [
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Tên nhân viên",
      dataIndex: "name",
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
    },
  ];
  return <Table dataSource={props.data.farmers} />;
};

type PlanExpertTableListProps = {
  data: any;
};

export const PlanExpertTableList = (props: any) => {
  const column_farmers = [
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Tên nhân viên",
      dataIndex: "name",
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
    },
  ];
  return <Table dataSource={props.data.experts} />;
};

type PlanLandInformation = {
  data: any;
};
export const PlanLandInformation = (props: PlanLandInformation) => {
  const column_lands = [
    {
      title: "Tên khu đất",
      dataIndex: "name",
    },
    {
      title: "Diện tích",
      dataIndex: "area",
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
    },
  ];
  return <Table dataSource={props.data} columns={column_lands} />;
};

type PlanFertilizerInformation = {
  data: any;
};
export const PlanFertilizerInformation = (props: PlanFertilizerInformation) => {
  const column_items = [
    {
      title: "Tên phân bón",
      dataIndex: "name",
    },
    {
      title: "Loại",
      dataIndex: "type",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
    },
  ];
  return (
    <Table dataSource={props.data?.fertilizers} columns={column_items}></Table>
  );
};
type PlanPesticideInformation = {
  data: any;
};
export const PlanPesticideInformation = (props: PlanPesticideInformation) => {
  const column_items = [
    {
      title: "Tên thuốc",
      dataIndex: "name",
    },
    {
      title: "Loại",
      dataIndex: "type",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
    },
  ];
  return (
    <Table dataSource={props.data?.pesticides} columns={column_items}></Table>
  );
};

type PlanItemInformationProps = {
  data: any;
};
export const PlanItemInformation = (props: PlanItemInformationProps) => {
  const column_items = [
    {
      title: "Tên vật tư",
      dataIndex: "name",
    },
    {
      title: "Loại",
      dataIndex: "type",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
    },
  ];
  return <Table dataSource={props.data?.items} columns={column_items}></Table>;
};

export const PlanGeneralInformation = (props: PlanGeneralInformationProps) => {
  const { query: showRecord } = useShow<any, HttpError>({
    resource: "plans",
    id: props?.id,
  });
  const data = showRecord?.data?.data;

  const item_2 = <PlantInformation data={data} />;
  const item_1 = <GeneralInformation data={data} />;
  const item_3 = <PlanFarmerTableList data={data} />;
  const item_4 = <PlanExpertTableList data={data} />;
  const item_5 = <PlanLandInformation data={data?.lands} />;
  const item_6 = <PlanFertilizerInformation data={data} />;
  const item_7 = <PlanPesticideInformation data={data} />;
  const item_8 = <PlanItemInformation data={data} />;

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Thông tin chung",
      children: item_1,
    },
    {
      key: "2",
      label: "Thông tin cây trồng",
      children: item_2,
    },
    {
      key: "3",
      label: "Nông dân",
      children: item_3,
    },

    {
      key: "4",
      label: "Chuyên gia",
      children: item_4,
    },
    {
      key: "8",
      label: "Vật tư",
      children: item_8,
    },
    {
      key: "6",
      label: "Phân bón",
      children: item_6,
    },
    {
      key: "7",
      label: "Thuốc trừ sâu",
      children: item_7,
    },
    {
      key: "5",
      label: "Khu đất",
      children: item_5,
    },
  ];
  return (
    <>
      <Tabs tabPosition={"left"} defaultActiveKey="1" items={items} />
    </>
  );
};
