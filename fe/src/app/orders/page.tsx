"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Package,
  Plus,
  ShoppingBag,
  Store,
  Truck,
  XCircle,
} from "lucide-react";

import HomeNavbar from "@/components/HomeNavbar";
import { useLocale } from "@/components/locale-provider";
import { api } from "@/lib/api";

type OrderTab = "orders" | "sales" | "products";

interface ApiOrder {
  OrderID: number;
  BuyerID: number;
  SellerID: number;
  OrderType: "Buy" | "Rent";
  LifecycleState: string;
  TotalAmount: number | null;
  CreatedAt: string;
  PaymentDueAt?: string;
  BuyerName: string;
  SellerName: string;
  PrimaryTitle?: string | null;
  CanRetryPayment?: boolean;
}

interface ApiProduct {
  ProductID: number;
  Title: string;
  Price: number | null;
  Stock: number;
  IsForRent: boolean;
  Status: string;
}

interface ApiUser {
  UserID: number;
}

const ordersDictionary = {
  vi: {
    center: "Trung tâm đơn hàng",
    postNew: "Đăng sản phẩm mới",
    buyerTab: "Đơn mua của tôi",
    sellerTab: "Đơn bán của tôi",
    productTab: "Sản phẩm của tôi",
    orderPrefix: "Đơn hàng",
    buyOrder: "Đơn mua",
    sellOrder: "Đơn bán",
    seller: "Người bán",
    buyer: "Người mua",
    createdAt: "Tạo lúc",
    viewDetail: "Xem chi tiết",
    repay: "Thanh toán lại",
    cancel: "Hủy đơn hàng",
    returnOrder: "Trả hàng",
    confirmOrder: "Xác nhận đơn hàng",
    review: "Đánh giá",
    shipConfirm: "Xác nhận đã chuyển cho chuyển phát",
    receiveBack: "Đã nhận lại sách",
    refundDeposit: "Hoàn cọc",
    editProduct: "Sửa sản phẩm",
    inventory: "Tồn kho",
    status: "Trạng thái",
    noBuy: "Bạn chưa có đơn mua nào",
    noSell: "Bạn chưa có đơn bán nào",
    noProduct: "Bạn chưa đăng sản phẩm nào",
    browseBooks: "Xem danh mục sách",
    loading: "Đang tải dữ liệu...",
  },
  en: {
    center: "Orders Center",
    postNew: "Post new listing",
    buyerTab: "My purchases",
    sellerTab: "My sales",
    productTab: "My listings",
    orderPrefix: "Order",
    buyOrder: "Purchase order",
    sellOrder: "Sales order",
    seller: "Seller",
    buyer: "Buyer",
    createdAt: "Created at",
    viewDetail: "View detail",
    repay: "Pay again",
    cancel: "Cancel order",
    returnOrder: "Return order",
    confirmOrder: "Confirm delivery",
    review: "Review",
    shipConfirm: "Confirm handed to carrier",
    receiveBack: "Book received back",
    refundDeposit: "Refund deposit",
    editProduct: "Edit listing",
    inventory: "Stock",
    status: "Status",
    noBuy: "You have no purchase orders yet",
    noSell: "You have no sales orders yet",
    noProduct: "You have not posted any listing yet",
    browseBooks: "Browse books",
    loading: "Loading data...",
  },
} as const;

function formatMoney(value: number | null | undefined) {
  if (value == null) return "--";
  return `${value.toLocaleString("vi-VN")} đ`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("vi-VN");
}

