import { DateField } from "@refinedev/antd";
import { Card, FormProps, Select, Table, Tabs } from "antd";
import { ColumnsType } from "antd/es/table";
import { CaringTypeTag } from "../../../components/caring-task/type-tag";
import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface Task {
  id: number;
  task_name: string;
  start_date: string;
  end_date: string;
  task_type?: string;
}

interface ProductiveTask extends Task {
  farmer_id?: number;
  task_type: string;
}

interface HarvestingTask extends Task {
  farmer_id?: number;
}

interface PackagingTask extends Task {
  farmer_id?: number;
}

interface InspectingTask extends Task {
  inspector_id?: number;
}

interface Farmer {
  id: number;
  name: string;
}

interface Inspector {
  id: number;
  name: string;
}

type Props = {
  formProps: FormProps;
  chosenFarmers: Farmer[];
  productiveTasks: ProductiveTask[];
  harvestingTasks: HarvestingTask[];
  inspectingTasks: InspectingTask[];
  setChosenFarmers(value: Farmer[]): void;
  setProductiveTasks(value: ProductiveTask[]): void;
  setHarvestingTasks(value: HarvestingTask[]): void;
  inspectors: Inspector[];
  setInspectingTasks(value: InspectingTask[]): void;
  packagingTasks: PackagingTask[];
  setPackagingTasks(value: PackagingTask[]): void;
};

