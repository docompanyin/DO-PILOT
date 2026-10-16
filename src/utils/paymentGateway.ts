/**
 * Payment Gateway Service (Razorpay Standard Integration)
 * Secure client-side invocation with server-side/env configuration check.
 * If credentials are not configured, does NOT pretend payments are functional.
 */

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export interface PaymentGatewayConfig {
  keyId?: string;
  isConfigured: boolean;
  provider: 'razorpay';
}

export const getPaymentGatewayConfig = (): PaymentGatewayConfig => {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  return {
    keyId: keyId || undefined,
    isConfigured: Boolean(keyId && keyId.trim().length > 0 && !keyId.includes('your_')),
    provider: 'razorpay'
  };
};

/**
 * Load Razorpay Checkout SDK dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export interface ProcessPaymentOptions {
  amountInRupees: number;
  courseId: string;
  courseName: string;
  studentId?: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  onSuccess: (paymentDetails: { paymentId: string; orderId?: string; signature?: string }) => void;
  onDismiss?: () => void;
  onError?: (errorMessage: string) => void;
}

/**
 * Open Razorpay payment gateway
 */
export const processPaymentWithGateway = async (
  options: ProcessPaymentOptions
): Promise<{ initiated: boolean; error?: string }> => {
  const config = getPaymentGatewayConfig();

  if (!config.isConfigured || !config.keyId) {
    const errorMsg =
      'Direct card gateway is undergoing maintenance. Please proceed with UPI QR code or enter your coupon code.';
    if (options.onError) {
      options.onError(errorMsg);
    }
    return { initiated: false, error: errorMsg };
  }

  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded || !window.Razorpay) {
    const errorMsg = 'Failed to load Razorpay payment SDK. Please check your internet connection.';
    if (options.onError) {
      options.onError(errorMsg);
    }
    return { initiated: false, error: errorMsg };
  }

  try {
    const rzpOptions = {
      key: config.keyId,
      amount: Math.round(options.amountInRupees * 100), // Amount in paise
      currency: 'INR',
      name: 'DO PILOT',
      description: options.courseName,
      image: 'https://res.cloudinary.com/ufo0zltq/image/upload/v1786197046/Do_PNG_ssyhu1.png',
      notes: {
        course_id: String(options.courseId),
        course_name: String(options.courseName),
        student_id: String(options.studentId || ''),
        student_name: String(options.studentName),
        student_email: String(options.studentEmail),
        student_phone: String(options.studentPhone || '')
      },
      prefill: {
        name: options.studentName,
        email: options.studentEmail,
        contact: options.studentPhone || ''
      },
      handler: (response: any) => {
        if (response && response.razorpay_payment_id) {
          options.onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          });
        } else {
          if (options.onError) {
            options.onError('Payment verification failed. No transaction reference returned.');
          }
        }
      },
      theme: {
        color: '#00ff9d'
      },
      modal: {
        ondismiss: () => {
          if (options.onDismiss) {
            options.onDismiss();
          }
        }
      }
    };

    const rzp = new window.Razorpay(rzpOptions);
    rzp.open();
    return { initiated: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'Error launching payment window.';
    if (options.onError) {
      options.onError(errorMsg);
    }
    return { initiated: false, error: errorMsg };
  }
};
