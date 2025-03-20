import React from "react";
import { Authenticated, IResourceItem, Refine } from "@refinedev/core";
import { RefineKbarProvider, RefineKbar } from "@refinedev/kbar";
import { ThemedLayoutV2, ErrorComponent, useNotificationProvider } from "@refinedev/antd";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import {
  CalendarOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  GoldOutlined,
  HddOutlined,
  ScheduleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { authProvider } from "./authProvider";

import "dayjs/locale/vi";

import { DashboardPage } from "./pages/dashboard";
import { AuthPage } from "./pages/auth";
import { CustomerShow, CustomerList } from "./pages/customers";
import { useTranslation } from "react-i18next";
import { Header, Title } from "./components";
import { ConfigProvider } from "./context";

import "@refinedev/antd/dist/reset.css";
import {
  FarmerManagementCreate,
  FarmerManagementEdit,
  FarmerManagementShow,
} from "./pages/farmer-managements";
import { DeviceList } from "./pages/devices";
import { themeConfig } from "./components/theme";
import { ThemedSiderV2 } from "./components/layout/sider";

import { PlanList, PlanShow } from "./pages/plans";
import { ShowProblemList } from "./pages/plans/problem/list";
import { ShowTasksList } from "./pages/plans/tasks/show";
import { ApprovingPlanDrawer } from "./pages/plans/approvaled-drawer";
import { ProblemShowV2 } from "./pages/problems/show";
import { ProductiveTaskShow } from "./components/caring-task/show";
import { HarvestingTaskShow } from "./components/harvesting-task/show";
import { PackagingTaskShow } from "./components/packaging-task/show";
import { ProblemListInProblems } from "./pages/problems/list";
import { CaringCreate } from "./pages/plans/tasks/caring-create";
import { CaringUpdate } from "./pages/plans/tasks/caring-update";
import { dataProvider } from "./rest-data-provider";
import { App as AntdApp } from "antd";
import { useAutoLoginForDemo } from "./hooks";
import {
  FertilizersCreate,
  FertilizersEdit,
  FertilizersList,
  FertilizersShow,
} from "./pages/fertilizers";
import { FarmerList } from "./pages/farmers";
import { FarmersShow } from "./pages/farmers/show";
import { FarmerCreate } from "./pages/farmers/create";
import { FarmerEdit } from "./pages/farmers/edit";
import { ExpertCreate, ExpertEdit, ExpertList, ExpertShow } from "./pages/experts";
import { InspectorList } from "./pages/inspectors";
import { InspectorEdit } from "./pages/inspectors/edit";
import { InspectorCreate } from "./pages/inspectors/create";
import { InspectorShow } from "./pages/inspectors/show";
import { ablyClient } from "./utils/ablyClient";
import { liveProvider } from "@refinedev/ably";
import { ItemCreate, ItemEdit, ItemsList, ItemsShow } from "./pages/item";
import { PlantCreate, PlantEdit, PlantsList, PlantsShow } from "./pages/plant";
import {
  PesticidesCreate,
  PesticidesEdit,
  PesticideShow,
  PesticidesList,
} from "./pages/pesticides";
import { YieldCreate, YieldEdit, YieldsList, YieldsShow } from "./pages/yields";
interface TitleHandlerOptions {
  resource?: IResourceItem;
}

const customTitleHandler = ({ resource }: TitleHandlerOptions): string => {
  const baseTitle = "BFarm";
  const titleSegment = resource?.meta?.label;

  const title = titleSegment ? `${titleSegment} | ${baseTitle}` : baseTitle;
  return title;
};

const App: React.FC = () => {
  // This hook is used to automatically login the user.
  const { loading } = useAutoLoginForDemo();

  const API_URL = import.meta.env.VITE_API_URL || "https://api.outfit4rent.online/api";

  const appDataProvider = dataProvider(API_URL);

  const { t, i18n } = useTranslation();
  interface TranslationParams {
    [key: string]: string | number;
  }

  const i18nProvider = {
    translate: (key: string, params?: TranslationParams) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  if (loading) {
    return null;
  }

  return (
    <BrowserRouter>
      <ConfigProvider theme={themeConfig}>
        <AntdApp>
          <RefineKbarProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={appDataProvider}
              authProvider={authProvider}
              i18nProvider={i18nProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                liveMode: "auto",
              }}
              // notificationProvider={useNotificationProvider}
              // liveProvider={liveProvider(ablyClient)}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: {
                    label: "Dashboard",
                    icon: <DashboardOutlined />,
                  },
                },
                {
                  name: "device",
                  list: "/device",
                  create: "/device/create",
                  edit: "/device/edit/:id",
                  show: "/device/show/:id",
                  meta: {
                    label: "Device",
                    icon: <HddOutlined />,
                  },
                },
                {
                  name: "inspector",
                  list: "/inspectors",
                  create: "/inspectors/create",
                  edit: "/inspectors/edit/:id",
                  show: "/inspectors/:id",
                  meta: {
                    parent: "employees",
                    label: "Inspector",
                  },
                },
                {
                  name: "inspecting-forms",
                  list: "/inspecting-forms",
                  create: "/inspecting-forms/create",
                  edit: "/inspecting-forms/edit/:id",
                  show: "/inspecting-forms/show/:id",
                  meta: {
                    label: "Inspecting Forms",
                    icon: <ScheduleOutlined />,
                  },
                },
                {
                  name: "yield",
                  list: "/yield",
                  create: "/yield/create",
                  edit: "/yield/edit/:id",
                  show: "/yield/show/:id",
                  meta: {
                    label: "Yields",
                    icon: <EnvironmentOutlined />,
                  },
                },
                {
                  name: "plants",
                  list: "/plants",
                  create: "/plants/create",
                  edit: "/plants/edit/:id",
                  show: "/plants/:id",
                  meta: {
                    label: "Plants",
                    icon: <EnvironmentOutlined />,
                  },
                },
                {
                  name: "material",
                  meta: {
                    label: "Material",
                    icon: <GoldOutlined />,
                  },
                },
                {
                  name: "fertilizers",
                  list: "/fertilizers",
                  create: "/fertilizers/create",
                  edit: "/fertilizers/edit/:id",
                  show: "/fertilizers/:id",
                  meta: { parent: "material", canDelete: true },
                },
                {
                  name: "items",
                  list: "/items",
                  create: "/items/create",
                  edit: "/items/edit/:id",
                  show: "/items/:id",
                  meta: { parent: "material", canDelete: true },
                },
                {
                  name: "pesticides",
                  list: "/pesticides",
                  create: "/pesticides/create",
                  edit: "/pesticides/edit/:id",
                  show: "/pesticides/:id",
                  meta: { parent: "material", canDelete: true },
                },
                {
                  name: "employees",
                  meta: {
                    label: "Employees",
                    icon: <GoldOutlined />,
                  },
                },
                {
                  name: "farmers",
                  list: "/farmers",
                  create: "/farmers/create",
                  edit: "/farmers/edit/:id",
                  show: "/farmers/:id",
                  meta: { parent: "employees", canDelete: true },
                },
                {
                  name: "experts",
                  list: "/experts",
                  create: "/experts/create",
                  edit: "/experts/edit/:id",
                  show: "/experts/:id",
                  meta: { parent: "employees", canDelete: true },
                },
                {
                  name: "plans",
                  list: "/plans",
                  create: "/plans/create",
                  show: "/plans/:id",
                  meta: {
                    label: "Plans",
                    icon: <CalendarOutlined />,
                    route: "/plans",
                  },
                },
                {
                  name: "problems",
                  list: "/problems",
                  show: "/problems/:id",
                  meta: {
                    label: "Vấn đề",
                    icon: <WarningOutlined />,
                    route: "/problems",
                  },
                },
                {
                  name: "new-task",
                  list: "/",
                  meta: {
                    label: "New Task",
                    icon: <ScheduleOutlined />,
                  },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-routes"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayoutV2
                        Sider={() => <ThemedSiderV2 Title={Title} fixed />}
                        Header={() => <Header sticky />}
                      >
                        <div
                          style={{
                            maxWidth: "1600px",
                            marginLeft: "auto",
                            marginRight: "auto",
                          }}
                        >
                          <Outlet />
                        </div>
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="/plans">
                    <Route index element={<PlanList />} />
                    <Route path=":id">
                      <Route
                        index
                        element={
                          <PlanShow>
                            <Outlet></Outlet>
                          </PlanShow>
                        }
                      />
                      <Route path="approve" element={<ApprovingPlanDrawer />}></Route>
                      <Route
                        path="problems"
                        element={
                          <ShowProblemList>
                            <Outlet />
                          </ShowProblemList>
                        }
                      >
                        <Route path=":id" element={<ProblemShowV2 />}></Route>
                      </Route>

                      <Route
                        path="caring-tasks"
                        element={
                          <ShowTasksList>
                            <Outlet />
                          </ShowTasksList>
                        }
                      >
                        <Route path=":taskId" element={<ProductiveTaskShow />} />
                      </Route>
                      <Route path="caring-tasks/create" element={<CaringCreate />}></Route>
                      <Route path="caring-tasks/:taskId/edit" element={<CaringUpdate />}></Route>
                      <Route
                        path="harvesting-tasks"
                        element={
                          <ShowTasksList>
                            <Outlet></Outlet>
                          </ShowTasksList>
                        }
                      >
                        <Route path=":taskId" element={<HarvestingTaskShow />} />
                      </Route>
                      <Route
                        path="packaging-tasks"
                        element={
                          <ShowTasksList>
                            <Outlet />
                          </ShowTasksList>
                        }
                      >
                        <Route path=":taskId" element={<PackagingTaskShow />} />
                      </Route>
                    </Route>
                  </Route>
                  <Route
                    path="/yield"
                    element={
                      <YieldsList>
                        <Outlet />
                      </YieldsList>
                    }
                  >
                    <Route path="create" element={<YieldCreate />} />
                    <Route path="edit/:id" element={<YieldEdit />} />
                    <Route path="show/:id" element={<YieldsShow />} />
                  </Route>
                  <Route
                    path="/pesticides"
                    element={
                      <PesticidesList>
                        <Outlet />
                      </PesticidesList>
                    }
                  >
                    <Route path="create" element={<PesticidesCreate />} />
                    <Route path=":id" element={<PesticideShow />} />
                    <Route path="edit/:id" element={<PesticidesEdit />} />
                  </Route>
                  <Route
                    path="/problems"
                    element={
                      <ProblemListInProblems>
                        <Outlet></Outlet>
                      </ProblemListInProblems>
                    }
                  >
                    <Route path=":id" element={<ProblemShowV2 />} />
                  </Route>
                  <Route
                    path="/customers"
                    element={
                      <CustomerList>
                        <Outlet />
                      </CustomerList>
                    }
                  >
                    <Route path=":id" element={<CustomerShow />} />
                  </Route>

                  <Route
                    path="/plants"
                    element={
                      <PlantsList>
                        <Outlet />
                      </PlantsList>
                    }
                  >
                    <Route path="create" element={<PlantCreate />} />
                    <Route path=":id" element={<PlantsShow />} />
                    <Route path="edit/:id" element={<PlantEdit />} />
                  </Route>

                  <Route
                    path="/items"
                    element={
                      <ItemsList>
                        <Outlet />
                      </ItemsList>
                    }
                  >
                    <Route path="create" element={<ItemCreate />} />
                    <Route path=":id" element={<ItemsShow />} />
                    <Route path="edit/:id" element={<ItemEdit />} />
                  </Route>

                  <Route path="/device" element={<DeviceList />}>
                    <Route path=":id" element={<FarmerManagementShow />} />
                    <Route path="new" element={<FarmerManagementCreate />} />
                    <Route path=":id/edit" element={<FarmerManagementEdit />} />
                  </Route>

                  <Route
                    path="/fertilizers"
                    element={
                      <FertilizersList>
                        <Outlet />
                      </FertilizersList>
                    }
                  >
                    <Route path="create" element={<FertilizersCreate />} />
                    <Route path=":id" element={<FertilizersShow />} />
                    <Route path="edit/:id" element={<FertilizersEdit />} />
                  </Route>
                  <Route
                    path="/farmers"
                    element={
                      <FarmerList>
                        <Outlet />
                      </FarmerList>
                    }
                  >
                    <Route path=":id" element={<FarmersShow />} />
                    <Route path="create" element={<FarmerCreate />} />
                    <Route path="edit/:id" element={<FarmerEdit />} />
                  </Route>
                  <Route
                    path="/experts"
                    element={
                      <ExpertList>
                        <Outlet />
                      </ExpertList>
                    }
                  >
                    <Route path=":id" element={<ExpertShow />} />
                    <Route path="create" element={<ExpertCreate />} />
                    <Route path="edit/:id" element={<ExpertEdit />} />
                  </Route>

                  <Route
                    path="/inspectors"
                    element={
                      <InspectorList>
                        <Outlet />
                      </InspectorList>
                    }
                  >
                    <Route path=":id" element={<InspectorShow />} />
                    <Route path="create" element={<InspectorCreate />} />
                    <Route path="edit/:id" element={<InspectorEdit />} />
                  </Route>
                </Route>

                <Route
                  element={
                    <Authenticated key="auth-pages" fallback={<Outlet />}>
                      <NavigateToResource resource="dashboard" />
                    </Authenticated>
                  }
                >
                  <Route
                    path="/login"
                    element={
                      <AuthPage
                        type="login"
                        formProps={{
                          initialValues: {
                            email: "farmowner@gmail.com",
                            password: "1@",
                          },
                        }}
                      />
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <AuthPage
                        hideForm={true}
                        type="register"
                        formProps={{
                          initialValues: {
                            email: "farmowner@gmail.com",
                            password: "1@",
                          },
                        }}
                      />
                    }
                  />
                  <Route path="/forgot-password" element={<AuthPage type="forgotPassword" />} />
                  <Route path="/update-password" element={<AuthPage type="updatePassword" />} />
                </Route>

                <Route
                  element={
                    <Authenticated key="catch-all">
                      <ThemedLayoutV2
                        Sider={() => <ThemedSiderV2 Title={Title} fixed />}
                        Header={() => <Header sticky />}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
              </Routes>
              <UnsavedChangesNotifier />
              <DocumentTitleHandler handler={customTitleHandler} />
              <RefineKbar />
            </Refine>
          </RefineKbarProvider>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
