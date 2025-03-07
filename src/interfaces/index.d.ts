import exp from "constants";
import type { Dayjs } from "dayjs";

export interface IOrderChart {
  count: number;
  status: "waiting" | "ready" | "on the way" | "delivered" | "could not be delivered";
}

export interface IOrderTotalCount {
  total: number;
  totalDelivered: number;
}

export interface ISalesChart {
  date: string;
  title?: "Order Count" | "Order Amount";
  value: number;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  gsm: string;
  createdAt: string;
  isActive: boolean;
  avatar: IFile[];
  addresses: IAddress[];
}

export interface IIdentity {
  id: number;
  name: string;
  avatar: string;
}

export interface IOrder {
  id: number;
  user: IUser;
  createdAt: string;
  products: IProduct[];
  status: IOrderStatus;
  adress: IAddress;
  store: IStore;
  courier: ICourier;
  events: IEvent[];
  orderNumber: number;
  amount: number;
}
export interface IUserFilterVariables {
  q: string;
  status: boolean;
  createdAt: [Dayjs, Dayjs];
  gender: string;
  isActive: boolean;
}

export interface ITrendingProducts {
  id: number;
  product: IProduct;
  orderCount: number;
}

export interface IProductivityOverTimeEntry {
  key: number;
  timestamp: string;
  value: number;
}
export interface IQuickStatsEntry {
  key: number;
  stat_name: string;
  value: number;
  description: string;
}

export interface ISeasonProgressEntry {
  key: number;
  timestamp: string;
  progress: number;
}

export type FertilizerStatus = "Available" | "Unavailable";
export type FertilizerType = "Đạm" | "Kali" | "Lân" | "Hữu cơ" | "Vi sinh";
export type ItemStatus = "Active" | "In-stock" | "Out-stock";
export type ItemType = "Caring" | "Harvesting" | "Packaging" | "Inspecting";
export type SeedTestKitColor = "Blue" | "Yellow" | "Red" | "Orange";
export type SeedAvailability = "Available" | "Unavailable";
export type YieldType =
  | "Lúa"
  | "Rau"
  | "Tổng hợp"
  | "Trái cây"
  | "Ngô"
  | "Khác";
export type YieldAvailability = "Available" | "Unavailable";
export type YieldSize = "Nhỏ" | "Vừa" | "Lớn";
export type PesticideStatus = "Available" | "UnAvailable" | "OutStock";
export type PesticideType =
  | "Trừ sâu"
  | "Trừ nấm"
  | "Diệt cỏ"
  | "Trừ rầy"
  | "Trừ bọ xít";
export type InspectorAvailability = "Available" | "Unavailable";
export type InspectingTaskStatus =
  | "pending"
  | "ongoing"
  | "completed"
  | "cancel";
export type InspectingTestKitColor = "Blue" | "Yellow" | "Red" | "Orange";
export interface IFertilizer {
  id: number;
  name: string;
  description: string;
  image: string;
  available_quantity: number;
  unit: string;
  total_quantity: number;
  status: FertilizerStatus;
  type: FertilizerType;
}

export type FarmerStatus = "Active" | "Inactive";
export type ExpertStatus = "Active" | "Inactive";

export interface IFarmer {
  id: number;
  name: string;
  phone: string;
  email: string;
  DOB: string;
  avatar: string;
  status: FarmerStatus;
}
export interface IExpert {
  id: number;
  name: string;
  phone: string;
  email: string;
  DOB: string;
  avatar: string;
  status: ExpertStatus;
}

export interface IProductiveTask {
  id: number;
  period_id: number;
  land_id: number;
  task_name: string;
  start_date: Date;
  end_date: Date;
  complete_date: Date;
  task_type: string;
  farmer_id: number;
  is_completed: boolean;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
  priority: number;
}


export interface IItem {
  id: number;
  name: string;
  description: string;
  image: string;
  status: ItemStatus;
  type: ItemType;
  quantity: number;
  unit: string;
}

export interface ISeed {
  id: number;
  plant_name: string;
  description: string;
  quantity: number;
  unit: string;
  is_available: boolean;
  min_temp: number;
  max_temp: number;
  min_humid: number;
  max_humid: number;
  min_moisture: number;
  max_moisture: number;
  min_fertilizer: number;
  max_fertilizer: number;
  fertilizer_unit: string;
  min_pesticide: number;
  max_pesticide: number;
  pesticide_unit: string;
  min_brix_point: number;
  max_brix_point: number;
  gt_test_kit_color: SeedTestKitColor;
  image_url: string;
}

export interface IYield {
  id: number;
  yield_name: string;
  area_unit: string;
  area: number;
  type: YieldType;
  description: string;
  is_available: YieldAvailability;
  size: YieldSize;
}

export interface IPesticide {
  id: number;
  name: string;
  description: string;
  unit: string;
  image: string;
  available_quantity: number;
  total_quantity: number;
  status: PesticideStatus;
  type: PesticideType;
}

export interface IInspector {
  id: number;
  accountID: string;
  address: string;
  name: string;
  imageUrl: string;
  description: string;
  isAvailable: InspectorAvailability;
}
export interface IInspectingTask {
  taskID: number;
  planID: number;
  taskName: string;
  taskType: string;
  description: string;
  startDate: Date;
  endDate: Date;
  resultContent: string;
  brixPoint?: number;
  temperature?: number;
  humidity?: number;
  moisture?: number;
  shellColor?: string;
  testGTKitColor?: InspectingTestKitColor;
  inspectingQuantity: number;
  unit: string;
  issuePercent: number;
  canHarvest: boolean;
  completedDate?: Date;
  inspectorID: number;
  status: InspectingTaskStatus;
  createdAt: Date;
  updatedAt: Date;
}
