import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRbAXb2NOYPhVU8Z_pr37VX80o75VpGKU",
  authDomain: "homehub-56386.firebaseapp.com",
  projectId: "homehub-56386",
  storageBucket: "homehub-56386.firebasestorage.app",
  messagingSenderId: "89842113755",
  appId: "1:89842113755:web:7ac494e02d78ac209c80fe",
  measurementId: "G-F0C8EM3FC1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Authentic HomeHub Properties (using real uploaded unit photos from HomeHub)
const REAL_PROPERTIES = [
  {
    id: "prop-101",
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
    currentTenantId: "tenant-101",
    currentTenantName: "Alexander Cruz",
    createdAt: new Date("2026-01-15T08:00:00Z").toISOString()
  },
  {
    id: "prop-102",
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
    createdAt: new Date("2026-01-20T08:00:00Z").toISOString()
  },
  {
    id: "prop-103",
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
    currentTenantId: "tenant-103",
    currentTenantName: "Samantha Reyes",
    createdAt: new Date("2026-02-01T08:00:00Z").toISOString()
  },
  {
    id: "prop-201",
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
    createdAt: new Date("2026-02-10T08:00:00Z").toISOString()
  },
  {
    id: "prop-202",
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
    currentTenantId: "tenant-202",
    currentTenantName: "Marcus Vance",
    createdAt: new Date("2026-02-15T08:00:00Z").toISOString()
  },
  {
    id: "prop-203",
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
    createdAt: new Date("2026-03-01T08:00:00Z").toISOString()
  }
];

// Authentic HomeHub Tenants
const REAL_TENANTS = [
  {
    id: "tenant-101",
    house_no: 101,
    fullname: "Alexander Cruz",
    email: "alexander.cruz@gmail.com",
    contact: "+63 917 842 1944",
    occupants: 3,
    deposit: 57000,
    startDate: new Date("2026-01-05T00:00:00Z").toISOString(),
    leaseEndDate: new Date("2027-01-05T00:00:00Z").toISOString(),
    monthPaid: 8,
    balance: 0,
    credits: 0,
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    emergencyContactName: "Elena Cruz (Spouse)",
    emergencyContactPhone: "+63 917 842 1945",
    createdAt: new Date("2026-01-05T00:00:00Z").toISOString()
  },
  {
    id: "tenant-103",
    house_no: 103,
    fullname: "Samantha Reyes",
    email: "samantha.reyes@techmail.ph",
    contact: "+63 928 551 8832",
    occupants: 1,
    deposit: 27000,
    startDate: new Date("2026-02-15T00:00:00Z").toISOString(),
    leaseEndDate: new Date("2027-02-15T00:00:00Z").toISOString(),
    monthPaid: 7,
    balance: 13500,
    credits: 0,
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    emergencyContactName: "Eduardo Reyes (Father)",
    emergencyContactPhone: "+63 928 551 8830",
    createdAt: new Date("2026-02-15T00:00:00Z").toISOString()
  },
  {
    id: "tenant-202",
    house_no: 202,
    fullname: "Marcus Vance",
    email: "marcus.vance@creatives.co",
    contact: "+63 905 319 7721",
    occupants: 2,
    deposit: 52000,
    startDate: new Date("2026-03-01T00:00:00Z").toISOString(),
    leaseEndDate: new Date("2027-03-01T00:00:00Z").toISOString(),
    monthPaid: 6,
    balance: 0,
    credits: 26000,
    status: "active",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    emergencyContactName: "Clara Vance (Sister)",
    emergencyContactPhone: "+63 905 319 7720",
    createdAt: new Date("2026-03-01T00:00:00Z").toISOString()
  }
];

