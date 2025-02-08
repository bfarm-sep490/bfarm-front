import { DateField, TagField, TextField } from "@refinedev/antd";
import { Flex, Tabs, TabsProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/lib/typography/Title";
import { useEffect, useState } from "react";

type PlanGeneralInformationProps = {
  data: any;
};

export const PlanGeneralInformation = (props: PlanGeneralInformationProps) => {
  const [record, setRecord] = useState<any>(props?.data);
  useEffect(() => {
    setRecord(props.data);
  }, [props?.data]);
  const item_2 = (
    <div>
      <Title level={4}>{record?.seed?.name}</Title>

      <Flex justify="space-between" style={{ gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <Title level={5}>{"Mô tả: "}</Title>
          <TextArea disabled={true} value={record?.seed?.description} />
        </div>
        <div style={{ flex: 1 }}>
          <Title level={5}>{"Nhiệt độ phù hợp:"}</Title>
          <TextField
            value={`${record?.seed?.min_temperature}°C - ${record?.seed?.max_temperature}°C`}
          />
          <Title level={5}>{"Độ ẩm không khí phù hợp:"}</Title>
          <TextField
            value={`${record?.seed?.min_humidity}% - ${record?.seed?.max_humidity}%`}
          />
          <Title level={5}>{"Độ ẩm đất phù hợp:"}</Title>
          <TextField
            value={`${record?.seed?.min_moisture}% - ${record?.seed?.max_moisture}%`}
          />
        </div>
      </Flex>
    </div>
  );
  const item_1 = (
    <>
      <Title level={4}>{record?.name}</Title>

      <Flex justify="space-between" style={{ gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <Title level={5}>{"Thời gian:"}</Title>
          {record?.status !== "not-start" ? (
            <>
              <DateField value={`${record?.start_date}`} /> {" - "}
              {record?.end_date ? (
                <DateField value={` ${record.end_date}`} />
              ) : (
                "Đang tiếp tục"
              )}
            </>
          ) : (
            "Chưa bắt đầu"
          )}
          <Title level={5}>{"Tổng diện tích trồng"}</Title>
          <TextField
            value={`${record?.area || "Không tìm thấy dữ liệu"}
            `}
          />
          <Title level={5}>{"Khu đất:"}</Title>
          {record?.lands?.length > 0
            ? record?.lands.map((land: any) => (
                <TagField value={`${land?.name}`} key={land?.id} />
              ))
            : "Chưa có khu đất nào được gán"}
        </div>

        <div style={{ flex: 1 }}>
          <Title level={5}>{"Dự kiến sản lượng:"}</Title>
          <TextField
            value={`${record?.expected_yield || "Chưa có dữ liệu"} ${
              record?.expected_unit || ""
            }`}
          />
          <Title level={5}>{"Tổng sản lượng thu hoạch:"}</Title>
          <TextField
            value={
              record?.total_yield
                ? `${record?.total_yield} ${record?.expected_unit || ""}`
                : "Chưa có dữ liệu"
            }
          />
          <Title level={5}>{"Nhân viên:"}</Title>
          {record?.employees?.length > 0
            ? record?.employees.map((employee: any) => (
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
  const item_3 = (
    <>
      <p>Nhân viên phụ trách</p>
    </>
  );
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
      label: "Nhân viên phụ trách",
      children: item_3,
    },
    {
      key: "4",
      label: "Thông tin vật tư",
      children: item_3,
    },
    {
      key: "5",
      label: "Thông tin hoạt động",
      children: item_3,
    },
    {
      key: "6",
      label: "Khu đất",
      children: item_3,
    },
  ];
  return (
    <>
      <Tabs tabPosition={"left"} defaultActiveKey="1" items={items} />
    </>
  );
};
