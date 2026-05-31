import { Suspense } from "react";
import PaymentResultClient from "./payment-result-client";

export default function PaymentResultPage() {
  return (
    <Suspense fallback={null}>
      <PaymentResultClient />
    </Suspense>
  );
}
