/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// Address and profile types
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

export type NotificationPreference = "email" | "sms" | "both";

export interface ProfileInput {
  name: string;
  phone: string;
  email: string;
  password: string;
  notificationPreference: NotificationPreference;
  address: Address;
  householdMembers: number; // 0 for none
  hasPets: boolean;
  laundryInUnit: boolean;
  hasDishwasher: boolean;
  evacuationPlanImageDataUrl?: string | null;
  propertyDetails?: PropertyDetails;
}

export interface PropertyDetails {
  bedrooms?: number | null;
  bathrooms?: number | null;
  source: "attom" | "mock" | "manual";
  raw?: unknown;
}

export interface AttomLookupRequest {
  address: Address;
}

export interface AttomLookupResponse {
  ok: boolean;
  details: PropertyDetails | null;
  error?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  cadence: string; // e.g., "Monthly", "Quarterly"
  nextDueDateISO: string;
  relatedTo?: "laundry" | "dishwasher" | "pets" | "general";
}

export interface RemindersResponse {
  reminders: ReminderItem[];
}