// Authentic HomeHub Payments
const REAL_PAYMENTS = [
  {
    id: "pay-1001",
    receiptNumber: "HH-REC-2026-1001",
    house_no: 101,
    fullname: "Alexander Cruz",
    MOP: "GCash",
    amount: 28500,
    datePaid: new Date("2026-09-04T10:30:00Z").toISOString(),
    billingMonth: "September 2026",
    status: "verified",
    notes: "Regular monthly rent paid via GCash Express (Ref # 1009283749)",
    recordedBy: "Super Admin (Mark Christian)"
  },
  {
    id: "pay-1002",
    receiptNumber: "HH-REC-2026-1002",
    house_no: 202,
    fullname: "Marcus Vance",
    MOP: "Bank Transfer",
    amount: 52000,
    datePaid: new Date("2026-09-01T14:15:00Z").toISOString(),
    billingMonth: "September - October 2026",
    status: "verified",
    notes: "Advance 2-month rental payment through BPI Online",
    recordedBy: "Super Admin (Mark Christian)"
  },
  {
    id: "pay-0988",
    receiptNumber: "HH-REC-2026-0988",
    house_no: 103,
    fullname: "Samantha Reyes",
    MOP: "Maya",
    amount: 13500,
    datePaid: new Date("2026-08-15T09:40:00Z").toISOString(),
    billingMonth: "August 2026",
    status: "verified",
    notes: "Rent settlement for August 2026",
    recordedBy: "Staff Admin"
  },
  {
    id: "pay-0950",
    receiptNumber: "HH-REC-2026-0950",
    house_no: 101,
    fullname: "Alexander Cruz",
    MOP: "GCash",
    amount: 28500,
    datePaid: new Date("2026-08-05T11:00:00Z").toISOString(),
    billingMonth: "August 2026",
    status: "verified",
    notes: "August rent paid on due date",
    recordedBy: "Super Admin (Mark Christian)"
  }
];

// Authentic HomeHub Chat Sessions
const REAL_CHAT_SESSIONS = [
  {
    id: "chat-101",
    house_no: 101,
    tenantId: "tenant-101",
    tenantName: "Alexander Cruz",
    tenantAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    lastMessage: "Thank you for confirming the rent receipt! Everything is running smoothly.",
    lastMessageTimestamp: new Date("2026-09-04T10:45:00Z").toISOString(),
    ownerUnreadCount: 0,
    tenantUnreadCount: 0
  },
  {
    id: "chat-103",
    house_no: 103,
    tenantId: "tenant-103",
    tenantName: "Samantha Reyes",
    tenantAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    lastMessage: "Hi Sir Mark! Just inquired about the water heater maintenance scheduled tomorrow.",
    lastMessageTimestamp: new Date("2026-09-29T16:20:00Z").toISOString(),
    ownerUnreadCount: 1,
    tenantUnreadCount: 0
  },
  {
    id: "chat-202",
    house_no: 202,
    tenantId: "tenant-202",
    tenantName: "Marcus Vance",
    tenantAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    lastMessage: "All settled with the 2-month advance transfer. Appreciate the fast response!",
    lastMessageTimestamp: new Date("2026-09-25T11:10:00Z").toISOString(),
    ownerUnreadCount: 0,
    tenantUnreadCount: 0
  }
];

// Authentic HomeHub Chat Messages
const REAL_MESSAGES = [
  {
    id: "msg-101-1",
    chatId: "chat-101",
    house_no: 101,
    senderId: "tenant-101",
    senderName: "Alexander Cruz",
    senderRole: "tenant",
    text: "Good morning! Just submitted our September rent of ₱28,500 via GCash. Reference # 1009283749.",
    timestamp: new Date("2026-09-04T10:32:00Z").toISOString(),
    read: true
  },
  {
    id: "msg-101-2",
    chatId: "chat-101",
    house_no: 101,
    senderId: "owner-1",
    senderName: "Mark Christian (Owner)",
    senderRole: "super_admin",
    text: "Good morning Alexander! We have received and verified your payment. Official receipt #HH-REC-2026-1001 has been logged in your portal.",
    timestamp: new Date("2026-09-04T10:40:00Z").toISOString(),
    read: true
  },
  {
    id: "msg-101-3",
    chatId: "chat-101",
    house_no: 101,
    senderId: "tenant-101",
    senderName: "Alexander Cruz",
    senderRole: "tenant",
    text: "Thank you for confirming the rent receipt! Everything is running smoothly.",
    timestamp: new Date("2026-09-04T10:45:00Z").toISOString(),
    read: true
  },
  {
    id: "msg-103-1",
    chatId: "chat-103",
    house_no: 103,
    senderId: "tenant-103",
    senderName: "Samantha Reyes",
    senderRole: "tenant",
    text: "Hi Sir Mark! Just inquired about the water heater maintenance scheduled tomorrow. Will the technicians arrive around 10am?",
    timestamp: new Date("2026-09-29T16:20:00Z").toISOString(),
    read: false
  },
  {
    id: "msg-202-1",
    chatId: "chat-202",
    house_no: 202,
    senderId: "tenant-202",
    senderName: "Marcus Vance",
    senderRole: "tenant",
    text: "Good day! Just sent the BPI online transfer for September and October advance (₱52,000 total).",
    timestamp: new Date("2026-09-25T11:10:00Z").toISOString(),
    read: true
  },
  {
    id: "msg-202-2",
    chatId: "chat-202",
    house_no: 202,
    senderId: "owner-1",
    senderName: "Mark Christian (Owner)",
    senderRole: "super_admin",
    text: "Received with thanks Marcus! We have credited ₱26,000 to your account for next month as well. Receipt #HH-REC-2026-1002 is generated.",
    timestamp: new Date("2026-09-25T11:45:00Z").toISOString(),
    read: true
  }
];

