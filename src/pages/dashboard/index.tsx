import { useEffect, useMemo, useState } from "react";
import { Alert, Row, Col, theme, Dropdown, type MenuProps, Button, Flex } from "antd";
import { useTranslation } from "react-i18next";
import {} from "../../components";
import { DownOutlined, RiseOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { List, NumberField } from "@refinedev/antd";
import { useApiUrl, useCustom } from "@refinedev/core";
import dayjs from "dayjs";
import { IQuickStatsEntry } from "../../interfaces";

type DateFilter = "lastWeek" | "lastMonth";

const DATE_FILTERS: Record<DateFilter, { text: string; value: DateFilter }> = {
  lastWeek: { text: "lastWeek", value: "lastWeek" },
  lastMonth: { text: "lastMonth", value: "lastMonth" },
};

export const DashboardPage: React.FC = () => {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const API_URL = useApiUrl();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const loginSuccess = localStorage.getItem("loginSuccess");

    if (loginSuccess === "true") {
      setShowAlert(true); 
      localStorage.removeItem("loginSuccess");

      setTimeout(() => {
        setShowAlert(false);
      }, 2000); 
    }
  }, []);

  const [selecetedDateFilter, setSelectedDateFilter] = useState<DateFilter>(
    DATE_FILTERS.lastWeek.value,
  );

  const dateFilters: MenuProps["items"] = Object.keys(DATE_FILTERS).map((filter) => ({
    key: DATE_FILTERS[filter as DateFilter].value,
    label: t(`dashboard.filter.date.${DATE_FILTERS[filter as DateFilter].text}`),
    onClick: () => setSelectedDateFilter(DATE_FILTERS[filter as DateFilter].value),
  }));

  const dateFilterQuery = useMemo(() => {
    const now = dayjs();
    switch (selecetedDateFilter) {
      case "lastWeek":
        return { start: now.subtract(6, "days").startOf("day").format(), end: now.endOf("day").format() };
      case "lastMonth":
        return { start: now.subtract(1, "month").startOf("day").format(), end: now.endOf("day").format() };
      default:
        return { start: now.subtract(7, "days").startOf("day").format(), end: now.endOf("day").format() };
    }
  }, [selecetedDateFilter]);

  const { data: quickStatsData } = useCustom<{
    data: IQuickStatsEntry[];
    total: number;
    trend: number;
  }>({
    url: `${API_URL}/quick-stats`,
    method: "get",
    config: { query: dateFilterQuery },
  });

  const quick = useMemo(() => {
    const data = quickStatsData?.data?.data;
    if (!data) return { data: [], trend: 0 };

    return {
      data: data.map((order) => ({
        timeText: order.stat_name,
        value: order.value,
        state: order.description,
      })),
      trend: quickStatsData?.data?.trend || 0,
    };
  }, [quickStatsData]);

  return <></>;
};
