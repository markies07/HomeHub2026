import { Property, Tenant, PaymentTransaction, ChatMessage, ChatSession, UserProfile, DashboardMetrics } from "@/types";

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    house_no: 101,
    title: "The Emerald Penthouse Suite",
    fulladdress: "Unit 101, HomeHub Residences, Acacia Ave., Cavite",
    noRoom: 3,
    noBathroom: 2,
    noFloor: 2,
    rent: 28500,
    status: "occupied",
    squareMeters: 88,
    description: "Spacious bi-level penthouse featuring panoramic city views, high ceilings, custom hardwood flooring, modern kitchen quartz countertops, and dedicated parking.",
    amenities: ["High-speed WiFi", "Air Conditioning", "Balcony", "Covered Parking", "Pet Friendly", "24/7 Security CCTV", "Water Heater"],
    featuredImage: "/img/uploads/6669a89a31bf9-426869734_7354600944655783_6872485835952186088_n.jpg",
    images: [
      "/img/uploads/6669a89a31bf9-426869734_7354600944655783_6872485835952186088_n.jpg",
      "/img/uploads/6669a89a4afd2-426992736_7894646820564718_3470541041442850443_n.jpg",
      "/img/uploads/6669a89a57cc5-428087213_6972236749572501_3740831384919394674_n.jpg",
      "/img/uploads/6669a89a71a08-428150184_1599148537536663_933618124482961883_n.jpg"
    ],
    currentTenantId: "tenant-1",
    currentTenantName: "Alexander Cruz",
    createdAt: "2026-01-15T08:00:00.000Z"
  },
  {
    id: "prop-2",
    house_no: 102,
    title: "Nordic Minimalist Loft",
    fulladdress: "Unit 102, HomeHub Residences, Acacia Ave., Cavite",
    noRoom: 2,
    noBathroom: 1,
    noFloor: 1,
    rent: 18000,
    status: "available",
    squareMeters: 54,
    description: "Sun-drenched Scandinavian-style flat designed with warm timber accents, built-in storage cabinets, energy-efficient inverter AC, and serene garden views.",
    amenities: ["Fiber Internet Ready", "Inverter AC", "Smart Door Lock", "Modern Induction Cooktop", "Balcony Garden"],
    featuredImage: "/img/uploads/6669ab9d41e18-428388204_7526491760743274_298134187706128058_n.jpg",
    images: [
      "/img/uploads/6669ab9d41e18-428388204_7526491760743274_298134187706128058_n.jpg",
      "/img/uploads/6669ab9d4de52-428614057_7167885583289294_8109261252592159503_n.jpg",
      "/img/uploads/6669b45c2b8ab-424970509_8494762333886719_7843283474086075261_n.jpg"
    ],
    currentTenantId: null,
    currentTenantName: null,
    createdAt: "2026-01-20T08:00:00.000Z"
  },
  {
    id: "prop-3",
    house_no: 103,
    title: "Urban Industrial Studio Suite",
    fulladdress: "Unit 103, HomeHub Residences, Acacia Ave., Cavite",
    noRoom: 1,
    noBathroom: 1,
    noFloor: 1,
    rent: 13500,
    status: "occupied",
    squareMeters: 38,
    description: "Chic studio with exposed concrete aesthetics, matte black fixtures, open layout kitchen, and soundproof double-glazed acoustic windows.",
    amenities: ["Split-type AC", "Rain Shower", "High-speed Internet", "Keycard Entry", "Intercom System"],
    featuredImage: "/img/uploads/666d6636084ab-434652431_7793740577325738_4339214661463053597_n.jpg",
    images: [
      "/img/uploads/666d6636084ab-434652431_7793740577325738_4339214661463053597_n.jpg",
      "/img/uploads/666d6635ddff3-434286649_7793720940661035_8412053677095194735_n.jpg"
    ],
    currentTenantId: "tenant-2",
    currentTenantName: "Samantha Reyes",
    createdAt: "2026-02-01T08:00:00.000Z"
  },
  {
    id: "prop-4",
    house_no: 201,
    title: "Modern Executive 2BR Haven",
    fulladdress: "Unit 201, HomeHub Residences, Acacia Ave., Cavite",
    noRoom: 2,
    noBathroom: 2,
    noFloor: 1,
    rent: 22000,
    status: "available",
    squareMeters: 65,
    description: "Spacious master bedroom with ensuite marble bathroom, secondary room ideal for home office, modern open concept dining and living area.",
    amenities: ["2 Air Conditioners", "Water Heater in Both Baths", "Balcony", "Parking Slot", "Fast Fiber", "Swimming Pool Access"],
    featuredImage: "/img/uploads/666d66d0a2f4e-438271206_423297347263614_9141182325468805097_n.jpg",
    images: [
      "/img/uploads/666d66d0a2f4e-438271206_423297347263614_9141182325468805097_n.jpg",
      "/img/uploads/666d66d0b1208-441874723_782423000350561_8294537423733067842_n.jpg"
    ],
    currentTenantId: null,
    currentTenantName: null,
    createdAt: "2026-02-10T08:00:00.000Z"
  },
  {
    id: "prop-5",
    house_no: 202,
    title: "Cozy Garden View Townflat",
    fulladdress: "Unit 202, HomeHub Residences, Acacia Ave., Cavite",
    noRoom: 3,
    noBathroom: 2,
    noFloor: 2,
    rent: 26000,
    status: "occupied",
    squareMeters: 78,
    description: "Two-story residential townflat with direct garden access, expansive kitchen pantry, and tranquil quiet community atmosphere.",
    amenities: ["Garden Terrace", "Covered Carport", "Pet Friendly", "Solar Water Heater", "In-unit Laundry Area"],
    featuredImage: "/img/uploads/666d670ea7157-433440298_2705304376301728_1346001382425642215_n.jpg",
    images: [
      "/img/uploads/666d670ea7157-433440298_2705304376301728_1346001382425642215_n.jpg",
      "/img/uploads/666d670ec3554-434152028_7793722033994259_7290228337000349236_n.jpg"
    ],
    currentTenantId: "tenant-3",
    currentTenantName: "Marcus Vance",
    createdAt: "2026-02-15T08:00:00.000Z"
  },
  {
    id: "prop-6",
    house_no: 203,
    title: "Deluxe Sunlit Studio",
    fulladdress: "Unit 203, HomeHub Residences, Acacia Ave., Cavite",
    noRoom: 1,
    noBathroom: 1,
    noFloor: 1,
    rent: 14500,
    status: "maintenance",
    squareMeters: 40,
    description: "Currently undergoing full repainting and bathroom fixture upgrades. Ready for occupancy next week with fresh modern fittings.",
    amenities: ["Inverter AC", "Balcony", "Fitted Wardrobes", "LED Ambient Lighting"],
    featuredImage: "/img/uploads/666d65b463678-423533309_6885058244955840_957960096346188636_n.jpg",
    images: [
      "/img/uploads/666d65b463678-423533309_6885058244955840_957960096346188636_n.jpg"
    ],
    currentTenantId: null,
    currentTenantName: null,
    createdAt: "2026-03-01T08:00:00.000Z"
  }
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: "tenant-1",
    house_no: 101,
    fullname: "Alexander Cruz",
    email: "alexander.cruz@gmail.com",
    contact: "+63 917 842 1944",
    occupants: 3,
    deposit: 57000,
    startDate: "2026-01-05T00:00:00.000Z",
    leaseEndDate: "2027-01-05T00:00:00.000Z",
    monthPaid: 9,
    balance: 0,
    credits: 0,
    status: "active",
    avatarUrl: "/icons/tenant.png",
    emergencyContactName: "Elena Cruz (Spouse)",
    emergencyContactPhone: "+63 917 555 9812",
    createdAt: "2026-01-05T00:00:00.000Z"
  },
  {
    id: "tenant-2",
    house_no: 103,
    fullname: "Samantha Reyes",
    email: "samantha.reyes@gmail.com",
    contact: "+63 928 334 1109",
    occupants: 1,
    deposit: 27000,
    startDate: "2026-02-15T00:00:00.000Z",
    leaseEndDate: "2027-02-15T00:00:00.000Z",
    monthPaid: 7,
    balance: 13500,
    credits: 0,
    status: "active",
    avatarUrl: "/icons/tenant.png",
    emergencyContactName: "Roberto Reyes (Father)",
    emergencyContactPhone: "+63 919 444 8723",
    createdAt: "2026-02-15T00:00:00.000Z"
  },
  {
    id: "tenant-3",
    house_no: 202,
    fullname: "Marcus Vance",
    email: "marcus.vance@techcorp.io",
    contact: "+63 945 889 2031",
    occupants: 4,
    deposit: 52000,
    startDate: "2026-03-01T00:00:00.000Z",
    leaseEndDate: "2027-03-01T00:00:00.000Z",
    monthPaid: 7,
    balance: 0,
    credits: 26000, // 1 month advanced credit
    status: "active",
    avatarUrl: "/icons/tenant.png",
    emergencyContactName: "Lilian Vance (Mother)",
    emergencyContactPhone: "+63 908 777 4412",
    createdAt: "2026-03-01T00:00:00.000Z"
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: "pay-101",
    transaction_id: 1001,
    house_no: 101,
    fullname: "Alexander Cruz",
    tenantId: "tenant-1",
    MOP: "GCash",
    amount: 28500,
    datePaid: "2026-09-04T10:30:00.000Z",
    billingMonth: "September 2026",
    receiptNumber: "HH-REC-2026-1001",
    status: "completed",
    notes: "Regular monthly rent payment via GCash reference #981240182",
    recordedBy: "Super Admin"
  },
  {
    id: "pay-102",
    transaction_id: 1002,
    house_no: 202,
    fullname: "Marcus Vance",
    tenantId: "tenant-3",
    MOP: "Bank Transfer",
    amount: 52000,
    datePaid: "2026-09-01T14:15:00.000Z",
    billingMonth: "September - October 2026",
    receiptNumber: "HH-REC-2026-1002",
    status: "completed",
    notes: "2 Months advance rent payment via BDO Online",
    recordedBy: "Super Admin"
  },
  {
    id: "pay-103",
    transaction_id: 1003,
    house_no: 103,
    fullname: "Samantha Reyes",
    tenantId: "tenant-2",
    MOP: "Maya",
    amount: 13500,
    datePaid: "2026-08-15T09:40:00.000Z",
    billingMonth: "August 2026",
    receiptNumber: "HH-REC-2026-0988",
    status: "completed",
    notes: "August monthly rent",
    recordedBy: "Admin"
  },
  {
    id: "pay-104",
    transaction_id: 1004,
    house_no: 101,
    fullname: "Alexander Cruz",
    tenantId: "tenant-1",
    MOP: "Bank Transfer",
    amount: 28500,
    datePaid: "2026-08-05T11:00:00.000Z",
    billingMonth: "August 2026",
    receiptNumber: "HH-REC-2026-0950",
    status: "completed",
    notes: "August monthly rent",
    recordedBy: "Super Admin"
  }
];

