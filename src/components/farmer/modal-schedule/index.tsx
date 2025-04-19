import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { vi } from "date-fns/locale/vi";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { useState, useEffect } from "react";
import { Avatar, Flex, Modal, Typography } from "antd";
import { useList } from "@refinedev/core";

const locales = {
  vi,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const defaultMessages = {
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

// Định nghĩa màu cho trạng thái
const STATUS_COLOR_MAP = {
  pending: {
    color: "#faad14",
    bg: "rgba(250, 173, 20, 0.1)",
  },
  completed: {
    color: "#52c41a",
    bg: "rgba(82, 196, 26, 0.1)",
  },
  in_progress: {
    color: "#1890ff",
    bg: "rgba(24, 144, 255, 0.1)",
  },
  cancelled: {
    color: "#ff4d4f",
    bg: "rgba(255, 77, 79, 0.1)",
  },
  default: {
    color: "#8c8c8c",
    bg: "rgba(140, 140, 140, 0.1)",
  },
};

type Props = {
  farmerId: number;
  visible: boolean;
  onClose: () => void;
};

interface Schedule {
  task_id: number;
  start_date: string;
  end_date: string;
  task_type: "Harvesting Task" | "Caring Task" | "Packaging Task";
  title: string;
  status?: string;
  actor_name?: string;
  avatar?: string;
}

export const ModalSchedule = (props: Props) => {
  const [view, setView] = useState<string>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    start_date: format(startOfMonth(currentDate), "yyyy-MM-dd"),
    end_date: format(endOfMonth(currentDate), "yyyy-MM-dd"),
  });

  const {
    data: farmerScheduleCalendar,
    isLoading,
    refetch,
  } = useList<Schedule>({
    resource: `farmers/${props?.farmerId}/calendar`,
    queryOptions: {
      enabled: !!props?.farmerId && props?.visible === true,
    },
    filters: [
      {
        field: "farmer_id",
        operator: "eq",
        value: props?.farmerId,
      },
      {
        field: "type",
        operator: "eq",
        value: "farmer",
      },
      {
        field: "start_date",
        operator: "gte",
        value: dateRange.start_date,
      },
      {
        field: "end_date",
        operator: "lte",
        value: dateRange.end_date,
      },
    ],
  });

  useEffect(() => {
    const start = format(startOfMonth(currentDate), "yyyy-MM-dd");
    const end = format(endOfMonth(currentDate), "yyyy-MM-dd");

    setDateRange({
      start_date: start,
      end_date: end,
    });

    refetch();
  }, [currentDate, refetch]);

  const getVietnameseTaskTitle = (taskType: string): string => {
    switch (taskType) {
      case "Harvesting Task":
        return "Thu hoạch";
      case "Caring Task":
        return "Chăm sóc";
      case "Packaging Task":
        return "Đóng gói";
      default:
        return taskType;
    }
  };

  const events =
    farmerScheduleCalendar?.data?.map((schedule) => ({
      id: schedule.task_id,
      title: getVietnameseTaskTitle(schedule.task_type),
      start: new Date(schedule.start_date),
      end: new Date(schedule.end_date),
      status: schedule.status || "pending",
      type: schedule.task_type,
      actor_name: schedule.actor_name,
      avatar: schedule.avatar,
    })) || [];

  useEffect(() => {
    if (props.visible) {
      setCurrentDate(new Date());
    } else {
      setCurrentDate(new Date(dateRange.start_date));
    }
  }, [props.visible]);

  return (
    <Modal
      title="Lịch nhân viên"
      loading={isLoading}
      open={props.visible}
      onCancel={props.onClose}
      width={1000}
    >
      <Calendar
        popup
        messages={defaultMessages}
        localizer={localizer}
        events={events.map((event) => {
          const statusColor =
            STATUS_COLOR_MAP[event.status as keyof typeof STATUS_COLOR_MAP] ||
            STATUS_COLOR_MAP.default;

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
                </Flex>
              </Flex>
            ),
            start: event.start,
            end: event.end,
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
    </Modal>
  );
};
