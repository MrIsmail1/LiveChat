import { LoginSchema } from "@/components/login/loginSchema";
import { RegisterSchema } from "@/components/register/registerSchema";
import { PasswordResetSchema } from "@/components/reset-password/passwordResetSchema";
import { denoHonoAPI, expressAPI } from "@/config/apiClient";

import { FleetSchema } from "@/components/fleet/fleetSchema";
import { DriverHistorical } from "@/types/DriverHistoricalResponses";
import { MotorbikeIncident } from "@/types/MotorbikeIncidentResponses";
import {
  PartPurchaseRequest,
  PartPurchaseResponse,
} from "@/types/PartPurchase";
import { SparePartRequest, SparePartResponse } from "@/types/SparePart";
import { Try } from "@/types/TryResponses";
import { LoginResponse, User } from "../types/AuthResponses";
import { Driver } from "../types/DriverResponses";
import { Fleet } from "../types/FleetResponses";
import { ModelMotorbike } from "../types/ModelMotorbikeResponses";
import { Motorbike } from "../types/MotorbikeResponses";
import { MaintenanceResponse } from "../types/MaintenanceResponses";
import { Warranty } from "../types/WarrantyReponses";
import { BreakdownResponse } from "../types/BreakdownResponses";

export const login = async (data: LoginSchema) =>
  expressAPI.post<LoginResponse>("/auth/login", data);

export const register = async (data: RegisterSchema) =>
  expressAPI.post<{ message: string }>("/auth/register", data);

export const verifyEmail = async (verificationCode: string) =>
  expressAPI.get<{ message: string }>(`/auth/email/verify/${verificationCode}`);

export const sendPasswordResetEmail = async (email: string) =>
  expressAPI.post<{ message: string }>("/auth/password/forgot", { email });

export const resetPassword = async (data: PasswordResetSchema) =>
  expressAPI.post<{ message: string }>("/auth/password/reset", data);

export const getUser = async (): Promise<User> =>
  await expressAPI.get<User, User>("/user/profile");

export const logout = () => expressAPI.get<{ message: string }>("/auth/logout");

export const usersList = async () =>
  expressAPI.get<User[], User[]>("/user/list");
export const updateUser = async (data: User) =>
  expressAPI.put<User, User>("/user/update", data);

// Fleet
export const fleetsList = async () =>
  expressAPI.get<Fleet[], Fleet[]>("/fleet/list");
export const fleetCreate = async (data: FleetSchema) =>
  expressAPI.post<{ message: string }>("/fleet/create", data);
export const fleetGetOne = async (fleetId: string) =>
  expressAPI.get<Fleet>(`/fleet/fleet/${fleetId}`);
export const fleetUpdate = async (fleetId: string, data: Fleet) =>
  expressAPI.put<Fleet>(`/fleet/update/${fleetId}`, data);
export const fleetDelete = async (fleetId: string) =>
  expressAPI.delete<{ message: string }>(`/fleet/delete/${fleetId}`);

// Model Motorbike
export const modelMotorbikesList = async () =>
  expressAPI.get<ModelMotorbike[], ModelMotorbike[]>("/modelmotorbike/list");
export const modelMotorbikeCreate = async (data: ModelMotorbike) =>
  expressAPI.post<{ message: string }>("/modelmotorbike/create", data);
export const modelMotorbikeGetOne = async (modelMotorbikeId: string) =>
  expressAPI.get<ModelMotorbike>(`/modelmotorbike/${modelMotorbikeId}`);
export const modelMotorbikeUpdate = async (
  modelMotorbikeId: string,
  data: ModelMotorbike
) =>
  expressAPI.put<ModelMotorbike>(
    `/modelmotorbike/update/${modelMotorbikeId}`,
    data
  );
export const modelMotorbikeDelete = async (modelMotorbikeId: string) =>
  expressAPI.delete<{ message: string }>(
    `/modelmotorbike/delete/${modelMotorbikeId}`
  );

// Motorbike
export const motorbikesList = async () =>
  expressAPI.get<Motorbike[], Motorbike[]>("/motorbike/list");
