import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  GraduationCap,
  ShoppingBag,
  MapPin,
  Truck,
  Tag,
  ChevronRight,
  ShieldCheck,
  Info,
  Minus,
  CheckCheck,
  ArrowLeft,
  Sparkles,
  Package,
} from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Navbar } from "../components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type TxType = "TO BUY" | "TO RENT";

interface CartItem {
  id: string;
  title: string;
  subjectTag: string;
  condition: string;
  transactionType: TxType;
  price: number;
  priceSuffix?: string;
  image: string;
  sellerId: string;
}

interface Seller {
  id: string;
  name: string;
  university: string;
  initials: string;
  color: string;
}

type DeliveryOption = "meetup" | "cod";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SELLERS: Seller[] = [
  { id: "s1", name: "Phuong Linh", university: "HCMUT Student", initials: "PL", color: "bg-purple-500" },
  { id: "s2", name: "Duc Anh",     university: "HCMUT Student", initials: "DA", color: "bg-blue-500" },
  { id: "s3", name: "Quoc Huy",    university: "HCMUT Student", initials: "QH", color: "bg-teal-500" },
];

const INITIAL_ITEMS: CartItem[] = [
  {
    id: "i1",
    title: "Lab Coat – Large Size, Barely Used",
    subjectTag: "Chemistry Lab",
    condition: "New",
    transactionType: "TO RENT",
    price: 15,
    priceSuffix: "/ Semester",
    image: "https://images.unsplash.com/photo-1712215544003-af10130f8eb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    sellerId: "s1",
  },
  {
    id: "i2",
    title: "Engineering Drawing Kit – Full Set",
    subjectTag: "Civil Engineering 201",
    condition: "Used – Good",
    transactionType: "TO BUY",
    price: 30,
    image: "https://images.unsplash.com/photo-1624295873450-43bb69a5ee54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    sellerId: "s2",
  },
  {
    id: "i3",
    title: "Calculus Textbook – 90% New",
    subjectTag: "Calculus 101",
    condition: "Used – Like New",
    transactionType: "TO BUY",
    price: 45,
    image: "https://images.unsplash.com/photo-1754304342490-2fa390075d02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    sellerId: "s2",
  },
  {
    id: "i4",
    title: "TI-84 Plus Graphing Calculator",
    subjectTag: "Math 101",
    condition: "Used – Good",
    transactionType: "TO BUY",
    price: 55,
    image: "https://images.unsplash.com/photo-1761546571631-a4d61b55cd2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    sellerId: "s3",
  },
  {
    id: "i5",
    title: "Organic Chemistry – Clayden Edition",
    subjectTag: "Chemistry 201",
    condition: "New",
    transactionType: "TO RENT",
    price: 25,
    priceSuffix: "/ Semester",
    image: "https://images.unsplash.com/photo-1616291969697-9f66ae119919?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    sellerId: "s3",
  },
];

const SERVICE_FEE_RATE = 0.05;
const COD_FEE = 2.0;

// ─── Custom Checkbox ──────────────────────────────────────────────────────────

type CheckState = "checked" | "unchecked" | "indeterminate";

