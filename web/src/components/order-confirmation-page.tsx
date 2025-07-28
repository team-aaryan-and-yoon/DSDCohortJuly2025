import React from 'react';
import { Button } from './ui/button';

type Styles = {
  [key: string]: React.CSSProperties;
};


const OrderConfirmationPage: React.FC = () => { 
 
  const orderNumber = '#2343345646423';


  const styles: Styles = {
    page: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      minHeight: '100vh',
      boxSizing: 'border-box',
    },
    header: {
      width: '100%',
      maxWidth: '800px',
      marginBottom: '40px',
      color: '#343a40',
      fontSize: '1rem',
      fontWeight: 'normal',
    },
    progressBarContainer: {
      width: '100%',
      maxWidth: '600px',
      display: 'flex',
      justifyContent: 'space-between',
      position: 'relative',
      marginBottom: '80px',
    },
    progressLine: {
      position: 'absolute',
      top: '80%',
      left: 18,
      right: 48,
      transform: 'translateY(-50%)',
      height: '4px',
      backgroundColor: '#3b4a6b',
      zIndex: 1,
    },
    progressStep: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      zIndex: 2,
    //   backgroundColor: '#f7f8fa', // Same as page background to "cut through" the line
      padding: '0 10px',
    },
    progressCircle: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      backgroundColor: '#3b4a6b',
    },
    progressLabel: {
      marginTop: '12px',
      color: '#495057',
      fontSize: '1rem',
    },
    confirmationContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '20px',
    },
    iconWrapper: {
      marginBottom: '30px',
    },
    orderNumber: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#212529',
      margin: '0 0 10px 0',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#343a40',
      letterSpacing: '1px',
      margin: '0 0 15px 0',
      textTransform: 'uppercase',
    },
    message: {
      color: '#6c757d',
      fontSize: '1rem',
      maxWidth: '450px',
      lineHeight: '1.5',
      marginBottom: '30px',
    },
  };


  const CheckmarkIcon: React.FC = () => (
    <div style={styles.iconWrapper}>
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
      <div style={styles.progressBarContainer}>
        <div style={styles.progressLine}></div>
        {steps.map((label) => (
          <div key={label} style={styles.progressStep}>
            <div style={styles.progressLabel}>{label}</div>
            <div style={styles.progressCircle}></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={styles.page}>
      
      <ProgressBar />
      
      <main style={styles.confirmationContainer}>
        <CheckmarkIcon />
        <h2 style={styles.orderNumber}>{orderNumber}</h2>
        <p style={styles.title}>ORDER CONFIRMATION RECEIVED</p>
        <p style={styles.message}>
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