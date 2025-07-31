import { db } from '../../firebase'; // Import the initialized Firestore instance
import { collection, query, orderBy, onSnapshot, doc, updateDoc, Timestamp } from 'firebase/firestore'; // Import Firestore functions
import React, { useState, useEffect } from 'react';
import WaiterCallNotifications from '../../components/admin/WaiterCallNotifications';
import OrderGrid from '../../components/admin/OrderGrid';
import { playNewOrderSound } from '../../utils/audioUtils';

// Sipariş durumları
type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivered';

// Sipariş öğesi arayüzü (matches the structure saved in CheckoutPage.tsx)
interface OrderItem {
  id: string; // Firestore document ID for menu item (if stored) or a unique identifier
  name: string;
  price: number;
  quantity: number;
}

// Sipariş arayüzü (matches the structure saved in CheckoutPage.tsx)
interface Order {
  id: string; // Firestore document ID for the order
  tableId: string;
  sessionId: string; // Unique session ID to distinguish different orders from same table
  items: OrderItem[];
  status: OrderStatus;
  totalPrice: number;
  orderNote?: string; // Use orderNote to match the field name in CheckoutPage.tsx
  timestamp: Timestamp; // Use Timestamp type for Firestore timestamp
  paymentStatus?: 'pending' | 'paid'; // Payment status
}



const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]); // State for orders, initialized as empty array
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [previousOrderCount, setPreviousOrderCount] = useState(0); // State to track previous order count
  
  // Sipariş durumu için renk ve etiket belirleme
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return { color: 'bg-green-100 text-green-800', label: 'Yeni' };
      case 'preparing':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'Hazırlanıyor' };
      case 'ready':
        return { color: 'bg-blue-100 text-blue-800', label: 'Hazır' };
      case 'delivered':
        return { color: 'bg-gray-100 text-gray-800', label: 'Teslim Edildi' };
    }
  };
  
  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
  
  // Function to show notification
  const showNewOrderNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Yeni Sipariş!', {
        body: 'Yeni bir sipariş geldi.',
        icon: '/favicon.ico'
      });
    }
  };
  
  // Effect to fetch orders from Firestore in real-time and play sound on new order
  useEffect(() => {
    const ordersCollection = collection(db, 'orders');
    const ordersQuery = query(ordersCollection, orderBy('timestamp', 'desc')); // Order by timestamp
  
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Order, 'id'> // Cast data and add id
      }));
  
      // Check if new orders have arrived
      if (ordersList.length > previousOrderCount && previousOrderCount !== 0) {
        playNewOrderSound();
        showNewOrderNotification();
      }
  
      setOrders(ordersList);
      setPreviousOrderCount(ordersList.length); // Update the previous order count
    });
  
    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [previousOrderCount]); // Add previousOrderCount to dependency array

  // Sipariş durumunu güncelleme (in Firestore)
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => { // Make function asynchronous
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus
      });
      // The onSnapshot listener will automatically update the local state
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Sipariş durumu güncellenirken bir hata oluştu.');
    }
  };
  
  // Tarih formatı (adjust to handle Firestore Timestamp)
  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate(); // Convert Firestore Timestamp to Date
    return new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Sipariş Yönetimi</h1>
      
      {/* Garson Çağrısı Bildirimleri */}
      <WaiterCallNotifications />
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sipariş Grid */}
        <div className="lg:w-2/3">
          <OrderGrid 
            orders={orders}
            onStatusUpdate={updateOrderStatus}
            onOrderSelect={setSelectedOrder}
          />
        </div>
        
        {/* Sipariş Detayı */}
        <div className="lg:w-1/3">
          {selectedOrder ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Sipariş Detayı</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4 p-3 bg-amber-50 rounded-md">
                <p className="text-amber-700 font-medium">Masa: {selectedOrder.tableId}</p>
                <p className="text-amber-700 text-sm">{formatDate(selectedOrder.timestamp)}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-2">Sipariş Durumu</h3>
                <div className="flex flex-wrap gap-2">
                  {(['new', 'preparing', 'ready', 'delivered'] as OrderStatus[]).map(status => {
                    const isActive = selectedOrder.status === status;
                    const statusInfo = getStatusInfo(status);
                    
                    return (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isActive 
                            ? statusInfo.color
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {statusInfo.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-2">Sipariş Öğeleri</h3>
                <div className="border-t border-b border-gray-200 py-2 divide-y divide-gray-200">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="py-2 flex justify-between">
                      <div>
                        <span className="text-gray-800">{item.quantity} x {item.name}</span>
                      </div>
                      <span className="text-gray-800 font-medium">{item.price * item.quantity} ₺</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-lg font-bold mb-4">
                <span>Toplam:</span>
                <span>{selectedOrder.totalPrice} ₺</span>
              </div>
              
              {selectedOrder.orderNote && (
                <div className="mb-4">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Sipariş Notu</h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{selectedOrder.orderNote}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">Detayları görüntülemek için bir sipariş seçin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