export const INITIAL_CHAT_SESSIONS: ChatSession[] = [
  {
    id: "chat-101",
    house_no: 101,
    tenantId: "tenant-1",
    tenantName: "Alexander Cruz",
    tenantAvatar: "/icons/tenant.png",
    lastMessage: "Thank you for the prompt confirmation of our September rent payment!",
    lastMessageTimestamp: "2026-09-04T10:45:00.000Z",
    ownerUnreadCount: 0,
    tenantUnreadCount: 0
  },
  {
    id: "chat-103",
    house_no: 103,
    tenantId: "tenant-2",
    tenantName: "Samantha Reyes",
    tenantAvatar: "/icons/tenant.png",
    lastMessage: "Hi admin, I will send the rent for this month tomorrow morning via Maya. Thank you!",
    lastMessageTimestamp: "2026-09-29T16:20:00.000Z",
    ownerUnreadCount: 1,
    tenantUnreadCount: 0
  },
  {
    id: "chat-202",
    house_no: 202,
    tenantId: "tenant-3",
    tenantName: "Marcus Vance",
    tenantAvatar: "/icons/tenant.png",
    lastMessage: "Can we schedule routine AC cleaning for next week?",
    lastMessageTimestamp: "2026-09-25T11:10:00.000Z",
    ownerUnreadCount: 0,
    tenantUnreadCount: 0
  }
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  "chat-101": [
    {
      id: "msg-101-1",
      chatId: "chat-101",
      house_no: 101,
      senderId: "tenant-1",
      senderName: "Alexander Cruz",
      senderRole: "tenant",
      text: "Good morning! Just sent the payment for September via GCash.",
      timestamp: "2026-09-04T10:32:00.000Z",
      read: true
    },
    {
      id: "msg-101-2",
      chatId: "chat-101",
      house_no: 101,
      senderId: "superadmin-1",
      senderName: "Property Owner (HomeHub)",
      senderRole: "super_admin",
      text: "Good morning Alexander! We have received and verified your payment. Official receipt #HH-REC-2026-1001 has been logged in your portal.",
      timestamp: "2026-09-04T10:40:00.000Z",
      read: true
    },
    {
      id: "msg-101-3",
      chatId: "chat-101",
      house_no: 101,
      senderId: "tenant-1",
      senderName: "Alexander Cruz",
      senderRole: "tenant",
      text: "Thank you for the prompt confirmation of our September rent payment!",
      timestamp: "2026-09-04T10:45:00.000Z",
      read: true
    }
  ],
  "chat-103": [
    {
      id: "msg-103-1",
      chatId: "chat-103",
      house_no: 103,
      senderId: "tenant-2",
      senderName: "Samantha Reyes",
      senderRole: "tenant",
      text: "Hi admin, I will send the rent for this month tomorrow morning via Maya. Thank you!",
      timestamp: "2026-09-29T16:20:00.000Z",
      read: false
    }
  ],
  "chat-202": [
    {
      id: "msg-202-1",
      chatId: "chat-202",
      house_no: 202,
      senderId: "tenant-3",
      senderName: "Marcus Vance",
      senderRole: "tenant",
      text: "Can we schedule routine AC cleaning for next week?",
      timestamp: "2026-09-25T11:10:00.000Z",
      read: true
    },
    {
      id: "msg-202-2",
      chatId: "chat-202",
      house_no: 202,
      senderId: "superadmin-1",
      senderName: "Property Owner (HomeHub)",
      senderRole: "super_admin",
      text: "Hello Marcus, our HVAC technician is scheduled for Thursday at 2:00 PM. Will someone be home by then?",
      timestamp: "2026-09-25T11:45:00.000Z",
      read: true
    }
  ]
};

