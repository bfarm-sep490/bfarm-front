import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useList } from "@refinedev/core";
import { Navigate, useNavigate, useParams } from "react-router";
import { format, parse, startOfWeek, getDay } from "date-fns";

import { Avatar, Card, Flex, Typography } from "antd";
import { vi } from "date-fns/locale/vi";
import "./index.css";

const locales = {
  vi,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Bắt đầu từ thứ 2
  getDay,
  locales,
});

// Defined status color map outside to ensure it's always available
const STATUS_COLOR_MAP = {
  Pending: { color: "#DC6B08", bg: "#FFF7E6" },
  Complete: { color: "#389E0D", bg: "#F6FFED" },
  Ongoing: { color: "#0973E4", bg: "#E6F4FF" },
  Cancel: { color: "#D81322", bg: "#FFF1F0" },
  Incomplete: { color: "#FAFAFA", bg: "#FAFAFA" },
  default: { color: "#000000", bg: "#FFFFFF" }, // Fallback colors
};

var defaultMessages = {
  date: "Ngày",
  time: "Giờ",
  event: "Hoạt động",
  allDay: "Cả ngày",
  week: "Tuần",
  work_week: "Tuần làm việc",
  day: "Ngày",
  month: "Tháng",
  previous: "Sau",
  next: "Tiếp",
  yesterday: "Hôm qua",
  tomorrow: "Ngày mai",
  today: "Hôm nay",
  agenda: "Lịch trình",
  noEventsInRange: "Không hoạt động nào trong khoảng này.",
  showMore: function showMore(total: any) {
    return "+" + total + " cái khác";
  },
};

