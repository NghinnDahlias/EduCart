"use client";

import HomeNavbar from "@/components/HomeNavbar";
import { api } from "@/lib/api";
import { ArrowLeft, BadgeCheck, CreditCard, Loader2, ShieldCheck, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type GatewayMethod = "MoMo" | "VNPay";

function getGatewayTheme(method: GatewayMethod) {
  if (method === "MoMo") {
    return {
      badge: "bg-pink-100 text-pink-700",
      card: "from-pink-600 via-fuchsia-500 to-rose-500",
      ring: "ring-pink-100",
      button: "bg-pink-600 hover:bg-pink-700",
      icon: <Wallet className="h-6 w-6" />,
      label: "Vi MoMo Sandbox",
    };
  }

  return {
    badge: "bg-sky-100 text-sky-700",
    card: "from-sky-700 via-blue-600 to-cyan-500",
    ring: "ring-sky-100",
    button: "bg-sky-600 hover:bg-sky-700",
    icon: <CreditCard className="h-6 w-6" />,
    label: "VNPay Sandbox",
  };
}

export default function PaymentGatewayClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState<null | boolean>(null);

  const method = (searchParams.get("method") || "MoMo") as GatewayMethod;
  const orderId = Number(searchParams.get("orderId"));
  const amount = Number(searchParams.get("amount") || 0);
  const title = searchParams.get("title") || "Don hang EduCart";

  const theme = useMemo(() => getGatewayTheme(method), [method]);
  const hasValidParams = Number.isFinite(orderId) && orderId > 0 && Number.isFinite(amount);

  const handleSimulate = async (success: boolean) => {
    if (!hasValidParams) return;
    setIsSubmitting(success);

    try {
      await api.post(
        "/payments/simulate",
        {
          orderId,
          method,
          success,
        },
        true,
      );

      const params = new URLSearchParams({
        method,
        orderId: String(orderId),
        status: success ? "success" : "failed",
        amount: String(amount),
      });
      router.push(`/payment-result?${params.toString()}`);
    } catch (error: any) {
      alert(error?.message || "Khong the mo phong ket qua thanh toan.");
      setIsSubmitting(null);
    }
  };

  if (!hasValidParams) {
    return (
      <main className="min-h-screen bg-slate-50">
        <HomeNavbar />
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900">Thieu thong tin cong thanh toan</h1>
            <p className="mt-3 text-sm text-slate-500">
              Vui long quay lai checkout va tao giao dich moi.
            </p>
            <Link
              href="/orders"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Ve danh sach don hang
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <HomeNavbar />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className={`overflow-hidden rounded-[32px] bg-gradient-to-br ${theme.card} p-8 text-white shadow-xl`}>
          <div className="flex items-center justify-between">
            <div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${theme.badge}`}>
                Sandbox Gateway
              </span>
              <h1 className="mt-5 text-4xl font-bold">{theme.label}</h1>
              <p className="mt-3 max-w-lg text-sm text-white/80">
                Man hinh mo phong cong thanh toan phuc vu demo. Ket qua thanh cong that bai se duoc gui vao backend va cap nhat trong CSDL.
              </p>
            </div>
            <div className="rounded-3xl bg-white/15 p-4 backdrop-blur-sm">{theme.icon}</div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.22em] text-white/70">Ma don hang</p>
              <p className="mt-2 text-2xl font-bold">#{orderId}</p>
            </div>
            <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.22em] text-white/70">Tong thanh toan</p>
              <p className="mt-2 text-2xl font-bold">{amount.toLocaleString("vi-VN")} VND</p>
            </div>
          </div>

          <div className="mt-4 rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.22em] text-white/70">Noi dung</p>
            <p className="mt-2 text-lg font-semibold">{title}</p>
          </div>
        </section>

        <section className={`rounded-[32px] bg-white p-8 shadow-sm ring-1 ${theme.ring}`}>
          <div className="flex items-center gap-3 text-slate-900">
            <BadgeCheck className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Xac nhan ket qua thanh toan</h2>
          </div>

          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <p>
              Man hinh nay dong vai tro cong thanh toan sandbox. Khi bam mot trong hai nut ben duoi, frontend se goi API <code>/api/payments/simulate</code>.
            </p>
            <p>
              Backend se tao webhook hop le, verify chu ky, cap nhat <code>PaymentTransactions</code>, sau do phat su kien de doi trang thai don hang va ton kho.
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-semibold text-slate-900">Demo an toan cho bao cao</p>
                <p className="mt-1 text-sm text-slate-500">
                  Khong goi cong thanh toan that. Luong xu ly van di qua service, strategy va observer nhu gateway thuc te.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3">
            <button
              onClick={() => handleSimulate(true)}
              disabled={isSubmitting !== null}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold text-white transition ${theme.button} disabled:cursor-not-allowed disabled:opacity-70`}
            >
              {isSubmitting === true ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
              Mo phong thanh toan thanh cong
            </button>

            <button
              onClick={() => handleSimulate(false)}
              disabled={isSubmitting !== null}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting === false ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowLeft className="h-4 w-4" />}
              Mo phong thanh toan that bai
            </button>

            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
            >
              Xem don hang ma khong cap nhat thanh toan
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