// Accounts / Users
const REAL_USERS = [
  {
    uid: "superadmin-1",
    fullname: "Mark Christian",
    username: "mark_owner",
    email: "owner@homehub.com",
    role: "super_admin",
    contact: "+63 917 555 0192",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
    status: "active"
  },
  {
    uid: "admin-1",
    fullname: "Christian James",
    username: "staff_james",
    email: "james@homehub.com",
    role: "admin",
    contact: "+63 918 444 0281",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80",
    status: "active"
  },
  {
    uid: "tenant-101",
    fullname: "Alexander Cruz",
    username: "alex_cruz",
    email: "alexander.cruz@gmail.com",
    role: "tenant",
    contact: "+63 917 842 1944",
    assignedHouseNo: 101,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    status: "active"
  }
];

async function seedAll() {
  console.log("=== SEEDING REAL HOMEHUB DATA TO FIRESTORE (homehub-56386) ===");

  // 1. Properties
  console.log("\n1. Seeding Properties collection...");
  for (const prop of REAL_PROPERTIES) {
    await setDoc(doc(db, "properties", prop.id), prop);
    console.log(`  + Property: House ${prop.house_no} - "${prop.title}" (${prop.status})`);
  }

  // 2. Tenants
  console.log("\n2. Seeding Tenants collection...");
  for (const tenant of REAL_TENANTS) {
    await setDoc(doc(db, "tenants", tenant.id), tenant);
    console.log(`  + Tenant: ${tenant.fullname} (House ${tenant.house_no})`);
  }

  // 3. Payments
  console.log("\n3. Seeding Payments collection...");
  for (const pay of REAL_PAYMENTS) {
    await setDoc(doc(db, "payments", pay.id), pay);
    console.log(`  + Payment: ${pay.receiptNumber} - ₱${pay.amount.toLocaleString()} (${pay.MOP})`);
  }

  // 4. Chat Sessions
  console.log("\n4. Seeding Chat Sessions collection...");
  for (const session of REAL_CHAT_SESSIONS) {
    await setDoc(doc(db, "chat_sessions", session.id), session);
    console.log(`  + Chat Session: ${session.id} for House ${session.house_no}`);
  }

  // 5. Messages
  console.log("\n5. Seeding Messages collection...");
  for (const msg of REAL_MESSAGES) {
    await setDoc(doc(db, "messages", msg.id), msg);
    console.log(`  + Message: [${msg.senderRole}] ${msg.text.slice(0, 40)}...`);
  }

  // 6. Users
  console.log("\n6. Seeding Users collection...");
  for (const u of REAL_USERS) {
    await setDoc(doc(db, "users", u.uid), u);
    console.log(`  + User: ${u.fullname} [${u.role}]`);
  }

  console.log("\n=== ALL REAL HOMEHUB DATA SUCCESSFULLY SEEDED TO FIRESTORE! ===");
  process.exit(0);
}

seedAll().catch(err => {
  console.error("Seeding error:", err);
  process.exit(1);
});
