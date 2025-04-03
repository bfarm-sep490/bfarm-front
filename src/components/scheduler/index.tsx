import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useList } from "@refinedev/core";
import { useParams } from "react-router";
import { Card } from "antd";

const localizer = momentLocalizer(moment);

export const ScheduleComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
      status: "Pending" | "Complete" | "Ongoing" | "Cancel" | "Incomplete";
    }[]
  >([]);

  const { data: caringData, isLoading: caringLoading } = useList({
    resource: "caring-tasks",
    filters: [{ field: "plan_id", operator: "eq", value: id }],
  });
  const { data: harvestData, isLoading: harvestLoading } = useList({
    resource: "harvesting-tasks",
    filters: [{ field: "plan_id", operator: "eq", value: id }],
  });
  const { data: packingData, isLoading: packingLoading } = useList({
    resource: "packaging-tasks",
    filters: [{ field: "plan_id", operator: "eq", value: id }],
  });
  const { data: inspectionData, isLoading: inspectionLoading } = useList({
    resource: "inspecting-forms",
    filters: [{ field: "plan_id", operator: "eq", value: id }],
  });

  useEffect(() => {
    if (caringLoading || harvestLoading || packingLoading || inspectionLoading) return;

    if (caringData?.data && harvestData?.data && packingData?.data && inspectionData?.data) {
      const allEvents = [
        ...caringData.data.map((task) => ({
          id: task.id as number,
          title: task.task_name,
          start: new Date(task.start_date),
          end: new Date(task.end_date),
          type: "Chăm sóc" as const,
          status: task.status as "Pending" | "Complete" | "Ongoing" | "Cancel" | "Incomplete",
        })),
        ...harvestData.data.map((task) => ({
          id: task.id as number,
          title: task.task_name,
          start: new Date(task.start_date),
          end: new Date(task.end_date),
          type: "Thu hoạch" as const,
          status: task.status as "Pending" | "Complete" | "Ongoing" | "Cancel" | "Incomplete",
        })),
        ...packingData.data.map((task) => ({
          id: task.id as number,
          title: task.task_name,
          start: new Date(task.start_date),
          end: new Date(task.end_date),
          type: "Đóng gói" as const,
          status: task.status as "Pending" | "Complete" | "Ongoing" | "Cancel" | "Incomplete",
        })),
        ...inspectionData.data.map((form) => ({
          id: form.id as number,
          title: form.name,
          start: new Date(form.start_date),
          end: new Date(form.end_date),
          type: "Kiểm định" as const,
          status: form.status as "Pending" | "Complete" | "Ongoing" | "Cancel" | "Incomplete",
        })),
      ].filter((event) => event.id !== undefined);

      setEvents(allEvents);
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
  ]);

  return (
    <Card title="📅 Lịch chăm sóc cây trồng" loading={isLoading}>
      <div>
        <Calendar
          localizer={localizer}
          events={events}
          view={view as View}
          date={currentDate}
          onView={(newView) => {
            setView(newView);
            console.log("View đổi thành:", newView);
          }}
          onNavigate={(newDate) => {
            setCurrentDate(newDate);
          }}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day", "agenda"]}
          style={{ height: 800 }}
          eventPropGetter={(event, start, end, isSelected) => {
            return {
              style: {
                backgroundColor:
                  event.status === "Pending"
                    ? "orange"
                    : event?.status === "Complete"
                      ? "green"
                      : event?.status === "Ongoing"
                        ? "blue"
                        : event?.status === "Cancel"
                          ? "red"
                          : "gray",
                color: "white",
                fontWeight: "bold",
              },
            };
          }}
        />
      </div>
    </Card>
  );
};
