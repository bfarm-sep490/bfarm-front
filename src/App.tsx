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
  ProductOutlined,
  ScheduleOutlined,
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
import { HarvestingCreate } from "./pages/plans/tasks/harvesting-create";
import { HarvestingUpdate } from "./pages/plans/tasks/harvesting-update";
import { PackagingUpdate } from "./pages/plans/tasks/packaging-update";
import { PackagingCreate } from "./pages/plans/tasks/packaging-create";

import { InspectionEdit, InspectionsList, InspectionShow } from "./pages/inspections";
import {
  AddFarmerIntoPlanModal,
  DeleteFarmerInPlanModal,
  FarmerListInPlan,
} from "./pages/plans/farmers/list";
import { ShowProductList } from "./pages/plans/production";
import { OrdersList } from "./pages/orders/list";
import { OrderShow } from "./pages/orders/show";
import { AssignedOrder } from "./pages/plans/assigned-order";
import { CancelOrderModal, CompleteOrderModal } from "./components/orders/complete-modal";
import { OrderComplete } from "./pages/orders/complete";
import { PackagedProductListPage } from "./pages/packaging-production/list";
import { HarvestingProductionListPage } from "./pages/harvesting-production/list";
import { PackagingProductShow } from "./components/production/packaging/drawer-show";
import { HarvestingProductShow } from "./components/production/harvesting/drawer-show";

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
                  name: "orders",
                  list: "/orders",
                  create: "/orders/create",
                  edit: "/orders/edit/:id",
                  show: "/orders/:orderId",
                  meta: {
                    label: "Đơn hàng",
                  },
                },
                {
                  name: "products",
                  meta: {
                    label: "Sản phẩm",
                    icon: <ProductOutlined />,
                  },
                },
                {
                  name: "harvesting-products",
                  list: "/harvesting-products",
                  show: "/harvesting-products/:id",
                  meta: {
                    label: "Thu hoạch",
                    parent: "products",
                    canDelete: true,
                  },
                },
                {
                  name: "packaging-products",
                  list: "/packaging-products",
                  show: "/packaging-products/:id",
                  meta: {
                    label: "Đóng gói",
                    parent: "products",
                    canDelete: true,
                  },
                },
                {
                  name: "plans",
                  list: "/plans",
                  create: "/plans/create",
                  show: "/plans/:id",
                  meta: {
                    label: "Kế hoạch",
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
                  name: "inspections",
                  list: "/inspections", // Added missing route
                  meta: {
                    label: "Kiểm định",
                    icon: <ScheduleOutlined />,
                  },
                },
                {
                  name: "inspection-forms",
                  list: "/inspection-forms",
                  edit: "/inspection-forms/edit/:id",
                  show: "/inspection-forms/show/:id",
                  meta: {
                    parent: "inspections",
                    label: "Đơn kiểm định",
                    canDelete: true,
                  },
                },
                {
                  name: "inspectors",
                  list: "/inspectors",
                  create: "/inspectors/create",
                  edit: "/inspectors/edit/:id",
                  show: "/inspectors/:id",
                  meta: {
                    parent: "inspections",
                    label: "Nhà kiểm định",
                    canDelete: true,
                  },
                },
                {
                  name: "material",
                  meta: {
                    label: "Nguyên liệu",
                    icon: <GoldOutlined />,
                  },
                },
                {
                  name: "fertilizers",
                  list: "/fertilizers",
                  create: "/fertilizers/create",
                  edit: "/fertilizers/edit/:id",
                  show: "/fertilizers/:id",
                  meta: {
                    label: "Phân bón",
                    parent: "material",
                    canDelete: true,
                  },
                },
                {
                  name: "pesticides",
                  list: "/pesticides",
                  create: "/pesticides/create",
                  edit: "/pesticides/edit/:id",
                  show: "/pesticides/:id",
                  meta: {
                    label: "Thuốc trừ sâu",
                    parent: "material",
                    canDelete: true,
                  },
                },
                {
                  name: "items",
                  list: "/items",
                  create: "/items/create",
                  edit: "/items/edit/:id",
                  show: "/items/:id",
                  meta: {
                    label: "Vật tư",
                    parent: "material",
                    canDelete: true,
                  },
                },
                {
                  name: "plants",
                  list: "/plants",
                  create: "/plants/create",
                  edit: "/plants/edit/:id",
                  show: "/plants/:id",
                  meta: {
                    label: "Cây trồng",
                    icon: <EnvironmentOutlined />,
                  },
                },
                {
                  name: "yield",
                  list: "/yield",
                  create: "/yield/create",
                  edit: "/yield/edit/:id",
                  show: "/yield/show/:id",
                  meta: {
                    label: "Khu đất",
                    icon: <GoldOutlined />,
                  },
                },
                {
                  name: "employees",
                  meta: {
                    label: "Nhân sự",
                    icon: <UserOutlined />,
                  },
                },
                {
                  name: "farmers",
                  list: "/farmers",
                  create: "/farmers/create",
                  edit: "/farmers/edit/:id",
                  show: "/farmers/:id",
                  meta: {
                    label: "Nông dân",
                    parent: "employees",
                    canDelete: true,
                  },
                },
                {
                  name: "experts",
                  list: "/experts",
                  create: "/experts/create",
                  edit: "/experts/edit/:id",
                  show: "/experts/:id",
                  meta: {
                    label: "Chuyên gia",
                    parent: "employees",
                    canDelete: true,
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
                  <Route
                    path="harvesting-products"
                    element={
                      <HarvestingProductionListPage>
                        <Outlet></Outlet>
                      </HarvestingProductionListPage>
                    }
                  >
                    <Route
                      path=":productId"
                      element={<HarvestingProductShow></HarvestingProductShow>}
                    ></Route>
                  </Route>
                  <Route
                    path="packaging-products"
                    element={
                      <PackagedProductListPage>
                        <Outlet></Outlet>
                      </PackagedProductListPage>
                    }
                  >
                    <Route
                      path=":productId"
                      element={<PackagingProductShow></PackagingProductShow>}
                    ></Route>
                  </Route>
                  <Route path="/plans">
                    <Route index element={<PlanList />} />
                    <Route path=":id/approve" element={<ApprovingPlanDrawer />}></Route>
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
                        path="farmers"
                        element={
                          <FarmerListInPlan>
                            <Outlet />
                          </FarmerListInPlan>
                        }
                      >
                        <Route path="create" element={<AddFarmerIntoPlanModal />} />
                        <Route path=":farmer_id/delete" element={<DeleteFarmerInPlanModal />} />
                      </Route>
                      <Route path="harvesting-products" element={<ShowProductList />}></Route>
                      <Route path="packaged-products" element={<ShowProductList />}></Route>

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
                        path="orders"
                        element={
                          <OrdersList>
                            <Outlet />
                          </OrdersList>
                        }
                      >
                        <Route path="create" element={<AssignedOrder />} />

                        <Route
                          path=":orderId"
                          element={
                            <OrderShow>
                              <Outlet />
                            </OrderShow>
                          }
                        >
                          <Route path="cancel" element={<CancelOrderModal />} />
                        </Route>
                      </Route>
                      <Route
                        path="inspecting-tasks"
                        element={
                          <ShowTasksList>
                            <Outlet />
                          </ShowTasksList>
                        }
                      ></Route>
                      <Route
                        path="caring-tasks"
                        element={
                          <ShowTasksList>
                            <Outlet />
                          </ShowTasksList>
                        }
                      ></Route>
                      <Route path="caring-tasks/:taskId" element={<ProductiveTaskShow />}></Route>
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
                      <Route path="harvesting-tasks/create" element={<HarvestingCreate />}></Route>
                      <Route
                        path="harvesting-tasks/:taskId/edit"
                        element={<HarvestingUpdate />}
                      ></Route>
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
                      <Route path="packaging-tasks/create" element={<PackagingCreate />}></Route>
                      <Route
                        path="packaging-tasks/:taskId/edit"
                        element={<PackagingUpdate />}
                      ></Route>
                    </Route>
                  </Route>
                  <Route
                    path="/orders"
                    element={
                      <OrdersList>
                        <Outlet />
                      </OrdersList>
                    }
                  >
                    <Route
                      path=":orderId"
                      element={
                        <OrderShow>
                          <Outlet />
                        </OrderShow>
                      }
                    >
                      <Route path="cancel" element={<CancelOrderModal />} />
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

                  <Route path="/inspection-forms" element={<InspectionsList />} />
                  <Route path="/inspection-forms/:id" element={<InspectionShow />} />
                  <Route path="/inspection-forms/edit/:id" element={<InspectionEdit />} />

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
