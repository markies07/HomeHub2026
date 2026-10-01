'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, Tenant, PaymentTransaction, ChatSession, ChatMessage, DashboardMetrics, PropertyStatus } from '@/types';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_TENANTS, 
  INITIAL_PAYMENTS, 
  INITIAL_CHAT_SESSIONS, 
  INITIAL_CHAT_MESSAGES,
  calculateDashboardMetrics 
} from '@/lib/mockData';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

interface DataContextType {
  properties: Property[];
  tenants: Tenant[];
  payments: PaymentTransaction[];
  chatSessions: ChatSession[];
  metrics: DashboardMetrics;
  
  // Property Actions
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  
  // Tenant Actions
  addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt' | 'balance' | 'credits' | 'monthPaid' | 'status'>) => void;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  terminateTenant: (id: string, reason?: string) => void;
  
  // Payment Actions
  addPayment: (payment: Omit<PaymentTransaction, 'id' | 'receiptNumber' | 'status'>) => void;
  deletePayment: (id: string) => void;
  
  // Chat Actions
  getMessagesForChat: (chatId: string) => ChatMessage[];
  sendMessage: (chatId: string, houseNo: number, senderId: string, senderName: string, senderRole: 'super_admin' | 'admin' | 'tenant', text: string) => void;
  markChatAsRead: (chatId: string, byRole: 'super_admin' | 'tenant') => void;
  
