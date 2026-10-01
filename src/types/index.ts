export type UserRole = 'super_admin' | 'admin' | 'tenant';

export interface UserProfile {
  id: string;
  uid: string;
  email: string;
  fullname: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  assignedHouseNo?: number | null;
  createdAt: string;
}

export type PropertyStatus = 'available' | 'occupied' | 'maintenance';

export interface Property {
  id: string;
  house_no: number;
  title: string;
  fulladdress: string;
  noRoom: number;
  noBathroom: number;
  noFloor: number;
  rent: number;
  status: PropertyStatus;
  images: string[];
  featuredImage: string;
  description: string;
  amenities: string[];
  squareMeters?: number;
  currentTenantId?: string | null;
  currentTenantName?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Tenant {
  id: string;
  house_no: number;
  fullname: string;
  email: string;
  contact: string;
  occupants: number;
  deposit: number;
  startDate: string; // ISO String
  leaseEndDate?: string;
  monthPaid: number;
  balance: number;
  credits: number;
  status: 'active' | 'terminated';
  avatarUrl?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  createdAt: string;
}

export interface FormerTenant {
  id: string;
  house_no: number;
  fullname: string;
  startDate: string;
  endDate: string;
  totalPaid: number;
  depositReturned: number;
  terminationReason?: string;
}

export type PaymentMethod = 'Cash' | 'GCash' | 'Maya' | 'Bank Transfer' | '*deposit' | '*adjust';
export type PaymentStatus = 'completed' | 'pending' | 'failed';

export interface PaymentTransaction {
  id: string;
  transaction_id?: number;
  house_no: number;
  fullname: string;
  tenantId?: string;
  MOP: PaymentMethod;
  amount: number;
  datePaid: string; // ISO date
  billingMonth?: string; // e.g. "October 2026"
  receiptNumber: string;
  notes?: string;
  status: PaymentStatus;
  proofImageUrl?: string;
  recordedBy?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  house_no: number;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string; // ISO string
  read: boolean;
  attachmentUrl?: string;
}

export interface ChatSession {
  id: string;
  house_no: number;
  tenantId: string;
  tenantName: string;
  tenantAvatar?: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  ownerUnreadCount: number;
  tenantUnreadCount: number;
}

export interface MaintenanceRequest {
  id: string;
  house_no: number;
  tenantId: string;
  tenantName: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved';
  photoUrls?: string[];
  createdAt: string;
  updatedAt?: string;
  cost?: number;
}

export interface DashboardMetrics {
  totalUnits: number;
  rentedUnits: number;
  availableUnits: number;
  maintenanceUnits: number;
  totalOccupants: number;
  monthlyEarnings: number;
  pendingDueDates: number;
  occupancyRate: number;
  collectionRate: number;
}
