import { Flex, Select, Space } from "antd";
import Title from "antd/lib/typography/Title";
import { useEffect, useState } from "react";
import { RealTimeEnvironment } from "../real-time-enviroment";
import { EnvironmentDashboard } from "../environment-dashboard";
import { BaseKey, HttpError, useShow } from "@refinedev/core";

type PlanObservationProps = {
  id?: BaseKey;
};

export const PlanObservation = (props: PlanObservationProps) => {
  const [chosenLand, setChosenLand] = useState<any>(null);
  const [deviceCodes, setDeviceCodes] = useState<string[]>([]);
  const [options, setOptions] = useState<any[]>([]);

  const { query: showRecord } = useShow<any, HttpError>({
    resource: "plans",
    id: props?.id,
  });

  const data = showRecord?.data?.data;

  useEffect(() => {
    if (data?.lands && data.lands.length > 0) {
      const formattedOptions = data.lands.map((land: any) => ({
        label: land.name,
        value: land.id,
      }));

      setOptions(formattedOptions);
      setChosenLand(data.lands[0]);
    }
  }, [data]);

  useEffect(() => {
    if (chosenLand?.devices?.length > 0) {
      setDeviceCodes(chosenLand.devices.map((device: any) => device.code));
    } else {
      setDeviceCodes([]);
    }
  }, [chosenLand]);

  return (
    <>
      <Space
        align="center"
        style={{ display: "flex", gap: "5px", marginBottom: "20px" }}
      >
        <Title level={5}>Khu đất:</Title>
        <Select
          value={chosenLand?.id}
          options={options}
          style={{ width: "300px" }}
          onChange={(value) => {
            const land = data?.lands.find((l: any) => l.id === value);
            setChosenLand(land || null);
          }}
        />
      </Space>
      <Flex style={{ gap: "20px" }}>
        <div style={{ flex: 0.4 }}>
          <RealTimeEnvironment
            device_codes={deviceCodes}
            land_id={chosenLand?.id}
          />
        </div>
        <div style={{ flex: 2.7 }}>
          <EnvironmentDashboard
            data={data?.environment_data}
            land_id={chosenLand?.id}
          />
        </div>
      </Flex>
    </>
  );
};