  // Reset demo data
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(INITIAL_CHAT_SESSIONS);
  const [messagesByChat, setMessagesByChat] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_MESSAGES);
  const [isClient, setIsClient] = useState(false);

  // 1. Initial Load from LocalStorage (Instant startup)
  useEffect(() => {
    setIsClient(true);
    const savedProps = localStorage.getItem('homehub_properties');
    const savedTenants = localStorage.getItem('homehub_tenants');
    const savedPayments = localStorage.getItem('homehub_payments');
    const savedChats = localStorage.getItem('homehub_chat_sessions');
    const savedMsgs = localStorage.getItem('homehub_chat_messages');

    if (savedProps) {
      try {
        const parsed: Property[] = JSON.parse(savedProps);
        const updated = parsed.map(p => ({
          ...p,
          fulladdress: p.fulladdress ? p.fulladdress.replace(/Taguig(?:\s*City)?(?:,\s*Metro\s*Manila)?/gi, 'Cavite') : p.fulladdress
        }));
        setProperties(updated);
        localStorage.setItem('homehub_properties', JSON.stringify(updated));
      } catch (e) {
        setProperties(INITIAL_PROPERTIES);
      }
    }
    if (savedTenants) setTenants(JSON.parse(savedTenants));
    if (savedPayments) setPayments(JSON.parse(savedPayments));
    if (savedChats) setChatSessions(JSON.parse(savedChats));
    if (savedMsgs) setMessagesByChat(JSON.parse(savedMsgs));
  }, []);

  // 2. Real-time Synchronization with Google Cloud Firestore
  useEffect(() => {
    if (!isClient) return;

    // Listen to properties collection
    const unsubProps = onSnapshot(collection(db, 'properties'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreProps: Property[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data() as Property;
          const fulladdress = data.fulladdress ? data.fulladdress.replace(/Taguig(?:\s*City)?(?:,\s*Metro\s*Manila)?/gi, 'Cavite') : data.fulladdress;
          firestoreProps.push({ ...data, fulladdress, id: docSnap.id });
        });
        firestoreProps.sort((a, b) => a.house_no - b.house_no);
        setProperties(firestoreProps);
        localStorage.setItem('homehub_properties', JSON.stringify(firestoreProps));
      }
    }, (err) => console.log('Firestore properties sync info:', err.message));

    // Listen to tenants collection
    const unsubTenants = onSnapshot(collection(db, 'tenants'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreTenants: Tenant[] = [];
        snapshot.forEach(docSnap => {
          firestoreTenants.push({ ...docSnap.data(), id: docSnap.id } as Tenant);
        });
        setTenants(firestoreTenants);
        localStorage.setItem('homehub_tenants', JSON.stringify(firestoreTenants));
      }
    }, (err) => console.log('Firestore tenants sync info:', err.message));

    // Listen to payments collection
    const unsubPayments = onSnapshot(collection(db, 'payments'), (snapshot) => {
      if (!snapshot.empty) {
        const firestorePayments: PaymentTransaction[] = [];
        snapshot.forEach(docSnap => {
          firestorePayments.push({ ...docSnap.data(), id: docSnap.id } as PaymentTransaction);
        });
        firestorePayments.sort((a, b) => new Date(b.datePaid).getTime() - new Date(a.datePaid).getTime());
        setPayments(firestorePayments);
        localStorage.setItem('homehub_payments', JSON.stringify(firestorePayments));
      }
    }, (err) => console.log('Firestore payments sync info:', err.message));

    // Listen to chat_sessions collection
    const unsubChats = onSnapshot(collection(db, 'chat_sessions'), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreChats: ChatSession[] = [];
        snapshot.forEach(docSnap => {
          firestoreChats.push({ ...docSnap.data(), id: docSnap.id } as ChatSession);
        });
        setChatSessions(firestoreChats);
        localStorage.setItem('homehub_chat_sessions', JSON.stringify(firestoreChats));
      }
    }, (err) => console.log('Firestore chats sync info:', err.message));

    // Listen to messages collection
    const unsubMsgs = onSnapshot(collection(db, 'messages'), (snapshot) => {
      if (!snapshot.empty) {
        const grouped: Record<string, ChatMessage[]> = {};
        snapshot.forEach(docSnap => {
          const msg = { ...docSnap.data(), id: docSnap.id } as ChatMessage;
          if (!grouped[msg.chatId]) grouped[msg.chatId] = [];
          grouped[msg.chatId].push(msg);
        });
        for (const cId in grouped) {
          grouped[cId].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        }
        setMessagesByChat(prev => ({ ...prev, ...grouped }));
        localStorage.setItem('homehub_chat_messages', JSON.stringify(grouped));
      }
    }, (err) => console.log('Firestore messages sync info:', err.message));

    return () => {
      unsubProps();
      unsubTenants();
      unsubPayments();
      unsubChats();
      unsubMsgs();
    };
  }, [isClient]);

  // Save to local storage on changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('homehub_properties', JSON.stringify(properties));
      localStorage.setItem('homehub_tenants', JSON.stringify(tenants));
      localStorage.setItem('homehub_payments', JSON.stringify(payments));
      localStorage.setItem('homehub_chat_sessions', JSON.stringify(chatSessions));
      localStorage.setItem('homehub_chat_messages', JSON.stringify(messagesByChat));
    }
  }, [properties, tenants, payments, chatSessions, messagesByChat, isClient]);

  const metrics = calculateDashboardMetrics(properties, tenants, payments);

  // Property handlers
  const addProperty = async (newProp: Omit<Property, 'id' | 'createdAt'>) => {
    const id = `prop-${Date.now()}`;
    const property: Property = {
      ...newProp,
      id,
      createdAt: new Date().toISOString()
    };
    setProperties(prev => [property, ...prev]);

    // Sync to Firestore
    try {
      await setDoc(doc(db, 'properties', id), property);
    } catch (e) {
      console.warn('Firestore offline fallback for addProperty');
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    setProperties(prev => prev.map(p => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)));

    // Sync to Firestore
    try {
      await updateDoc(doc(db, 'properties', id), {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      try {
        const fullProp = properties.find(p => p.id === id);
        if (fullProp) {
          await setDoc(doc(db, 'properties', id), { ...fullProp, ...updates, updatedAt: new Date().toISOString() });
        }
      } catch (err) {}
    }
  };

  const deleteProperty = async (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));

    // Sync to Firestore
    try {
      await deleteDoc(doc(db, 'properties', id));
    } catch (e) {}
  };

  // Tenant handlers
  const addTenant = async (newTenantData: Omit<Tenant, 'id' | 'createdAt' | 'balance' | 'credits' | 'monthPaid' | 'status'>) => {
    const id = `tenant-${Date.now()}`;
    const newTenant: Tenant = {
      ...newTenantData,
      id,
      monthPaid: 0,
      balance: 0,
      credits: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setTenants(prev => [newTenant, ...prev]);

    // Update the property status to occupied
    const targetProp = properties.find(p => p.house_no === newTenantData.house_no);
    if (targetProp) {
      updateProperty(targetProp.id, {
        status: 'occupied',
        currentTenantId: id,
        currentTenantName: newTenantData.fullname
      });
    }

    // Automatically create a chat session for this tenant
    const chatId = `chat-${newTenantData.house_no}`;
    if (!chatSessions.some(c => c.id === chatId)) {
      const newSession: ChatSession = {
        id: chatId,
        house_no: newTenantData.house_no,
        tenantId: id,
        tenantName: newTenantData.fullname,
        tenantAvatar: newTenantData.avatarUrl || '/icons/tenant.png',
        lastMessage: 'Tenant onboarded. Welcome to HomeHub!',
        lastMessageTimestamp: new Date().toISOString(),
        ownerUnreadCount: 0,
        tenantUnreadCount: 1
      };
      setChatSessions(prev => [newSession, ...prev]);

      const welcomeMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        chatId,
        house_no: newTenantData.house_no,
        senderId: 'superadmin-1',
        senderName: 'Property Owner (HomeHub)',
        senderRole: 'super_admin',
        text: `Welcome to Unit ${newTenantData.house_no}, ${newTenantData.fullname}! Feel free to message us here if you need anything.`,
        timestamp: new Date().toISOString(),
        read: false
      };

      setMessagesByChat(prev => ({
        ...prev,
        [chatId]: [welcomeMsg]
      }));

      // Sync to Firestore
      try {
        await setDoc(doc(db, 'chat_sessions', chatId), newSession);
        await setDoc(doc(db, 'messages', welcomeMsg.id), welcomeMsg);
      } catch (e) {}
    }

    // Sync to Firestore
    try {
      await setDoc(doc(db, 'tenants', id), newTenant);
    } catch (e) {}
  };

  const updateTenant = async (id: string, updates: Partial<Tenant>) => {
    setTenants(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));

    // Sync to Firestore
    try {
      await updateDoc(doc(db, 'tenants', id), updates);
    } catch (e) {}
  };

  const terminateTenant = async (id: string, reason?: string) => {
    const tenant = tenants.find(t => t.id === id);
    if (!tenant) return;

    // Mark tenant as terminated
    setTenants(prev => prev.map(t => (t.id === id ? { ...t, status: 'terminated' } : t)));

    // Free up the property
    const prop = properties.find(p => p.house_no === tenant.house_no);
    if (prop) {
      updateProperty(prop.id, {
        status: 'available',
        currentTenantId: null,
        currentTenantName: null
      });
    }

    // Sync to Firestore
    try {
      await updateDoc(doc(db, 'tenants', id), { status: 'terminated' });
      if (prop) {
        await updateDoc(doc(db, 'properties', prop.id), {
          status: 'available',
          currentTenantId: null,
          currentTenantName: null
        });
      }
    } catch (e) {}
  };

  // Payment handlers
  const addPayment = async (paymentData: Omit<PaymentTransaction, 'id' | 'receiptNumber' | 'status'>) => {
    const id = `pay-${Date.now()}`;
    const count = payments.length + 1001;
    const receiptNumber = `HH-REC-${new Date().getFullYear()}-${count}`;

    const newPayment: PaymentTransaction = {
      ...paymentData,
      id,
      receiptNumber,
      status: 'completed'
    };

    setPayments(prev => [newPayment, ...prev]);

    // Recalculate tenant balance if applicable
    const tenant = tenants.find(t => t.house_no === paymentData.house_no && t.status === 'active');
    const prop = properties.find(p => p.house_no === paymentData.house_no);
    if (tenant && prop) {
      const rent = prop.rent;
      const amount = paymentData.amount;
      const newMonthPaid = tenant.monthPaid + Math.floor(amount / rent);
      const newBalance = Math.max(0, tenant.balance - amount);
      const newCredits = amount > rent ? tenant.credits + (amount - rent) : tenant.credits;

      updateTenant(tenant.id, {
        monthPaid: newMonthPaid,
        balance: newBalance,
        credits: newCredits
      });
    }

    // Sync to Firestore
    try {
      await setDoc(doc(db, 'payments', id), newPayment);
    } catch (e) {}
  };

  const deletePayment = async (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));

    // Sync to Firestore
    try {
      await deleteDoc(doc(db, 'payments', id));
    } catch (e) {}
  };

  // Chat handlers (Firestore Realtime)
  const getMessagesForChat = (chatId: string): ChatMessage[] => {
    return messagesByChat[chatId] || [];
  };

  const sendMessage = async (
    chatId: string,
    houseNo: number,
    senderId: string,
    senderName: string,
    senderRole: 'super_admin' | 'admin' | 'tenant',
    text: string
  ) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId,
      house_no: houseNo,
      senderId,
      senderName,
      senderRole,
      text,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Update message record
    setMessagesByChat(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage]
    }));

    // Update chat session list
    setChatSessions(prev =>
      prev.map(session => {
        if (session.id === chatId) {
          return {
            ...session,
            lastMessage: text,
            lastMessageTimestamp: newMessage.timestamp,
            ownerUnreadCount: senderRole === 'tenant' ? session.ownerUnreadCount + 1 : session.ownerUnreadCount,
            tenantUnreadCount: senderRole !== 'tenant' ? session.tenantUnreadCount + 1 : session.tenantUnreadCount
          };
        }
        return session;
      })
    );

    // Sync to Firestore
    try {
      await setDoc(doc(db, 'messages', newMessage.id), newMessage);
      await updateDoc(doc(db, 'chat_sessions', chatId), {
        lastMessage: text,
        lastMessageTimestamp: newMessage.timestamp
      });
    } catch (e) {}
  };

  const markChatAsRead = async (chatId: string, byRole: 'super_admin' | 'tenant') => {
    setChatSessions(prev =>
      prev.map(session => {
        if (session.id === chatId) {
          return {
            ...session,
            ownerUnreadCount: byRole === 'super_admin' ? 0 : session.ownerUnreadCount,
            tenantUnreadCount: byRole === 'tenant' ? 0 : session.tenantUnreadCount
          };
        }
        return session;
      })
    );

    setMessagesByChat(prev => {
      const messages = prev[chatId];
      if (!messages) return prev;
      return {
        ...prev,
        [chatId]: messages.map(m => (m.senderRole !== byRole ? { ...m, read: true } : m))
      };
    });

    // Sync to Firestore
    try {
      if (byRole === 'super_admin') {
        await updateDoc(doc(db, 'chat_sessions', chatId), { ownerUnreadCount: 0 });
      } else {
        await updateDoc(doc(db, 'chat_sessions', chatId), { tenantUnreadCount: 0 });
      }
    } catch (e) {}
  };

  const resetToDefaults = () => {
    setProperties(INITIAL_PROPERTIES);
    setTenants(INITIAL_TENANTS);
    setPayments(INITIAL_PAYMENTS);
    setChatSessions(INITIAL_CHAT_SESSIONS);
    setMessagesByChat(INITIAL_CHAT_MESSAGES);
    localStorage.clear();
  };

  return (
    <DataContext.Provider
      value={{
        properties,
        tenants,
        payments,
        chatSessions,
        metrics,
        addProperty,
        updateProperty,
        deleteProperty,
        addTenant,
        updateTenant,
        terminateTenant,
        addPayment,
        deletePayment,
        getMessagesForChat,
        sendMessage,
        markChatAsRead,
        resetToDefaults
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
