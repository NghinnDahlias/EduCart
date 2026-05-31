import { Suspense } from "react";
import PaymentGatewayClient from "./payment-gateway-client";

export default function PaymentGatewayPage() {
  return (
    <Suspense fallback={null}>
      <PaymentGatewayClient />
    </Suspense>
  );
}
