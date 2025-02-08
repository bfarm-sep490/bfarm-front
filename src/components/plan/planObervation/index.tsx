import { Flex, Select, Space } from "antd";
import Title from "antd/lib/typography/Title";
import { useEffect, useState } from "react";
import { RealTimeEnvironment } from "../realTimeCardEnviroment";
import { EnvironmentDashboard } from "../environmentDashboard";

type PlanObservationProps = {
  data: any;
};
export const PlanObservation = (props: PlanObservationProps) => {
  const [chosenLand, setChosenLand] = useState<any>(null);
  const [deviceCodes, setDeviceCodes] = useState<string[]>([]);
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    if (props.data?.lands?.length > 0) {
      setOptions(
        props.data.lands.map((land: any) => ({
          label: land.name,
          value: land.id,
        }))
      );
      setChosenLand(props.data.lands[0]);
    }
  }, [props.data]);

  useEffect(() => {
    if (chosenLand) {
      setDeviceCodes(chosenLand.devices.map((device: any) => device.code));
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
          defaultValue={chosenLand?.id}
          options={options}
          style={{ width: "300px" }}
          onChange={(value) => {
            const land = props.data.lands.find((l: any) => l.id === value);
            setChosenLand(land);
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
            data={props.data?.environment_data}
            land_id={chosenLand?.id}
          />
        </div>
      </Flex>
    </>
  );
};