function CustomCheckbox({
  state,
  onChange,
  size = "md",
}: {
  state: CheckState;
  onChange: () => void;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const radius = size === "sm" ? "rounded" : "rounded-md";
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      className={`${dim} ${radius} border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
        state === "checked"
          ? "bg-blue-600 border-blue-600"
          : state === "indeterminate"
          ? "bg-blue-100 border-blue-400"
          : "bg-white border-gray-300 hover:border-blue-400"
      }`}
    >
      {state === "checked" && (
        <svg className={`${size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {state === "indeterminate" && (
        <Minus className={`${size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} text-blue-600`} strokeWidth={3} />
      )}
    </button>
  );
}

// ─── Transaction Badge ────────────────────────────────────────────────────────

function TxBadge({ type }: { type: TxType }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${
        type === "TO BUY"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {type === "TO BUY" ? <ShoppingBag className="w-3 h-3" /> : <Tag className="w-3 h-3" />}
      {type}
    </span>
  );
}

// ─── Item Row ─────────────────────────────────────────────────────────────────

function ItemRow({
  item,
  checked,
  onToggle,
  onRemove,
}: {
  item: CartItem;
  checked: boolean;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.22 } }}
      className={`flex items-center gap-4 px-5 py-4 transition-colors rounded-xl mx-1 ${
        checked ? "bg-blue-50/60" : "hover:bg-gray-50"
      }`}
    >
      {/* Checkbox */}
      <CustomCheckbox state={checked ? "checked" : "unchecked"} onChange={onToggle} />

      {/* Product Image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
        <ImageWithFallback
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        {/* Tags row */}
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
            <GraduationCap className="w-3 h-3" />
            {item.subjectTag}
          </span>
          <TxBadge type={item.transactionType} />
        </div>

        {/* Title */}
        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-snug">{item.title}</h4>

        {/* Condition */}
        <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          <Package className="w-3 h-3" />
          {item.condition}
        </span>
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right min-w-[90px]">
        <p className="text-xl font-bold text-blue-600">${item.price.toFixed(2)}</p>
        {item.priceSuffix && (
          <p className="text-xs text-gray-400 mt-0.5">{item.priceSuffix}</p>
        )}
      </div>

      {/* Remove */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={onRemove}
        className="p-2 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
        title="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}

// ─── Seller Group ─────────────────────────────────────────────────────────────

function SellerGroup({
  seller,
  items,
  selectedIds,
  onToggleItem,
  onToggleAll,
  onRemoveItem,
}: {
  seller: Seller;
  items: CartItem[];
  selectedIds: Set<string>;
  onToggleItem: (id: string) => void;
  onToggleAll: (sellerId: string, check: boolean) => void;
  onRemoveItem: (id: string) => void;
}) {
  const checkedCount = items.filter((i) => selectedIds.has(i.id)).length;
  const groupState: CheckState =
    checkedCount === 0 ? "unchecked" : checkedCount === items.length ? "checked" : "indeterminate";

  const handleGroupToggle = () => {
    onToggleAll(seller.id, groupState !== "checked");
  };

  if (items.length === 0) return null;

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Seller Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
        <CustomCheckbox state={groupState} onChange={handleGroupToggle} size="md" />

        <div className={`w-9 h-9 rounded-full ${seller.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm`}>
          {seller.initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900">Seller:</span>
            <span className="text-sm font-bold text-blue-700">{seller.name}</span>
            <div className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs font-medium text-blue-500">{seller.university}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400">
          <CheckCheck className="w-3.5 h-3.5" />
          <span>{checkedCount}/{items.length} selected</span>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-50 py-1">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              checked={selectedIds.has(item.id)}
              onToggle={() => onToggleItem(item.id)}
              onRemove={() => onRemoveItem(item.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Order Summary ────────────────────────────────────────────────────────────

function OrderSummary({
  selectedItems,
  delivery,
  onDeliveryChange,
  onCheckout,
}: {
  selectedItems: CartItem[];
  delivery: DeliveryOption;
  onDeliveryChange: (v: DeliveryOption) => void;
  onCheckout: () => void;
}) {
  const subtotal = selectedItems.reduce((sum, i) => sum + i.price, 0);
  const serviceFee = subtotal > 0 ? Math.max(subtotal * SERVICE_FEE_RATE, 0.5) : 0;
  const deliveryFee = delivery === "cod" ? COD_FEE : 0;
  const total = subtotal + serviceFee + deliveryFee;
  const count = selectedItems.length;

  return (
    <div className="sticky top-24 space-y-4">
      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4">
          <h2 className="font-bold text-white text-lg">Order Summary</h2>
          <p className="text-blue-100 text-sm mt-0.5">
            {count > 0 ? `${count} item${count > 1 ? "s" : ""} selected` : "No items selected"}
          </p>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">
                {subtotal > 0 ? `$${subtotal.toFixed(2)}` : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-gray-600">
                <span>Platform Service Fee</span>
                <div className="group relative">
                  <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 w-44 text-center shadow-lg">
                      5% fee helps keep EduCart safe & running for the campus community.
                    </div>
                  </div>
                </div>
              </div>
              <span className="font-semibold text-gray-900">
                {serviceFee > 0 ? `$${serviceFee.toFixed(2)}` : "—"}
              </span>
            </div>

            {delivery === "cod" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">COD Delivery Fee</span>
                <span className="font-semibold text-gray-900">$2.00</span>
              </motion.div>
            )}

            <div className="border-t border-dashed border-gray-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <motion.span
                  key={total}
                  initial={{ scale: 1.1, color: "#2563eb" }}
                  animate={{ scale: 1, color: "#1d4ed8" }}
                  className="text-2xl font-bold text-blue-700"
                >
                  {total > 0 ? `$${total.toFixed(2)}` : "$0.00"}
                </motion.span>
              </div>
              {count > 0 && (
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {selectedItems.some((i) => i.priceSuffix) ? "* Rent prices are per semester" : ""}
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Delivery Option */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-3">Delivery Option</p>
            <div className="space-y-2.5">
              {/* Meetup */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  delivery === "meetup"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="meetup"
                  checked={delivery === "meetup"}
                  onChange={() => onDeliveryChange("meetup")}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 transition-all ${
                  delivery === "meetup" ? "border-blue-600" : "border-gray-300"
                }`}>
                  {delivery === "meetup" && (
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-900">Meetup on Campus</span>
                    </div>
                    <span className="text-xs font-bold text-green-600">FREE</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Agree on a safe campus location via Chat.
                  </p>
                </div>
              </label>

              {/* COD */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  delivery === "cod"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="cod"
                  checked={delivery === "cod"}
                  onChange={() => onDeliveryChange("cod")}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 transition-all ${
                  delivery === "cod" ? "border-blue-600" : "border-gray-300"
                }`}>
                  {delivery === "cod" && (
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-900">COD Delivery</span>
                    </div>
                    <span className="text-xs font-bold text-gray-700">+$2.00</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Cash on delivery to your campus address.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Proceed Button */}
          <motion.button
            whileHover={count > 0 ? { scale: 1.02 } : {}}
            whileTap={count > 0 ? { scale: 0.97 } : {}}
            onClick={count > 0 ? onCheckout : undefined}
            disabled={count === 0}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-base ${
              count > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {count > 0 ? (
              <>
                <Sparkles className="w-5 h-5" />
                Proceed to Deal
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              "Select items to continue"
            )}
          </motion.button>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="flex items-start gap-2.5 px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-600 leading-relaxed">
          All transactions are between verified HCMUT students. EduCart never holds your payment.
        </p>
      </div>
    </div>
  );
}

// ─── Success Modal ────────────────────────────────────────────────────────────

function SuccessModal({
  count,
  total,
  delivery,
  onClose,
}: {
  count: number;
  total: number;
  delivery: DeliveryOption;
  onClose: () => void;
}) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
      >
        {/* Animated check */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 20 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5"
        >
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Deal Request Sent! 🎉</h3>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
          Your request for <strong>{count} item{count > 1 ? "s" : ""}</strong> (total{" "}
          <strong>${total.toFixed(2)}</strong>) has been sent to the sellers.
          {delivery === "meetup"
            ? " Head to Chat to arrange your meetup."
            : " The sellers will confirm your COD delivery details via Chat."}
        </p>

        <div className="space-y-2.5">
          <button
            onClick={() => router.push("/chat")}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Go to Chat
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center col-span-full"
    >
      <motion.div
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-5"
      >
        <ShoppingBag className="w-12 h-12 text-blue-300" />
      </motion.div>
      <h3 className="font-bold text-gray-700 text-xl mb-2">Your cart is empty</h3>
      <p className="text-sm text-gray-400 mb-6 max-w-xs">
        Browse the marketplace and add items you need for your studies.
      </p>
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg shadow-blue-600/20"
      >
        <ArrowLeft className="w-4 h-4" />
        Browse Marketplace
      </Link>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function Cart() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(INITIAL_ITEMS.map((i) => i.id))
  );
  const [delivery, setDelivery] = useState<DeliveryOption>("meetup");
  const [showSuccess, setShowSuccess] = useState(false);

  // ── Derived ──
  const sellerIds = useMemo(
    () => [...new Set(items.map((i) => i.sellerId))],
    [items]
  );

  const selectedItems = useMemo(
    () => items.filter((i) => selectedIds.has(i.id)),
    [items, selectedIds]
  );

  const subtotal = useMemo(() => selectedItems.reduce((s, i) => s + i.price, 0), [selectedItems]);
  const serviceFee = subtotal > 0 ? Math.max(subtotal * SERVICE_FEE_RATE, 0.5) : 0;
  const deliveryFee = delivery === "cod" ? COD_FEE : 0;
  const total = subtotal + serviceFee + deliveryFee;

  // ── Handlers ──
  const toggleItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSellerAll = (sellerId: string, check: boolean) => {
    const groupIds = items.filter((i) => i.sellerId === sellerId).map((i) => i.id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      groupIds.forEach((id) => (check ? next.add(id) : next.delete(id)));
      return next;
    });
  };

  const removeItem = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < items.length;
  const globalState: CheckState = allSelected ? "checked" : someSelected ? "indeterminate" : "unchecked";

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/marketplace"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                  My Cart
                  {items.length > 0 && (
                    <span className="ml-1 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-sm rounded-full font-semibold">
                      {items.length}
                    </span>
                  )}
                </h1>
                <nav className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                  <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                  <ChevronRight className="w-3 h-3" />
                  <Link href="/marketplace" className="hover:text-blue-600 transition-colors">Marketplace</Link>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-gray-600">Cart</span>
                </nav>
              </div>
            </div>

            {/* Select All */}
            {items.length > 0 && (
              <button
                onClick={toggleAll}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm text-gray-600 hover:text-blue-700"
              >
                <CustomCheckbox state={globalState} onChange={toggleAll} size="sm" />
                Select All ({items.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

            {/* ── LEFT: Cart Items ── */}
            <div className="space-y-5 min-w-0">
              {/* Mobile select all */}
              <div className="sm:hidden flex items-center gap-2 px-1">
                <CustomCheckbox state={globalState} onChange={toggleAll} size="sm" />
                <span className="text-sm text-gray-600">Select All ({items.length} items)</span>
              </div>

              {/* Seller Groups */}
              <AnimatePresence mode="popLayout">
                {sellerIds.map((sellerId) => {
                  const seller = SELLERS.find((s) => s.id === sellerId)!;
                  const sellerItems = items.filter((i) => i.sellerId === sellerId);
                  return (
                    <motion.div
                      key={sellerId}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.25 }}
                    >
                      <SellerGroup
                        seller={seller}
                        items={sellerItems}
                        selectedIds={selectedIds}
                        onToggleItem={toggleItem}
                        onToggleAll={toggleSellerAll}
                        onRemoveItem={removeItem}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Continue shopping */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
                {selectedIds.size > 0 && (
                  <p className="text-sm text-gray-500">
                    {selectedIds.size} of {items.length} item{items.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <OrderSummary
              selectedItems={selectedItems}
              delivery={delivery}
              onDeliveryChange={setDelivery}
              onCheckout={() => setShowSuccess(true)}
            />
          </div>
        )}
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessModal
            count={selectedItems.length}
            total={total}
            delivery={delivery}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
