import React from "react";
import { Authenticated, IResourceItem, Refine } from "@refinedev/core";
import { RefineKbarProvider, RefineKbar } from "@refinedev/kbar";
import { ThemedLayoutV2, ErrorComponent } from "@refinedev/antd";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import {
  CalendarOutlined,
  CarOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  GoldOutlined,
  HddOutlined,
  SearchOutlined,
  UserOutlined,
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
import { ApprovalingPlanDrawer } from "./pages/plans/approvaled-drawer";
import { ProblemShowV2 } from "./pages/problems/show";
import { ProductiveTaskShow } from "./components/caring-task/show";
import { HarvestingTaskShow } from "./components/harvesting-task/show";
import { PackagingTaskShow } from "./components/packaging-task/show";
import { ProblemListInProblems } from "./pages/problems/list";
import { CaringCreate } from "./pages/plans/tasks/caring-create";
import { CaringUpdate } from "./pages/plans/tasks/caring-update";
import { dataProvider } from "./rest-data-provider";
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
import { ItemCreate, ItemEdit, ItemsList, ItemsShow } from "./pages/item";
import { SeedCreate, SeedEdit, SeedsList, SeedsShow } from "./pages/seed";
import { YieldCreate, YieldEdit, YieldsList, YieldsShow } from "./pages/land-managements";
import { PesticidesCreate, PesticideShow, PesticidesList, PesticidesEdit } from "./pages/pesticides";
import Logout from "./pages/auth/Logout";

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

  const API_URL =
    import.meta.env.VITE_API_URL || "https://api.outfit4rent.online/api";

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
        <RefineKbarProvider>
          <Refine
            routerProvider={routerProvider}
            dataProvider={appDataProvider}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              liveMode: "off",
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
                  label: "Inspection",
                  icon: <SearchOutlined />,
                },
              },
              {
                name: "inspection",
                list: "/inspection",
                create: "/inspection/create",
                edit: "/inspection/edit/:id",
                show: "/inspection/show/:id",
                meta: {
                  label: "Inspection",
                  icon: <SearchOutlined />,
                },
              },
              {
                name: "yield",
                list: "/yield",
                create: "/yield/create",
                edit: "/yield/edit/:id",
                show: "/yield/show/:id",
                meta: {
                  label: "Yield Management",
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
                name: "fertilizer",
                list: "/fertilizer",
                create: "/fertilizer/new",
                edit: "/fertilizer/edit/:id",
                show: "/fertilizer/:id",
                meta: { parent: "material", canDelete: true },
              },
              {
                name: "pesticide",
                list: "/pesticide",
                create: "/pesticide/new",
                edit: "/pesticide/edit/:id",
                show: "/pesticide/:id",
                meta: { parent: "material", canDelete: true },
              },
              {
                name: "item",
                list: "/items",
                create: "/items/new",
                edit: "/items/edit/:id",
                show: "/items/:id",
                meta: { parent: "material", canDelete: true },
              },
              {
                name: "seed",
                list: "/seeds",
                create: "/seeds/new",
                edit: "/seeds/edit/:id",
                show: "/seeds/:id",
                meta: { parent: "material", canDelete: true },
              },
              {
                name: "pesticide",
                list: "/pesticide",
                create: "/pesticide/create",
                edit: "/pesticide/edit/:id",
                show: "/pesticide/show/:id",
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
                show: "/farmers/show/:id",
                meta: { parent: "employees", canDelete: true },
              },
              {
                name: "experts",
                list: "/experts",
                create: "/experts/create",
                edit: "/experts/edit/:id",
                show: "/experts/show/:id",
                meta: { parent: "employees", canDelete: true },
              },
              {
                name: "drivers",
                list: "/drivers",
                create: "/drivers/create",
                edit: "/drivers/edit/:id",
                show: "/drivers/show/:id",
                meta: { parent: "employees", canDelete: true },
              },
              {
                name: "season-management",
                list: "/season-management",
                create: "/season-management/create",
                edit: "/season-management/edit/:id",
                show: "/season-management/show/:id",
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
                  label: "Công việc mới",
                },
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="dashboard" />}
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
                    <Route
                      path="approve"
                      element={<ApprovalingPlanDrawer />}
                    ></Route>
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
                    <Route
                      path="caring-tasks/create"
                      element={<CaringCreate />}
                    ></Route>
                    <Route
                      path="caring-tasks/:taskId/edit"
                      element={<CaringUpdate />}
                    ></Route>
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

                <Route path="/device" element={<DeviceList />}>
                  <Route path=":id" element={<FarmerManagementShow />} />
                  <Route path="new" element={<FarmerManagementCreate />} />
                  <Route path=":id/edit" element={<FarmerManagementEdit />} />
                </Route>

                <Route path="/yield/*" element={<YieldsList />}>
                  <Route path="create" element={<YieldCreate />} />
                  <Route path="edit/:id" element={<YieldEdit />} />
                  <Route path="show/:id" element={<YieldsShow />} />
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


                <Route
                  path="/seeds"
                  element={
                    <SeedsList>
                      <Outlet />
                    </SeedsList>
                  }
                >
                  <Route path="new" element={<SeedCreate />} />
                  <Route path=":id" element={<SeedsShow />} />
                  <Route path="edit/:id" element={<SeedEdit />} />
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
                          email: "",
                          password: "",
                          
                        },
                      }}
                    />
                  }
                />
                <Route
                  path="/register"
                  element={
                    <AuthPage
                      type="register"
                      formProps={{
                        initialValues: {
                          email: "demo@bfarm.dev",
                          password: "demodemo",
                        },
                      }}
                    />
                  }
                />
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
                <Route
                  path="/update-password"
                  element={<AuthPage type="updatePassword" />}
                />
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
      </ConfigProvider>
    </BrowserRouter >
  );
};

export default App;
