import React from 'react';
import { Button } from './ui/button';

const OrderConfirmationPage: React.FC = () => { 
  const orderNumber = '#2343345646423';
 
  const CheckmarkIcon: React.FC = () => (
    <div className='pb-10'>
      <svg width="90" height="90" viewBox="-2 -2 104 104">
        <polygon 
          points="50,0 93.3,25 93.3,75 50,100 6.7,75 6.7,25" 
          fill="#28a745" 
        />
        <path 
          d="M30 52 L45 67 L75 37" 
          stroke="white" 
          strokeWidth="8" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
  

  const ProgressBar: React.FC = () => {
    const steps = ['Cart', 'Payment', 'Confirmation'];
    return (
      <div className='w-full max-w-[600px] flex justify-between relative mb-15'>
        <div className='absolute top-[70%] left-[18px] right-[48px] h-[6px]  bg-[#3b4a6b] z-10'></div>
        {steps.map((label) => (
          <div key={label} className='flex flex-col items-center relative z-20 p-0 10px'>
            <div className='text-gray-500 text-sm'>{label}</div>
            <div className='w-[20px] h-[20px] rounded-full bg-[#3b4a6b]'></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      
      <ProgressBar />
      
      <main className='flex flex-col items-center justify-center'>
        <CheckmarkIcon />
        <h2 className='text-2xl font-bold p-1 '>{orderNumber}</h2>
        <p className='text-lg font-bold p-1'>ORDER CONFIRMATION RECEIVED</p>
        <p className='text-gray-500 max-w-[450px] text-center mb-4' >
          Your Order has been received, please check on the
          dashboard for the status of your order.
        </p>
        <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={() => {
              window.location.href = '/dashboard';
            }}
        >
          Dashboard
        </Button>
      </main>
    </div>
  );
};

export default OrderConfirmationPage;