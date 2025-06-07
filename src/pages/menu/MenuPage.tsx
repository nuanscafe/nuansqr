import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMenuItems, getCategories, MenuItem, Category } from '../../data/menuData';
import { useCart } from '../../context/CartContext';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

interface MenuPageProps {}

const MenuPage: React.FC<MenuPageProps> = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [menuItemsState, setMenuItemsState] = useState<MenuItem[]>([]);
  const [categoriesState, setCategoriesState] = useState<Category[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const { addToCart, setTableId } = useCart();
  const { t, i18n } = useTranslation();

  // Effect to set tableId
  useEffect(() => {
    if (tableId) {
      setTableId(tableId);
    }
  }, [tableId, setTableId]);

  // Effect to fetch menu items and categories from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const items = await getMenuItems();
      setMenuItemsState(items);
      const cats = await getCategories();
      setCategoriesState(cats);
    };
    fetchData();
  }, []);

  // Effect to filter menu items based on active category
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredItems(menuItemsState);
    } else {
      setFilteredItems(menuItemsState.filter(item => item.category === activeCategory));
    }
  }, [activeCategory, menuItemsState]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center bg-amber-100 rounded-lg p-4 mb-6 text-center">
        <div>
          <h1 className="text-3xl font-bold text-amber-800">{t('ourMenu')}</h1>
          {tableId && (
            <p className="text-amber-700 mt-2">{t('table')}: {tableId}</p>
          )}
        </div>
        <Select onValueChange={changeLanguage} defaultValue={i18n.language}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Dil Seç" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tr">Türkçe</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ru">Русский</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Kategori Seçimi */}
      <div className="overflow-x-auto pb-2 mb-6">
        <div className="flex space-x-2 min-w-max">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === 'all' 
                ? 'bg-amber-600 text-white' 
                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
            }`}
          >
            {t('all')}
          </button>
          {categoriesState.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === category.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              {category[('name_' + i18n.language) as keyof Category] || category.name_tr}
            </button>
          ))}
        </div>
      </div>

      {/* Ürün Listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item[('name_' + i18n.language) as keyof MenuItem] || item.name_tr}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{item[('name_' + i18n.language) as keyof MenuItem] || item.name_tr}</h3>
                <span className="text-amber-600 font-bold">{item.price} ₺</span>
              </div>
              <p className="text-gray-600 text-sm mt-1">{item[('description_' + i18n.language) as keyof MenuItem] || item.description_tr}</p>
              <button
                onClick={() => addToCart(item)}
                className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                {t('addToCart')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
