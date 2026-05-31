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
      setMessages((prev) => [...prev, { role: "assistant", content: t.error }]);
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
