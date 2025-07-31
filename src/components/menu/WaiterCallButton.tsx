import React, { useState } from 'react';
import { createWaiterCall } from '../../data/menuData';

interface WaiterCallButtonProps {
  tableId: string;
}

const WaiterCallButton: React.FC<WaiterCallButtonProps> = ({ tableId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCallTime, setLastCallTime] = useState<number | null>(null);

  const handleWaiterCall = async () => {
    // Prevent spam calls (minimum 30 seconds between calls)
    const now = Date.now();
    if (lastCallTime && now - lastCallTime < 30000) {
      alert('Lütfen 30 saniye bekleyip tekrar deneyin.');
      return;
    }

    setIsLoading(true);
    try {
      await createWaiterCall(tableId, 'Müşteri garson çağırdı');
      setLastCallTime(now);
      alert('Garson çağrısı gönderildi! Garson en kısa sürede gelecektir.');
    } catch (error) {
      console.error('Garson çağrısı gönderilirken hata oluştu:', error);
      alert('Garson çağrısı gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleWaiterCall}
      disabled={isLoading}
      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
        isLoading
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
    >
      {isLoading ? 'Gönderiliyor...' : '🔔 Garson Çağır'}
    </button>
  );
};

export default WaiterCallButton;