export const ScheduleComponent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<
    {
      id: number;
      title: string;
      start: Date;
      end: Date;
      type: "Chăm sóc" | "Thu hoạch" | "Đóng gói" | "Kiểm định";
      status: keyof typeof STATUS_COLOR_MAP;
      actor_id: number;
      actor_name: string;
      avatar: string;
    }[]
  >([]);

  const { data: chosenFarmerData, isLoading: chosenFarmerLoading } = useList({
    resource: `farmers`,
  });
  const { data: caringData, isLoading: caringLoading } = useList({
    resource: "caring-tasks",
    filters: [
      { field: "plan_id", operator: "eq", value: id },
      {
        field: "status",
        operator: "eq",
        value: ["Ongoing", "Pending", "Cancel", "Incomplete", "Complete"],
      },
    ],
  });
  const { data: harvestData, isLoading: harvestLoading } = useList({
    resource: "harvesting-tasks",
    filters: [
      { field: "plan_id", operator: "eq", value: id },
      {
        field: "status",
        operator: "eq",
        value: ["Ongoing", "Pending", "Cancel", "Incomplete", "Complete"],
      },
    ],
  });
  const { data: packingData, isLoading: packingLoading } = useList({
    resource: "packaging-tasks",
    filters: [
      { field: "plan_id", operator: "eq", value: id },
      {
        field: "status",
        operator: "eq",
        value: ["Ongoing", "Pending", "Cancel", "Incomplete", "Complete"],
      },
    ],
  });
  const { data: inspectionData, isLoading: inspectionLoading } = useList({
    resource: "inspecting-forms",
    filters: [
      { field: "plan_id", operator: "eq", value: id },
      {
        field: "status",
        operator: "eq",
        value: ["Ongoing", "Pending", "Cancel", "Incomplete", "Complete"],
      },
    ],
  });
  const { data: inspectorData, isLoading: inspectorLoading } = useList({
    resource: "inspectors",
  });

  const inspectors = inspectorData?.data;
  const farmers = chosenFarmerData?.data;

  useEffect(() => {
    if (
      caringLoading ||
      harvestLoading ||
      packingLoading ||
      inspectionLoading ||
      inspectorLoading ||
      chosenFarmerLoading
    )
      return;

    if (
      caringData?.data &&
      harvestData?.data &&
      packingData?.data &&
      inspectionData?.data &&
      inspectorData?.data &&
      chosenFarmerData?.data
    ) {
      const allEvents = [
        ...caringData.data.map((task) => ({
          id: task.id as number,
          title: task.task_name,
          start: new Date(task.start_date),
          end: new Date(task.end_date),
          type: "Chăm sóc" as const,
          status: task.status as keyof typeof STATUS_COLOR_MAP,
          actor_id: task.farmer_id as number,
          actor_name: farmers?.find((farmer) => farmer.id === task.farmer_id)?.name,
          avatar: farmers?.find((farmer) => farmer.id === task.farmer_id)?.avatar_image,
        })),
        ...harvestData.data.map((task) => ({
          id: task.id as number,
          title: task.task_name,
          start: new Date(task.start_date),
          end: new Date(task.end_date),
          type: "Thu hoạch" as const,
          status: task.status as keyof typeof STATUS_COLOR_MAP,
          actor_id: task.farmer_id as number,
          actor_name: farmers?.find((farmer) => farmer.id === task.farmer_id)?.name,
          avatar: farmers?.find((farmer) => farmer.id === task.farmer_id)?.avatar_image,
        })),
        ...packingData.data.map((task) => ({
          id: task.id as number,
          title: task.task_name,
          start: new Date(task.start_date),
          end: new Date(task.end_date),
          type: "Đóng gói" as const,
          status: task.status as keyof typeof STATUS_COLOR_MAP,
          actor_id: task.farmer_id as number,
          actor_name: farmers?.find((farmer) => farmer.id === task.farmer_id)?.name,
          avatar: farmers?.find((farmer) => farmer.id === task.farmer_id)?.avatar_image,
        })),
        ...inspectionData.data.map((form) => ({
          id: form.id as number,
          title: form.task_name,
          start: new Date(form.start_date),
          end: new Date(form.end_date),
          type: "Kiểm định" as const,
          status: form.status as keyof typeof STATUS_COLOR_MAP,
          actor_id: inspectors?.find((inspector) => inspector.id === form.inspector_id)
            ?.id as number,
          actor_name: inspectors?.find((inspector) => inspector.id === form.inspector_id)?.name,
          avatar: inspectors?.find((inspector) => inspector.id === form.inspector_id)?.image_url,
        })),
      ].filter((event) => event.id !== undefined);

      const sort = allEvents.sort((a, b) => {
        return (
          new Date(a.end).getDate() -
          new Date(a.start).getDate() -
          (new Date(b.end).getDate() - new Date(b.start).getDate())
        );
      });
      setEvents(sort);
      setIsLoading(false);
    }
  }, [
    caringData,
    harvestData,
    packingData,
    inspectionData,
    caringLoading,
    harvestLoading,
    packingLoading,
    inspectionLoading,
    inspectorLoading,
    chosenFarmerLoading,
    inspectors,
    farmers,
  ]);

  return (
    <Card title="📅 Lịch kế hoạch" loading={isLoading}>
      <div className="calendar-container">
        <Calendar
          popup
          messages={defaultMessages}
          localizer={localizer}
          onDoubleClickEvent={(event) => {
            if (event.type === "Kiểm định") {
              navigate(`inspecting-forms/${event.id}`);
            } else if (event.type === "Đóng gói") {
              navigate(`packaging-tasks/${event.id}`);
            } else if (event.type === "Chăm sóc") {
              navigate(`caring-tasks/${event.id}`);
            } else if (event.type === "Thu hoạch") {
              navigate(`harvesting-tasks/${event.id}`);
            } else {
              return;
            }
          }}
          events={events.map((event) => {
            const statusColor = STATUS_COLOR_MAP[event.status] || STATUS_COLOR_MAP.default;

            return {
              title: (
                <Flex
                  dir="row"
                  justify="space-between"
                  align="center"
                  style={{
                    width: "100%",
                    padding: "0 4px",
                  }}
                >
                  <Typography.Text strong style={{ color: statusColor.color }}>
                    {event.title}
                  </Typography.Text>
                  <Flex align="center" gap={8}>
                    {window.innerWidth > 768 && (
                      <Typography.Text style={{ color: "gray", fontSize: 12 }}>
                        {event?.actor_name}
                      </Typography.Text>
                    )}
                    <Avatar src={event?.avatar} alt="" size={"small"} />
                  </Flex>
                </Flex>
              ),
              start: new Date(event.start),
              end: new Date(event.end),
              status: event.status,
              id: event.id,
              type: event.type,
            };
          })}
          view={view as View}
          date={currentDate}
          onView={(newView) => setView(newView)}
          onNavigate={(newDate) => setCurrentDate(newDate)}
          views={["month", "week", "day", "agenda"]}
          style={{ height: 800 }}
          eventPropGetter={(event) => {
            const statusColor =
              STATUS_COLOR_MAP[event.status as keyof typeof STATUS_COLOR_MAP] ||
              STATUS_COLOR_MAP.default;

            return {
              style: {
                border: `1px solid ${statusColor.color}`,
                backgroundColor: statusColor.bg,
                color: statusColor.color,
              },
            };
          }}
        />
      </div>
    </Card>
  );
};