export const motorbikeCreate = async (data: Motorbike) =>
  expressAPI.post<{ message: string }>("/motorbike/create", data);
export const motorbikeGetOne = async (motorbikeId: string) =>
  expressAPI.get<Motorbike>(`/motorbike/motorbike/${motorbikeId}`);
export const motorbikeUpdate = async (motorbikeId: string, data: Motorbike) =>
  expressAPI.put<Motorbike>(`/motorbike/update/${motorbikeId}`, data);
export const motorbikeDelete = async (motorbikeId: string) =>
  expressAPI.delete<{ message: string }>(`/motorbike/delete/${motorbikeId}`);
export const motorbikesListByFleetId = async (fleetId: string) =>
  expressAPI.get<Motorbike[], Motorbike[]>(`/motorbike/listfleetId/${fleetId}`);

// Driver
export const driversList = async () => expressAPI.get<Driver[]>(`/driver/list`);
export const driverCreate = async (data: Driver) =>
  expressAPI.post<{ message: string }>("/driver/create", data);
export const driverUpdate = async (driverId: string, data: Driver) =>
  expressAPI.put<Driver>(`/driver/update/${driverId}`, data);
export const driverGetOne = async (driverId: string) =>
  expressAPI.get<Driver>(`/driver/driver/${driverId}`);
export const driverDelete = async (driverId: string) =>
  expressAPI.delete<{ message: string }>(`/driver/delete/${driverId}`);

// Historical Driver
export const driverHistoricalList = async (driverId: string) =>
  expressAPI.get<DriverHistorical[]>(`/driverhistorical/list/${driverId}`);
export const driverHistoricalDelete = async (driverHistoricalId: string) =>
  expressAPI.delete<{ message: string }>(
    `/driverhistorical/delete/${driverHistoricalId}`
  );

// Try
export const triesList = async () => expressAPI.get<Try[], Try[]>("/try/list");
export const tryCreate = async (data: Try) =>
  expressAPI.post<{ message: string }>("/try/create", data);
export const tryGetOne = async (tryId: string) =>
  expressAPI.get<Try>(`/try/${tryId}`);
export const tryUpdate = async (tryId: string, data: Try) =>
  expressAPI.put<Try>(`/try/update/${tryId}`, data);
export const tryDelete = async (tryId: string) =>
  expressAPI.delete<{ message: string }>(`/try/delete/${tryId}`);
export const triesListByDriverId = async (driverId: string) =>
  expressAPI.get<Try[], Try[]>(`/try/list/driver/${driverId}`);
export const triesListByMotorbikeId = async (motorbikeId: string) =>
  expressAPI.get<Try[], Try[]>(`/try/list/motorbike/${motorbikeId}`);

// Motorbike Incident
export const motorbikeIncidentsList = async () =>
  expressAPI.get<MotorbikeIncident[], MotorbikeIncident[]>(
    "/motorbikeincident/list"
  );
export const motorbikeIncidentCreate = async (data: MotorbikeIncident) =>
  expressAPI.post<{ message: string }>("/motorbikeincident/create", data);
export const motorbikeIncidentGetOne = async (incidentId: string) =>
  expressAPI.get<MotorbikeIncident>(`/motorbikeincident/${incidentId}`);
export const motorbikeIncidentUpdate = async (
  incidentId: string,
  data: MotorbikeIncident
) =>
  expressAPI.put<MotorbikeIncident>(
    `/motorbikeincident/update/${incidentId}`,
    data
  );
export const motorbikeIncidentDelete = async (incidentId: string) =>
  expressAPI.delete<{ message: string }>(
    `/motorbikeincident/delete/${incidentId}`
  );
export const motorbikeIncidentsListByDriverId = async (driverId: string) =>
  expressAPI.get<MotorbikeIncident[], MotorbikeIncident[]>(
    `/motorbikeincident/list/driver/${driverId}`
  );
export const motorbikeIncidentsListByMotorbikeId = async (
  motorbikeId: string
) =>
  expressAPI.get<MotorbikeIncident[], MotorbikeIncident[]>(
    `/motorbikeincident/list/motorbike/${motorbikeId}`
  );