export const DEMO_USERS: UserProfile[] = [
  {
    id: "user-sa",
    uid: "superadmin-1",
    email: "owner@homehub.com",
    fullname: "Mark Christian (Owner)",
    role: "super_admin",
    avatarUrl: "/icons/owner.png",
    phone: "+63 917 123 4567",
    assignedHouseNo: null,
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "user-admin",
    uid: "admin-1",
    email: "staff@homehub.com",
    fullname: "Maria Clara (Property Manager)",
    role: "admin",
    avatarUrl: "/icons/owner.png",
    phone: "+63 918 987 6543",
    assignedHouseNo: null,
    createdAt: "2026-01-02T00:00:00.000Z"
  },
  {
    id: "user-tenant-101",
    uid: "tenant-1",
    email: "alexander.cruz@gmail.com",
    fullname: "Alexander Cruz",
    role: "tenant",
    avatarUrl: "/icons/tenant.png",
    phone: "+63 917 842 1944",
    assignedHouseNo: 101,
    createdAt: "2026-01-05T00:00:00.000Z"
  },
  {
    id: "user-tenant-103",
    uid: "tenant-2",
    email: "samantha.reyes@gmail.com",
    fullname: "Samantha Reyes",
    role: "tenant",
    avatarUrl: "/icons/tenant.png",
    phone: "+63 928 334 1109",
    assignedHouseNo: 103,
    createdAt: "2026-02-15T00:00:00.000Z"
  },
  {
    id: "user-tenant-202",
    uid: "tenant-3",
    email: "marcus.vance@techcorp.io",
    fullname: "Marcus Vance",
    role: "tenant",
    avatarUrl: "/icons/tenant.png",
    phone: "+63 945 889 2031",
    assignedHouseNo: 202,
    createdAt: "2026-03-01T00:00:00.000Z"
  }
];

