import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { db } from '../../firebase'; // Import the initialized Firestore instance
import { collection, addDoc, Timestamp } from 'firebase/firestore'; // Import Firestore functions

const CheckoutPage: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();

  const handleSubmitOrder = async () => { // Make the function asynchronous
    try {
      // Get the order note from the textarea
      const orderNoteElement = document.getElementById('order-note') as HTMLTextAreaElement;
      const orderNote = orderNoteElement ? orderNoteElement.value : '';

      // Prepare the order data
      const orderData = {
        tableId: tableId,
        items: items.map(item => ({ // Map cart items to a suitable format for Firestore
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice: getTotalPrice(),
        orderNote: orderNote,
        timestamp: Timestamp.now(), // Add a timestamp
        status: 'Pending', // Initial status
      };

      // Save the order to Firestore
      await addDoc(collection(db, 'orders'), orderData); // Assuming an "orders" collection

      alert('Siparişiniz alındı! Teşekkür ederiz.');
      clearCart();
      navigate(`/thank-you/${tableId}`);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Sipariş gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-4">Sipariş verebilmek için sepetinize ürün eklemelisiniz.</p>
          <button
            onClick={() => navigate(`/menu/${tableId}`)}
            className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            Menüye Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Siparişi Tamamla</h1>

        {tableId && (
          <div className="mb-4 p-3 bg-amber-50 rounded-md">
            <p className="text-amber-700 font-medium">Masa: {tableId}</p>
          </div>
        )}

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Sipariş Özeti</h2>
          <div className="border-t border-b border-gray-200 py-4 divide-y divide-gray-200">
            {items.map(item => (
              <div key={item.id} className="py-3 flex justify-between">
                <div className="flex items-center">
                  <span className="text-gray-800">{item.quantity} x {item.name}</span>
                </div>
                <span className="text-gray-800 font-medium">{item.price * item.quantity} ₺</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center text-xl font-bold">
            <span>Toplam:</span>
            <span>{getTotalPrice()} ₺</span>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Sipariş Notu</h2>
          <textarea
            id="order-note" // Added id to easily get the value
            className="w-full border border-gray-300 rounded-md p-3 h-24 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Özel istekleriniz varsa buraya yazabilirsiniz..."
          ></textarea>
        </div>

        <button
          onClick={handleSubmitOrder}
          className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-md transition-colors text-lg font-medium"
        >
          Siparişi Onayla
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