export const motorbikeIncidentsListByCompanyOrDealerShipId = async (
  companyOrDealerShipId: string
) =>
  expressAPI.get<MotorbikeIncident[], MotorbikeIncident[]>(
    `/motorbikeincident/list/company/${companyOrDealerShipId}`
  );

// SparePart
export const sparePartsList = async (params?: {
  id?: string;
  name?: string;
  partNumber?: string;
  brand?: string;
  stockQuantity?: string;
  reorderThreshold?: string;
}) =>
  denoHonoAPI.get<SparePartResponse[], SparePartResponse[]>(
    "/spare-part/list",
    {
      params,
    }
  );
export const sparePartCreate = async (data: SparePartRequest) =>
  denoHonoAPI.post<{ message: string }>("/spare-part/create", data);
export const sparePartUpdate = async (data: SparePartRequest) =>
  denoHonoAPI.put<SparePartResponse>(
    `/spare-part/update/${data.indentifier}`,
    data
  );
export const sparePartDelete = async (identifier: string) =>
  denoHonoAPI.delete<{ message: string }>(`/spare-part/delete/${identifier}`);

// Purchase History
export const purchasePartHistoryList = async (params?: {
  id: string;
  partId?: string;
  status?: string;
  orderDate?: string;
  receivedDate?: string;
}) =>
  denoHonoAPI.get<PartPurchaseResponse[], PartPurchaseResponse[]>(
    "/part-purchase/list",
    { params }
  );

export const partPurchaseCreate = async (data: PartPurchaseRequest) =>
  denoHonoAPI.post<{ message: string }>("/part-purchase/create", data);
export const partPurchaseUpdate = async (data: PartPurchaseRequest) =>
  denoHonoAPI.put<PartPurchaseRequest>(
    `/part-purchase/receive-or-cancel/${data.identifier}`,
    data
  );

// Maintenance
export const maintenancesList = async () => expressAPI.get<MaintenanceResponse[], MaintenanceResponse[]>("/maintenance/list");
export const maintenanceCreate = async (data: MaintenanceResponse) => expressAPI.post<{ message: string }>("/maintenance/create", data);
export const maintenanceGetOne = async (maintenanceId: string) => expressAPI.get<MaintenanceResponse>(`/maintenance/${maintenanceId}`);
export const maintenanceUpdate = async (maintenanceId: string, data: MaintenanceResponse) => expressAPI.put<MaintenanceResponse>(`/maintenance/update/${maintenanceId}`, data);
export const maintenanceDelete = async (maintenanceId: string) => expressAPI.delete<{ message: string }>(`/maintenance/delete/${maintenanceId}`);


// Warranties
export const warrantiesList = async () => expressAPI.get<Warranty[], Warranty[]>("/warranty/list");
export const warrantyCreate = async (data: Warranty) => expressAPI.post<{ message: string }>("/warranty/create", data);
export const warrantyGetOne = async (warrantyId: string) => expressAPI.get<Warranty>(`/warranty/${warrantyId}`);
export const warrantyUpdate = async (warrantyId: string, data: Warranty) => expressAPI.put<Warranty>(`/warranty/update/${warrantyId}`, data);
export const warrantyDelete = async (warrantyId: string) => expressAPI.delete<{ message: string }>(`/warranty/delete/${warrantyId}`);

//Breakdowns
export const breakdownsList = async () => expressAPI.get<BreakdownResponse[], BreakdownResponse[]>("/breakdown/list");
export const breakdownCreate = async (data: BreakdownResponse) => expressAPI.post<{ message: string }>("/breakdown/create", data);
export const breakdownGetOne = async (breakdownId: string) => expressAPI.get<BreakdownResponse>(`/breakdown/${breakdownId}`);
export const breakdownUpdate = async (breakdownId: string, data: BreakdownResponse) => expressAPI.put<BreakdownResponse>(`/breakdown/update/${breakdownId}`, data);
export const breakdownDelete = async (breakdownId: string) => expressAPI.delete<{ message: string }>(`/breakdown/delete/${breakdownId}`);