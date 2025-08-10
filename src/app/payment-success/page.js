import { Suspense } from 'react';
import PaymentSuccessPage from './PaymentSuccessPage.js';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}