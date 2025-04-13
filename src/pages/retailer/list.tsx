/* eslint-disable prettier/prettier */
import { RetailersListCard } from "@/components/retailer/list-card";
import { RetailersListTable } from "@/components/retailer/list-table";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { CreateButton, List } from "@refinedev/antd";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { Segmented } from "antd";
import { type PropsWithChildren, useState } from "react";
import { useLocation } from "react-router";

type View = "table" | "card";

export const RetailersList = ({ children }: PropsWithChildren) => {
    const go = useGo();
    const { replace } = useNavigation();
    const { pathname } = useLocation();
    const { createUrl } = useNavigation();

    const [view, setView] = useState<View>(
        (localStorage.getItem("retailer-view") as View) || "table"
    );

    const handleViewChange = (value: View) => {
        // remove query params (pagination, filters, etc.) when changing view
        replace("");

        setView(value);
        localStorage.setItem("retailer-view", value);
    };

    const t = useTranslate();

    return (
        <List
            breadcrumb={false}
            title={t("resources.retailers.name", "Nhà mua sỉ")}
            headerButtons={(props) => [
                <Segmented<View>
                    key="view"
                    size="large"
                    value={view}
                    style={{ marginRight: 24 }}
                    options={[
                        {
                            label: "",
                            value: "table",
                            icon: <UnorderedListOutlined />,
                        },
                        {
                            label: "",
                            value: "card",
                            icon: <AppstoreOutlined />,
                        },
                    ]}
                    onChange={handleViewChange}
                />,

            ]}
        >
            {view === "table" && <RetailersListTable />}
            {view === "card" && <RetailersListCard />}
            {children}
        </List>
    );
};
