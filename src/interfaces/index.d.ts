import type { Dayjs } from "dayjs";

export interface IIdentity {
  id: number;
  name: string;
  avatar: string;
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
export interface IUserFilterVariables {
  q: string;
  status: boolean;
  createdAt: [Dayjs, Dayjs];
  gender: string;
  isActive: boolean;
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
export interface IFarmerPermission {
  id: number;
  farmer_id: number;
  plan_id: number;
  is_active: boolean;
}

export interface IPlan {
  id: number;
  plant_id: number;
  yield_id: number;
  expert_id: number;
  plan_name: string;
  description: string;
  started_date: string;
  ended_date: string;
  completed_date?: string;
  status: "Draft" | "Pending" | "Ongoing" | "Completed" | "Cancelled";
  estimated_product: number;
  estimated_unit: string;
  created_by: string;
  created_at: string;
  updated_by?: string;
  updated_at?: string;
}

export interface IHarvestingTask {
  task_id: number;
  plan_id: number;
  task_name: string;
  description: string;
  start_date: string;
  end_date: string;
  result_content?: string;
  complete_date?: string;
  quantity_harvested?: number;
  unit_harvested?: string;
  status: "Draft" | "Pending" | "Ongoing" | "Completed";
  farmer_id: number;
  created_at: string;
  updated_at: string;
  priority?: number;
}

export interface IIssue {
  id: number;
  name_issue: string;
  description: string;
  is_actived: boolean;
}

export interface ICaringTask {
  task_id: number;
  plan_id: number;
  problem_id?: number;
  task_name: string;
  result_content?: string;
  task_type: "Planting" | "Nurturing" | "Watering" | "Fertilizing" | "PestControl";
  start_date: string;
  end_date: string;
  complete_date?: string;
  farmer_id: number;
  status: "Draft" | "Pending" | "Ongoing" | "Completed";
  created_at: string;
  updated_at: string;
  priority?: number;
}

export interface IItem {
  id: number;
  name: string;
  description: string;
  image: string;
  quantity: number;
  status: "Active" | "In-stock" | "OutStock";
  type: "Caring" | "Harvesting" | "Packaging";
}

export interface IAccount {
  id: number;
  email: string;
  role: "Owner" | "Farmer" | "Expert" | "Driver" | "Retailer";
  created_at: string;
  password: string;
  is_active: boolean;
}

export interface IInspector {
  id: number;
  account_id: number;
  address: string;
  name: string;
  image_url: string;
  description: string;
  status: string;
}

export interface IOrder {
  id: number;
  order_id: number;
  price: number;
  status: "paid" | "cancelled" | "pending" | "failed";
  address: string;
  created_at: string;
  is_payed: boolean;
}

export interface IYield {
  id: number;
  yield_name: string;
  area_unit: string;
  area: number;
  type: string;
  description: string;
  size: string;
  is_available: boolean;
}

export interface IDevice {
  id: number;
  yield_id: number;
  device_name: string;
  device_type: string;
  location: string;
  status: "Active" | "InActive" | "Error";
  device_code: string;
  installation_date: string;
  created_at: string;
  created_by: string;
  updated_at?: string;
  updated_by?: string;
}

export interface IPlant {
  id: number;
  plant_name: string;
  quantity: number;
  unit: string;
  description: string;
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
  gt_test_kit_color: string;
  image_url: string;
}

export interface IOrderPlan {
  url: string;
  quantity: number;
  order_id: number;
  plan_id: number;
  unit: string;
}

export interface IProductionImage {
  image_id: number;
  task_id: number;
  url: string;
}

export interface IInspectingForm {
  id: number;
  plan_id: number;
  plan_name: string;
  inspector_id: number;
  inspector_name: string;
  task_name: string;
  task_type: string;
  description: string;
  start_date: string;
  end_date: string;
  result_content?: string;
  number_of_sample?: number | null;
  sample_weight?: number | null;
  can_harvest: boolean;
  complete_date?: string;
  status: "Draft" | "Pending" | "Ongoing" | "Completed" | "Cancel";
  created_at: string;
  created_by: string;
  updated_at?: string | null;
  updated_by?: string | null;
  evaluated_result: "Grade 1" | "Grade 2" | "Grade 3";
  inspecting_results: InspectingResult;
}
export interface IInspectingResult {
  id: number;
  arsen: number;
  plumbum: number;
  cadmi: number;
  hydrargyrum: number;
  salmonella: number;
  coliforms: number;
  ecoli: number;
  glyphosate_glufosinate: number;
  sulfur_dioxide: number;
  methyl_bromide: number;
  hydrogen_phosphide: number;
  dithiocarbamate: number;
  nitrat: number;
  nano3_kno3: number;
  chlorate: number;
  perchlorate: number;
  evaluated_result: "Grade 1" | "Grade 2" | "Grade 3";
  result_content: string;
  inspect_images: string[];
}

export interface IPackagingTask {
  id: number;
  plan_id: number;
  task_name: string;
  complete_date?: string;
  packed_unit: string;
  packed_quantity: number;
  description: string;
  result_content: string;
  farmer_id: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  priority?: number;
}

export interface IPackagingItem {
  id: number;
  task_id: number;
  item_id: number;
  quantity: number;
  unit: string;
}

export interface IProblem {
  id: number;
  issue_id?: number;
  name: string;
  description: string;
  created_date: string;
  type_problem: string;
  status: "Pending" | "Approved" | "Cancelled";
  result: string;
}

export interface IPesticide {
  id: number;
  name: string;
  description: string;
  image: string;
  unit: string;
  available_quantity: number;
  total_quantity: number;
  quantity: number;
  status: "Available" | "Limited Stock" | "Out of Stock";
  type: "Organic" | "Chemical" | "Mineral" | "Other";
}

export interface IFertilizer {
  id: number;
  name: string;
  description: string;
  image: string;
  unit: string;
  quantity: number;
  available_quantity: number;
  total_quantity: number;
  status: "Available" | "Out of Stock" | "Limited Stock";
  type: "Organic" | "Chemical" | "Mineral";
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

export interface IPlant {
  id: number;
  plant_name: string;
  description: string;
  quantity: number;
  base_price: number;
  type: string;
  image_url: string;
  delta_one: number;
  delta_two: number;
  delta_three: number;
  preservation_day: number;
  estimated_per_one: number;
  status: "Active" | "Inactive";
}

export interface IYield {
  id: number;
  yield_name: string;
  area_unit: string;
  area: number;
  type: YieldType;
  description: string;
  status: "Available" | "Unavailable" | "In-Use";
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
