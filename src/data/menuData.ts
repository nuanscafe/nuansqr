import { collection, getDocs } from "firebase/firestore";
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
];
