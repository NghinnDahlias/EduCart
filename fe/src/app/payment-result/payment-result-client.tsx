"use client";

import HomeNavbar from "@/components/HomeNavbar";
import { AlertTriangle, BadgeCheck, CreditCard, ShieldAlert, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentResultClient() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "failed";
  const orderId = searchParams.get("orderId") || "";
  const method = searchParams.get("method") || "Payment";
  const amount = Number(searchParams.get("amount") || 0);
  const succeeded = status === "success";

  return (
    <main className="min-h-screen bg-slate-50">
      <HomeNavbar />

      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-[32px] bg-white p-10 shadow-sm ring-1 ring-slate-100">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
              succeeded ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
            }`}
          >
            {succeeded ? <BadgeCheck className="h-10 w-10" /> : <AlertTriangle className="h-10 w-10" />}
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{method}</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              {succeeded ? "Thanh toán thành công" : "Thanh toán chưa thành công"}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {succeeded
                ? "Hệ thống đã ghi nhận giao dịch, cập nhật trạng thái thanh toán và lưu thay đổi vào CSDL."
                : "Hệ thống đã ghi nhận giao dịch thất bại. Đơn hàng vẫn được giữ trong thời hạn để bạn có thể thanh toán lại sau."}
            </p>
          </div>

          <div className="mt-10 grid gap-4 rounded-3xl bg-slate-50 p-6 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Đơn hàng</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">#{orderId || "--"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cổng thanh toán</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{method}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Số tiền</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{amount.toLocaleString("vi-VN")} VND</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold text-slate-900">Lưu ý an toàn giao dịch</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Không chuyển tiền trước cho bất kỳ cá nhân nào ngoài luồng thanh toán của hệ thống. EduCart chỉ ghi nhận giao dịch khi thanh toán đi qua nền tảng để tránh lừa đảo.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3">
            <Link
              href={orderId ? `/orders/${orderId}` : "/orders"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <CreditCard className="h-4 w-4" />
              Xem chi tiết đơn hàng
            </Link>

            <Link
              href="/products"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ShoppingBag className="h-4 w-4" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
