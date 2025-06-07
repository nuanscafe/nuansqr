import React from 'react';
import { useParams } from 'react-router-dom';

const ThankYouPage: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Siparişiniz Alındı!</h1>
        
        <p className="text-gray-600 mb-6">
          Siparişiniz başarıyla alındı ve hazırlanmaya başlandı. Kısa süre içinde masanıza servis edilecektir.
        </p>
        
        {tableId && (
          <div className="mb-6 p-3 bg-amber-50 rounded-md">
            <p className="text-amber-700 font-medium">Masa: {tableId}</p>
          </div>
        )}
        
        <p className="text-sm text-gray-500">
          Bizi tercih ettiğiniz için teşekkür ederiz.
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage;
