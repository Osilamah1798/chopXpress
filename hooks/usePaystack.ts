// FIX: Corrected import casing from PAYSTACK_PUBLIC_key to PAYSTACK_PUBLIC_KEY
import { PAYSTACK_PUBLIC_KEY } from '../env';

interface PaystackProps {
  email: string;
  amount: number; // Amount in Kobo
  onSuccess: (response: any) => void;
  onClose: () => void;
}

export const usePaystack = () => {

  const initializePayment = ({ email, amount, onSuccess, onClose }: PaystackProps) => {
    if (!PAYSTACK_PUBLIC_KEY || PAYSTACK_PUBLIC_KEY === 'pk_test_...') {
        alert("Paystack Public Key is not configured. Please check your environment variables.");
        return;
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: email,
      amount: amount,
      ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference
      onClose: onClose,
      callback: onSuccess,
    });
    
    handler.openIframe();
  };
  
  return { initializePayment };
};