export const AssignTasks = ({
  chosenFarmers,
  formProps,
  harvestingTasks,
  inspectingTasks,
  packagingTasks,
  productiveTasks,
  setHarvestingTasks,
  setInspectingTasks,
  setPackagingTasks,
  setProductiveTasks,
  inspectors,
}: Props) => {
  const calculateTaskCountForFarmer = (farmerId: number) => {
    return (
      (productiveTasks?.filter((task) => task.farmer_id === farmerId)?.length ?? 0) +
      (harvestingTasks?.filter((task) => task.farmer_id === farmerId)?.length ?? 0) +
      (packagingTasks?.filter((task) => task.farmer_id === farmerId)?.length ?? 0) +
      (inspectingTasks?.filter((task) => task.inspector_id === farmerId)?.length ?? 0)
    );
  };

  const [chartState, setChartState] = React.useState<{
    series: { name: string; data: number[] }[];
    options: ApexOptions;
  }>({
    series: [
      {
        name: "Số lượng công việc",
        data: chosenFarmers?.map((farmer) => calculateTaskCountForFarmer(farmer.id)),
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: chosenFarmers?.map((farmer) => farmer.name),
      },
    },
  });

  const updateChart = () => {
    setChartState({
      series: [
        {
          name: "Số lượng công việc",
          data: chosenFarmers?.map((farmer) => calculateTaskCountForFarmer(farmer.id)),
        },
      ],
      options: {
        ...chartState.options,
        xaxis: {
          categories: chosenFarmers?.map((farmer) => farmer.name),
        },
      },
    });
  };

  useEffect(() => {
    updateChart();
  }, [chosenFarmers, productiveTasks, harvestingTasks, packagingTasks, inspectingTasks]);

  const column_productive: ColumnsType<ProductiveTask> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (_, record) => <DateField value={record.start_date} format="DD/MM/YYYY" />,
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (_, record) => <DateField value={record.end_date} format="DD/MM/YYYY" />,
    },
    {
      title: "Loại chăm sóc",
      dataIndex: "task_type",
      key: "type",
      render: (_, record) => (
        <CaringTypeTag
          status={
            record.task_type as
              | "Planting"
              | "Nurturing"
              | "Watering"
              | "Fertilizing"
              | "Setup"
              | "Pesticide"
              | "Weeding"
              | "Pruning"
          }
        />
      ),
    },
    {
      title: "Lựa chọn nông dân",
      key: "farmer_id",
      dataIndex: "farmer_id",
      fixed: "left",
      render: (_, record) => (
        <Select
          key={record.id}
          value={record.farmer_id || undefined}
          onChange={(value: number) => {
            const newProductiveTasks = productiveTasks.map((task) => {
              if (record.id === task.id) {
                return {
                  ...task,
                  farmer_id: value,
                };
              }
              return task;
            });
            setProductiveTasks(newProductiveTasks);
          }}
          style={{ width: "150px" }}
        >
          {chosenFarmers.map((farmer) => (
            <Select.Option key={farmer.id} value={farmer.id}>
              {farmer.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  const column_packaging: ColumnsType<PackagingTask> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (_, record) => <DateField value={record.start_date} format="DD/MM/YYYY" />,
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (_, record) => <DateField value={record.end_date} format="DD/MM/YYYY" />,
    },
    {
      title: "Lựa chọn nông dân",
      key: "farmer_id",
      dataIndex: "farmer_id",
      fixed: "left",
      render: (_, record) => (
        <Select
          key={record.id}
          value={record.farmer_id || undefined}
          onChange={(value: number) => {
            const newPackagingTasks = packagingTasks.map((task) => {
              if (record.id === task.id) {
                return {
                  ...task,
                  farmer_id: value,
                };
              }
              return task;
            });
            setPackagingTasks(newPackagingTasks);
          }}
          style={{ width: "150px" }}
        >
          {chosenFarmers.map((farmer) => (
            <Select.Option key={farmer.id} value={farmer.id}>
              {farmer.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  const column_harvesting: ColumnsType<HarvestingTask> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên thu hoạch",
      dataIndex: "task_name",
      key: "task_name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "startDate",
      render: (_, record) => <DateField value={record.start_date} format="DD/MM/YYYY" />,
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (_, record) => <DateField value={record.end_date} format="DD/MM/YYYY" />,
    },
    {
      title: "Lựa chọn nông dân",
      fixed: "left",
      key: "farmer_id",
      dataIndex: "farmer_id",
      render: (_, record) => (
        <Select
          key={record.id}
          value={record.farmer_id || undefined}
          onChange={(value: number) => {
            const newHarvestingTask = harvestingTasks.map((task) => {
              if (record.id === task.id) {
                return {
                  ...task,
                  farmer_id: value,
                };
              }
              return task;
            });
            setHarvestingTasks(newHarvestingTask);
          }}
          style={{ width: "150px" }}
        >
          {chosenFarmers.map((chosenFarmer) => (
            <Select.Option key={chosenFarmer.id} value={chosenFarmer.id}>
              {chosenFarmer.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  const column_inspecting: ColumnsType<InspectingTask> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên công việc",
      dataIndex: "task_name",
      key: "name",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (_, record) => <DateField value={record.start_date} format="DD/MM/YYYY" />,
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (_, record) => <DateField value={record.end_date} format="DD/MM/YYYY" />,
    },
    {
      title: "Lựa chọn nhà kiểm định",
      fixed: "left",
      key: "inspector_id",
      dataIndex: "inspector_id",
      render: (_, record) => (
        <Select
          key={record.id}
          value={record.inspector_id || undefined}
          onChange={(value: number) => {
            const newInspectingTasks = inspectingTasks.map((task) => {
              if (task.id === record.id) {
                return {
                  ...task,
                  inspector_id: value,
                };
              }
              return task;
            });
            setInspectingTasks([...newInspectingTasks]);
          }}
          style={{ width: "150px" }}
        >
          {inspectors.map((inspector) => (
            <Select.Option key={inspector.id} value={inspector.id}>
              {inspector.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <>
      <Card title={"Biểu đồ công việc"}>
        <ReactApexChart
          options={chartState.options}
          series={chartState.series}
          type="bar"
          height={350}
        />
      </Card>
      <Card title="Phân bổ công việc" style={{ minHeight: "600px", marginTop: 20 }}>
        <Tabs defaultActiveKey={"1"} tabPosition={"left"} style={{ minHeight: 220 }}>
          <Tabs.TabPane key="1" tab="Chăm sóc">
            <Table
              pagination={{
                pageSize: 10,
              }}
              columns={column_productive}
              dataSource={productiveTasks}
              rowKey="id"
              scroll={{ x: "max-content" }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="2" tab="Thu hoạch">
            <Table
              pagination={{
                pageSize: 10,
              }}
              columns={column_harvesting}
              dataSource={harvestingTasks}
              rowKey="id"
              scroll={{ x: "max-content" }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="3" tab="Kiểm định">
            <Table
              pagination={{
                pageSize: 10,
              }}
              columns={column_inspecting}
              dataSource={inspectingTasks}
              rowKey="id"
              scroll={{ x: "max-content" }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="4" tab="Đóng gói">
            <Table
              pagination={{
                pageSize: 10,
              }}
              columns={column_packaging}
              dataSource={packagingTasks}
              rowKey="id"
              scroll={{ x: "max-content" }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </>
  );
};