export const calculateDashboardMetrics = (
  properties: Property[] = INITIAL_PROPERTIES,
  tenants: Tenant[] = INITIAL_TENANTS,
  payments: PaymentTransaction[] = INITIAL_PAYMENTS
): DashboardMetrics => {
  const totalUnits = properties.length;
  const rentedUnits = properties.filter(p => p.status === 'occupied').length;
  const availableUnits = properties.filter(p => p.status === 'available').length;
  const maintenanceUnits = properties.filter(p => p.status === 'maintenance').length;
  const totalOccupants = tenants.reduce((acc, t) => acc + (t.status === 'active' ? t.occupants : 0), 0);

  // Calculate earnings for current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyEarnings = payments
    .filter(p => {
      const pDate = new Date(p.datePaid);
      return pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear && p.status === 'completed';
    })
    .reduce((acc, p) => acc + p.amount, 0);

  const pendingDueDates = tenants.filter(t => t.status === 'active' && t.balance > 0).length;
  const occupancyRate = totalUnits > 0 ? Math.round((rentedUnits / totalUnits) * 100) : 0;
  
  // Total expected rent from active units
  const totalExpectedRent = properties
    .filter(p => p.status === 'occupied')
    .reduce((acc, p) => acc + p.rent, 0);
    
  const collectionRate = totalExpectedRent > 0 ? Math.min(100, Math.round((monthlyEarnings / totalExpectedRent) * 100)) : 100;

  return {
    totalUnits,
    rentedUnits,
    availableUnits,
    maintenanceUnits,
    totalOccupants,
    monthlyEarnings: monthlyEarnings > 0 ? monthlyEarnings : 80500, // fallback to active demo total
    pendingDueDates,
    occupancyRate,
    collectionRate
  };
};
