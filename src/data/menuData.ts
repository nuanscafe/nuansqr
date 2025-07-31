import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase"; // Import the initialized Firestore instance

export interface MenuItem {
  id: string;
  name_tr: string;
  name_en: string;
  name_ru: string;
  name_de: string;
  name_fr: string;
  description_tr: string;
  description_en: string;
  description_ru: string;
  description_de: string;
  description_fr: string;
  price: number;
  image: string;
  category: string;
  [key: string]: any; // Allow string indexing for dynamic language properties
}

export interface Category {
  id: string;
  name_tr: string;
  name_en: string;
  name_ru: string;
  name_de: string;
  name_fr: string;
  [key: string]: any; // Allow string indexing for dynamic language properties
}

// Function to fetch menu items from Firestore
export const getMenuItems = async (): Promise<MenuItem[]> => {
  const menuItemsCollection = collection(db, "menuItems"); // Assuming a "menuItems" collection
  const menuItemsSnapshot = await getDocs(menuItemsCollection);
  const menuItemsList = menuItemsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as MenuItem[];
  return menuItemsList;
};

// Function to fetch categories from Firestore
export const getCategories = async (): Promise<Category[]> => {
  const categoriesCollection = collection(db, "categories"); // Assuming a "categories" collection
  const categoriesSnapshot = await getDocs(categoriesCollection);
  const categoriesList = categoriesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Category[];
  return categoriesList;
};

// Garson çağırma sistemi
export interface WaiterCall {
  id: string;
  tableId: string;
  timestamp: Timestamp;
  status: 'pending' | 'acknowledged' | 'resolved';
  message?: string;
}

// Function to create a waiter call
export const createWaiterCall = async (tableId: string, message?: string): Promise<void> => {
  const waiterCallsCollection = collection(db, "waiterCalls");
  const waiterCallData = {
    tableId,
    timestamp: Timestamp.now(),
    status: 'pending' as const,
    message: message || ''
  };
  
  await addDoc(waiterCallsCollection, waiterCallData);
};

// Function to fetch waiter calls from Firestore
export const getWaiterCalls = async (): Promise<WaiterCall[]> => {
  const waiterCallsCollection = collection(db, "waiterCalls");
  const waiterCallsSnapshot = await getDocs(waiterCallsCollection);
  const waiterCallsList = waiterCallsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as WaiterCall[];
  return waiterCallsList;
};

// Masa verileri
export interface Table {
  id: number;
  name: string;
  qrCode: string;
}

export const tables: Table[] = [
  { id: 1, name: 'Masa 1', qrCode: 'table-1' },
  { id: 2, name: 'Masa 2', qrCode: 'table-2' },
  { id: 3, name: 'Masa 3', qrCode: 'table-3' },
  { id: 4, name: 'Masa 4', qrCode: 'table-4' },
  { id: 5, name: 'Masa 5', qrCode: 'table-5' },
  { id: 6, name: 'Masa 6', qrCode: 'table-6' },
  { id: 7, name: 'Masa 7', qrCode: 'table-7' },
  { id: 8, name: 'Masa 8', qrCode: 'table-8' },
  { id: 9, name: 'Masa 9', qrCode: 'table-9' },
  { id: 10, name: 'Masa 10', qrCode: 'table-10' },
  { id: 11, name: 'Masa 11', qrCode: 'table-11' },
  { id: 12, name: 'Masa 12', qrCode: 'table-12' },
  { id: 13, name: 'Masa 13', qrCode: 'table-13' },
  { id: 14, name: 'Masa 14', qrCode: 'table-14' },
  { id: 15, name: 'Masa 15', qrCode: 'table-15' },
  { id: 16, name: 'Masa 16', qrCode: 'table-16' },
  { id: 17, name: 'Masa 17', qrCode: 'table-17' },
  { id: 18, name: 'Masa 18', qrCode: 'table-18' },
  { id: 19, name: 'Masa 19', qrCode: 'table-19' },
  { id: 20, name: 'Masa 20', qrCode: 'table-20' },
];
