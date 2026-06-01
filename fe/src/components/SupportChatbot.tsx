"use client";

import { FormEvent, useMemo, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";

import { api, getToken } from "@/lib/api";
import { useLocale } from "@/components/locale-provider";

type ChatSuggestion = {
  id: number;
  title: string;
  href: string;
  price: number;
  isForRent: boolean;
};

type ChatResponse = {
  ok: boolean;
  intent: string;
  reply: string;
  suggestions: ChatSuggestion[];
};

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
  suggestions?: ChatSuggestion[];
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function classifyFallbackIntent(rawMessage: string) {
  const message = normalizeText(rawMessage);
  const rules = [
    { key: "payment_retry", keywords: ["thanh toan", "payment", "momo", "vnpay", "retry"] },
    { key: "order_tracking", keywords: ["don hang", "dang o dau", "tracking", "giao den", "ship"] },
    { key: "trust_score", keywords: ["trust", "uy tin", "canh bao", "bao nhieu diem"] },
    { key: "copyright", keywords: ["ban quyen", "pdf lau", "scan giao trinh", "ebook lau"] },
    { key: "product_recommendation", keywords: ["goi y", "giao trinh", "tai lieu", "flashcard", "nen mua"] },
    { key: "refund_dispute", keywords: ["hoan tien", "khieu nai", "tranh chap", "report", "lua dao"] },
  ];

  let best = "fallback";
  let score = 0;
  for (const rule of rules) {
    const nextScore = rule.keywords.reduce((sum, keyword) => sum + (message.includes(keyword) ? 1 : 0), 0);
    if (nextScore > score) {
      best = rule.key;
      score = nextScore;
    }
  }
  return best;
}

function buildFallbackReply(rawMessage: string, locale: "vi" | "en"): Pick<ChatResponse, "reply" | "suggestions"> {
  const intent = classifyFallbackIntent(rawMessage);

  if (locale === "en") {
    switch (intent) {
      case "payment_retry":
        return {
          reply: "You can reopen your order detail page and retry payment within the remaining payment window. Look for orders that are still in PendingPayment state.",
          suggestions: [{ id: 0, title: "Open my orders", href: "/orders", price: 0, isForRent: false }],
        };
      case "order_tracking":
        return {
          reply: "Please open the Orders page to check the latest lifecycle state such as PendingPayment, Paid, Delivering, or Completed.",
          suggestions: [{ id: 0, title: "Track my orders", href: "/orders", price: 0, isForRent: false }],
        };
      case "trust_score":
        return {
          reply: "EduCart starts every account at 100 trust points. Valid violations reduce trust score and may lead to warning, suspension, or permanent ban.",
          suggestions: [{ id: 0, title: "Read legal policy", href: "/khung-phap-ly", price: 0, isForRent: false }],
        };
      case "copyright":
        return {
          reply: "The platform allows self-created notes and study aids, but does not allow pirated PDFs, full textbook scans, or unauthorized copyrighted material.",
          suggestions: [{ id: 0, title: "Copyright policy", href: "/khung-phap-ly", price: 0, isForRent: false }],
        };
      case "product_recommendation":
        return {
          reply: "You can browse the Products page and filter by subject, rental, or digital materials to find suitable learning resources.",
          suggestions: [{ id: 0, title: "Browse products", href: "/products", price: 0, isForRent: false }],
        };
      case "refund_dispute":
        return {
          reply: "If you need a refund or dispute resolution, please create a report with clear evidence so the admin team can review it.",
          suggestions: [{ id: 0, title: "View seller policy", href: "/khung-phap-ly", price: 0, isForRent: false }],
        };
      default:
        return {
          reply: "I can still help with orders, payments, trust score, disputes, and study-material suggestions even if the backend AI route is temporarily unavailable.",
          suggestions: [{ id: 0, title: "Go to home", href: "/", price: 0, isForRent: false }],
        };
    }
  }

  switch (intent) {
    case "payment_retry":
      return {
        reply: "Ban co the mo chi tiet don hang va thanh toan lai trong thoi gian cho phep. Hay tim don dang o trang thai PendingPayment.",
        suggestions: [{ id: 0, title: "Mo don hang cua toi", href: "/orders", price: 0, isForRent: false }],
      };
    case "order_tracking":
      return {
        reply: "Hay mo trang Don hang de kiem tra trang thai moi nhat nhu PendingPayment, Paid, Delivering hoac Completed.",
        suggestions: [{ id: 0, title: "Theo doi don hang", href: "/orders", price: 0, isForRent: false }],
      };
    case "trust_score":
      return {
        reply: "Moi tai khoan bat dau voi 100 diem trust score. Vi pham hop le se tru diem va co the dan den canh bao, tam khoa hoac ban vinh vien.",
        suggestions: [{ id: 0, title: "Xem policy trust score", href: "/khung-phap-ly", price: 0, isForRent: false }],
      };
    case "copyright":
      return {
        reply: "EduCart cho phep tai lieu tu tao, ghi chu ca nhan va flashcard, nhung khong cho phep PDF lau, scan toan bo giao trinh hoac hoc lieu vi pham ban quyen.",
        suggestions: [{ id: 0, title: "Xem chinh sach ban quyen", href: "/khung-phap-ly", price: 0, isForRent: false }],
      };
    case "product_recommendation":
      return {
        reply: "Ban co the vao trang San pham va loc theo mon hoc, tai lieu so hoac cho thue de tim hoc lieu phu hop.",
        suggestions: [{ id: 0, title: "Mo trang san pham", href: "/products", price: 0, isForRent: false }],
      };
    case "refund_dispute":
      return {
        reply: "Neu can hoan tien hoac tranh chap, hay tao report kem bang chung de admin tiep nhan va xu ly.",
        suggestions: [{ id: 0, title: "Xem khung phap ly", href: "/khung-phap-ly", price: 0, isForRent: false }],
      };
    default:
      return {
        reply: "Mình vẫn có thể hỗ trợ các câu hỏi cơ bản về đơn hàng, thanh toán, trust score, tranh chấp và gợi ý học liệu ngay cả khi route AI backend chưa sẵn sàng.",
        suggestions: [{ id: 0, title: "Ve trang chu", href: "/", price: 0, isForRent: false }],
      };
  }
}

const dictionary = {
  vi: {
    title: "Tro ly AI EduCart",
    subtitle: "Hoi ve don hang, thanh toan, trust score va goi y hoc lieu.",
    placeholder: "Nhap cau hoi cua ban...",
    send: "Gui",
    open: "Mo tro ly AI",
    close: "Dong tro ly AI",
    thinking: "Dang phan tich...",
    error: "Chatbot tam thoi bi loi. Vui long thu lai sau.",
    quickPrompts: [
      "Don hang cua toi dang o dau?",
      "Toi muon thanh toan lai don hang",
      "Goi y giao trinh Giai tich 1",
      "Trust score duoc tinh nhu the nao?",
    ],
  },
  en: {
    title: "EduCart AI Assistant",
    subtitle: "Ask about orders, payments, trust score, and study material suggestions.",
    placeholder: "Type your question...",
    send: "Send",
    open: "Open AI assistant",
    close: "Close AI assistant",
    thinking: "Thinking...",
    error: "The chatbot is temporarily unavailable. Please try again.",
    quickPrompts: [
      "Where is my latest order?",
      "I want to retry a payment",
      "Recommend Calculus study materials",
      "How is trust score calculated?",
    ],
  },
} as const;

export default function SupportChatbot() {
  const { locale } = useLocale();
  const t = dictionary[locale];
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        locale === "vi"
          ? "Xin chao. Minh la tro ly AI cua EduCart. Ban co the hoi ve don hang, thanh toan, tranh chap, trust score hoac xin goi y hoc lieu."
          : "Hello. I am EduCart's AI assistant. You can ask about orders, payments, disputes, trust score, or request study material suggestions.",
    },
  ]);

  const canSend = input.trim().length > 0 && !isLoading;
  const quickPrompts = useMemo(() => t.quickPrompts, [t.quickPrompts]);

  const sendMessage = async (rawMessage: string) => {
    const message = rawMessage.trim();
    if (!message) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await api.post<ChatResponse>("/ai/chat", { message }, Boolean(getToken()));
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.reply,
          suggestions: res.suggestions,
        },
      ]);
    } catch {
      const fallback = buildFallbackReply(message, locale);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `${t.error}\n\n${fallback.reply}`,
          suggestions: fallback.suggestions,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage(input);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? t.close : t.open}
        className="fixed bottom-5 right-5 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {isOpen ? (
        <div className="fixed bottom-24 right-5 z-[70] flex h-[36rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">AI</p>
                <h3 className="text-lg font-bold">{t.title}</h3>
              </div>
            </div>
            <p className="mt-3 text-sm text-blue-50">{t.subtitle}</p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-md bg-blue-600 text-white"
                      : "rounded-bl-md bg-white text-slate-800 shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  {message.suggestions?.length ? (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion) => (
                        <a
                          key={suggestion.id}
                          href={suggestion.href}
                          className="block rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                        >
                          <p className="font-semibold">{suggestion.title}</p>
                          <p className="text-xs text-slate-500">
                            {suggestion.isForRent ? "Rent" : "Buy"} · {Number(suggestion.price || 0).toLocaleString("vi-VN")} đ
                          </p>
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {messages.length === 1 ? (
              <div className="space-y-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="block w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.thinking}
                </div>
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-4">
            <div className="flex items-end gap-3">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={2}
                placeholder={t.placeholder}
                className="min-h-[3.25rem] flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                title={t.send}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