function getPaymentCountdown(order: ApiOrder) {
  if (order.LifecycleState !== "PendingPayment" || !order.PaymentDueAt) return null;
  const dueAt = new Date(order.PaymentDueAt).getTime();
  const remaining = dueAt - Date.now();
  if (remaining <= 0) return "Đơn đã hết thời hạn thanh toán.";
  const totalMinutes = Math.floor(remaining / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `Còn ${hours} giờ ${minutes} phút để thanh toán lại`;
}

function badgeClass(tone: string) {
  switch (tone) {
    case "blue":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "green":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "amber":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "orange":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "red":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function getBuyerStatus(order: ApiOrder) {
  switch (order.LifecycleState) {
    case "PendingPayment":
      return { label: "Chờ thanh toán", tone: "amber" };
    case "Paid":
      return { label: "Người bán đang chuẩn bị hàng", tone: "blue" };
    case "Delivering":
      return { label: "Đã gửi cho chuyển phát", tone: "blue" };
    case "ActiveRental":
      return { label: "Đang trong thời gian thuê", tone: "orange" };
    case "Completed":
      return { label: "Đã giao, đã nhận", tone: "green" };
    case "ReturnRequested":
      return { label: "Đang chờ xử lý trả hàng", tone: "amber" };
    case "Returned":
      return { label: "Đã trả hàng", tone: "gray" };
    case "DepositRefunded":
      return { label: "Đã hoàn cọc", tone: "green" };
    case "Cancelled":
      return { label: "Đã hủy", tone: "red" };
    default:
      return { label: order.LifecycleState, tone: "gray" };
  }
}

function getSellerStatus(order: ApiOrder) {
  switch (order.LifecycleState) {
    case "PendingPayment":
      return { label: "Chờ người mua thanh toán", tone: "amber" };
    case "Paid":
      return { label: "Đã nhận đơn", tone: "blue" };
    case "Delivering":
      return { label: "Đã chuyển cho chuyển phát", tone: "blue" };
    case "ActiveRental":
      return { label: "Người thuê đang giữ sách", tone: "orange" };
    case "Completed":
      return { label: "Đã giao xong", tone: "green" };
    case "ReturnRequested":
      return { label: "Người mua đang yêu cầu trả hàng", tone: "amber" };
    case "Returned":
      return { label: "Đã nhận lại hàng", tone: "gray" };
    case "DepositRefunded":
      return { label: "Đã hoàn cọc", tone: "green" };
    case "Cancelled":
      return { label: "Đã hủy", tone: "red" };
    default:
      return { label: order.LifecycleState, tone: "gray" };
  }
}

function getProgressSteps(order: ApiOrder, role: "buyer" | "seller") {
  const labels = [
    "Chờ thanh toán",
    role === "seller" ? "Đã nhận đơn" : "Đã thanh toán",
    role === "seller" ? "Đã chuyển cho chuyển phát" : "Đã gửi cho chuyển phát",
    role === "seller" ? "Xác nhận đã giao hàng" : "Đã giao / đã nhận",
  ];

  const stateToIndex: Record<string, number> = {
    PendingPayment: 0,
    Paid: 1,
    Delivering: 2,
    Completed: 3,
    ActiveRental: 3,
    ReturnRequested: 3,
    Returned: 3,
    DepositRefunded: 3,
  };

  const activeIndex = stateToIndex[order.LifecycleState] ?? -1;

  return labels.map((label, index) => ({
    label,
    done: activeIndex >= index,
    current: activeIndex === index,
  }));
}

function ProgressBar({ order, role }: { order: ApiOrder; role: "buyer" | "seller" }) {
  const steps = getProgressSteps(order, role);

  if (order.LifecycleState === "Cancelled") {
    return (
      <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
        Đơn hàng đã bị hủy.
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-3 md:grid-cols-4">
      {steps.map((step, index) => (
        <div
          key={step.label}
          className={`rounded-2xl border px-4 py-3 ${
            step.done
              ? "border-blue-200 bg-blue-50"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                step.done ? "bg-blue-600 text-white" : "bg-white text-gray-500"
              }`}
            >
              {index + 1}
            </span>
            <p
              className={`text-sm font-semibold ${
                step.done ? "text-blue-700" : "text-gray-500"
              }`}
            >
              {step.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function BuyerOrderCard({
  order,
  onRefresh,
  locale,
}: {
  order: ApiOrder;
  onRefresh: () => Promise<void>;
  locale: "vi" | "en";
}) {
  const t = ordersDictionary[locale];
  const router = useRouter();
  const status = getBuyerStatus(order);
  const countdown = getPaymentCountdown(order);
  const titleSuffix = order.PrimaryTitle ? ` - ${order.PrimaryTitle}` : "";
  const canCancel = order.LifecycleState === "PendingPayment" || order.LifecycleState === "Paid";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-500">{t.buyOrder}</p>
          <h3 className="mt-1 text-xl font-bold text-slate-900">
            {t.orderPrefix} #{order.OrderID}
            {titleSuffix}
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            {t.seller}: <span className="font-semibold text-slate-900">{order.SellerName}</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">{t.createdAt} {formatDate(order.CreatedAt)}</p>
          {countdown ? <p className="mt-2 text-sm font-semibold text-amber-700">{countdown}</p> : null}
        </div>
        <div className="text-right">
          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(status.tone)}`}>
            {status.label}
          </span>
          <p className="mt-3 text-2xl font-bold text-slate-900">{formatMoney(order.TotalAmount)}</p>
        </div>
      </div>

      <ProgressBar order={order} role="buyer" />

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/orders/${order.OrderID}`}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-gray-50"
        >
          {t.viewDetail}
          <ChevronRight className="h-4 w-4" />
        </Link>

        {order.LifecycleState === "PendingPayment" ? (
          <Link
            href={`/orders/${order.OrderID}`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <CreditCard className="h-4 w-4" />
            {t.repay}
          </Link>
        ) : null}

        {canCancel ? (
          <button
            onClick={async () => {
              if (!window.confirm("Hủy đơn hàng này?")) return;
              await api.post(`/orders/${order.OrderID}/transitions`, { event: "onCancel" }, true);
              await onRefresh();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4" />
            {t.cancel}
          </button>
        ) : null}

        {order.LifecycleState === "Delivering" ? (
          <>
            <button
              onClick={() => router.push(`/review?orderId=${order.OrderID}`)}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50"
            >
                      {t.returnOrder}
            </button>
            <button
              onClick={async () => {
                await api.post(`/orders/${order.OrderID}/transitions`, { event: "onDeliver" }, true);
                await onRefresh();
                router.push(`/review?orderId=${order.OrderID}`);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              {t.confirmOrder}
            </button>
          </>
        ) : null}

        {(order.LifecycleState === "Completed" || order.LifecycleState === "ActiveRental") ? (
          <button
            onClick={() => router.push(`/review?orderId=${order.OrderID}`)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-gray-50"
          >
            {t.review}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function SellerOrderCard({
  order,
  onRefresh,
  locale,
}: {
  order: ApiOrder;
  onRefresh: () => Promise<void>;
  locale: "vi" | "en";
}) {
  const t = ordersDictionary[locale];
  const status = getSellerStatus(order);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-500">{t.sellOrder}</p>
          <h3 className="mt-1 text-xl font-bold text-slate-900">
            {t.orderPrefix} #{order.OrderID}
            {order.PrimaryTitle ? ` - ${order.PrimaryTitle}` : ""}
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            {t.buyer}: <span className="font-semibold text-slate-900">{order.BuyerName}</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">{t.createdAt} {formatDate(order.CreatedAt)}</p>
        </div>
        <div className="text-right">
          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(status.tone)}`}>
            {status.label}
          </span>
          <p className="mt-3 text-2xl font-bold text-slate-900">{formatMoney(order.TotalAmount)}</p>
        </div>
      </div>

      <ProgressBar order={order} role="seller" />

      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/orders/${order.OrderID}`}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-gray-50"
        >
          {t.viewDetail}
          <ChevronRight className="h-4 w-4" />
        </Link>

        {order.LifecycleState === "Paid" ? (
          <button
            onClick={async () => {
              await api.post(`/orders/${order.OrderID}/transitions`, { event: "onShip" }, true);
              await onRefresh();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Truck className="h-4 w-4" />
            {t.shipConfirm}
          </button>
        ) : null}

        {order.LifecycleState === "ActiveRental" ? (
          <button
            onClick={async () => {
              await api.post(`/orders/${order.OrderID}/transitions`, { event: "onComplete" }, true);
              await onRefresh();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            {t.receiveBack}
          </button>
        ) : null}

        {order.LifecycleState === "ReturnRequested" ? (
          <>
            <button
              onClick={async () => {
                await api.post(`/orders/${order.OrderID}/transitions`, { event: "onApproveReturn" }, true);
                await onRefresh();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Đồng ý trả hàng
            </button>
            <button
              onClick={async () => {
                await api.post(`/orders/${order.OrderID}/transitions`, { event: "onRejectReturn" }, true);
                await onRefresh();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
            >
              Từ chối
            </button>
          </>
        ) : null}

        {order.LifecycleState === "Completed" && order.OrderType === "Rent" ? (
          <button
            onClick={async () => {
              await api.post(`/orders/${order.OrderID}/transitions`, { event: "onRefundDeposit" }, true);
              await onRefresh();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50"
          >
            {t.refundDeposit}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: ApiProduct }) {
  const { locale } = useLocale();
  const t = ordersDictionary[locale];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-slate-900">{product.Title}</p>
          <p className="mt-2 text-sm text-gray-500">
            #{product.ProductID} · {product.IsForRent ? "Cho thuê" : "Bán đứt"}
          </p>
          <p className="mt-1 text-sm text-gray-500">{t.status}: {product.Status}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-slate-900">{formatMoney(product.Price)}</p>
          <p className="mt-2 text-sm text-gray-500">{t.inventory}: {product.Stock}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <Link
          href={`/post-product?editId=${product.ProductID}`}
          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-gray-50"
        >
          {t.editProduct}
        </Link>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { locale } = useLocale();
  const t = ordersDictionary[locale];
  const [activeTab, setActiveTab] = useState<OrderTab>("orders");
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [sales, setSales] = useState<ApiOrder[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = useMemo(
    () => [
      { key: "orders" as const, label: t.buyerTab, icon: ShoppingBag },
      { key: "sales" as const, label: t.sellerTab, icon: Store },
      { key: "products" as const, label: t.productTab, icon: BookOpen },
    ],
    [t],
  );

  const loadOrders = async () => {
    const data = await api.get<{ ok: boolean; orders: ApiOrder[] }>("/orders", true);
    setOrders(data.orders ?? []);
  };

  const loadSales = async () => {
    const data = await api.get<{ ok: boolean; orders: ApiOrder[] }>("/orders?role=seller", true);
    setSales(data.orders ?? []);
  };

  const loadProducts = async (nextUser?: ApiUser | null) => {
    const currentUser = nextUser ?? user;
    if (!currentUser?.UserID) {
      setProducts([]);
      return;
    }
    const data = await api.get<{ ok: boolean; products: ApiProduct[] }>(`/products?sellerId=${currentUser.UserID}`);
    setProducts(data.products ?? []);
  };

  useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true);
      try {
        const me = await api.get<{ ok: boolean; user: ApiUser }>("/users/me", true);
        setUser(me.user);
        await Promise.all([loadOrders(), loadSales(), loadProducts(me.user)]);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap().catch(() => setIsLoading(false));
  }, []);

  const refreshAll = async () => {
    setIsLoading(true);
    try {
      await Promise.all([loadOrders(), loadSales(), loadProducts()]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <HomeNavbar />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">{t.center}</h1>
          </div>
          <Link
            href="/post-product"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            {t.postNew}
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-white text-slate-700 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {isLoading ? <div className="text-center text-gray-500">{t.loading}</div> : null}

          {!isLoading && activeTab === "orders" ? (
            orders.length > 0 ? (
              <div className="space-y-5">
                {orders.map((order) => (
                  <BuyerOrderCard key={order.OrderID} order={order} onRefresh={refreshAll} locale={locale} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                <Package className="mx-auto h-12 w-12 text-blue-600" />
                <h2 className="mt-4 text-2xl font-bold text-slate-900">{t.noBuy}</h2>
                <p className="mt-2 text-gray-600">Khi tạo đơn, hệ thống sẽ giữ sách trong thời hạn thanh toán để bạn hoàn tất giao dịch.</p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {t.browseBooks}
                </Link>
              </div>
            )
          ) : null}

          {!isLoading && activeTab === "sales" ? (
            sales.length > 0 ? (
              <div className="space-y-5">
                {sales.map((order) => (
                  <SellerOrderCard key={order.OrderID} order={order} onRefresh={refreshAll} locale={locale} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                <Store className="mx-auto h-12 w-12 text-blue-600" />
                <h2 className="mt-4 text-2xl font-bold text-slate-900">{t.noSell}</h2>
                <p className="mt-2 text-gray-600">Khi người mua thanh toán xong, đơn sẽ xuất hiện ở đây để bạn xử lý giao hàng.</p>
              </div>
            )
          ) : null}

          {!isLoading && activeTab === "products" ? (
            products.length > 0 ? (
              <div className="space-y-5">
                {products.map((product) => (
                  <ProductCard key={product.ProductID} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                <BookOpen className="mx-auto h-12 w-12 text-blue-600" />
                <h2 className="mt-4 text-2xl font-bold text-slate-900">{t.noProduct}</h2>
                <p className="mt-2 text-gray-600">Bạn có thể bán hoặc cho thuê sách từ chính tài khoản này.</p>
              </div>
            )
          ) : null}
        </div>
      </div>
    </main>
  );
}
