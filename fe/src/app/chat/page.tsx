"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Phone, Video, Info, Search as SearchIcon, Plus, MessageCircle } from "lucide-react";
import HomeNavbar from "../../components/HomeNavbar";
import { api, getUser } from "@/lib/api";

interface Conversation {
  OtherUserID: number;
  LastMessage: string;
  LastSentAt: string;
  IsRead: boolean;
  FName: string;
  LName: string;
  AvatarURL: string | null;
}

interface ApiMessage {
  MessageID: number;
  SenderID: number;
  ReceiverID: number;
  Content: string;
  IsRead: boolean;
  SentAt: string;
  ProductID: number | null;
}

export default function ChatPage() {
  const currentUser = getUser() as { UserID?: number } | null;
  const myId = currentUser?.UserID ?? 0;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingConvs, setIsLoadingConvs] = useState(true);
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    const fetchConvs = () => {
      api.get<{ ok: boolean; conversations: Conversation[] }>("/messages/conversations", true)
        .then(d => {
          if (!alive) return;
          const convs = d.conversations ?? [];
          setConversations(convs);
          setSelected(prev => prev || (convs.length > 0 ? convs[0] : null));
        })
        .catch(() => {})
        .finally(() => {
          if (alive) setIsLoadingConvs(false);
        });
    };

    fetchConvs();
    const interval = setInterval(fetchConvs, 3000);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    let alive = true;
    
    const fetchMsgs = (isInitial = false) => {
      if (isInitial) setIsLoadingMsgs(true);
      api.get<{ ok: boolean; messages: ApiMessage[] }>(`/messages?with=${selected.OtherUserID}`, true)
        .then(d => {
          if (!alive) return;
          setMessages(d.messages ?? []);
        })
        .catch(() => {
          if (!alive) return;
          if (isInitial) setMessages([]);
        })
        .finally(() => {
          if (alive && isInitial) setIsLoadingMsgs(false);
        });
    };

    fetchMsgs(true);
    const interval = setInterval(() => fetchMsgs(false), 3000);
    
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [selected?.OtherUserID]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selected) return;
    const content = inputValue;
    setInputValue("");
    try {
      const d = await api.post<{ ok: boolean; message: ApiMessage }>("/messages", {
        receiverId: selected.OtherUserID,
        content,
      }, true);
      if (d.message) {
        setMessages(prev => [...prev, d.message]);
        setConversations(prev => {
          const exists = prev.some(c => c.OtherUserID === selected.OtherUserID);
          if (!exists) return prev; // Polling will catch it anyway if it's new
          return prev.map(c => 
            c.OtherUserID === selected.OtherUserID 
              ? { ...c, LastMessage: d.message.Content, LastSentAt: d.message.SentAt }
              : c
          );
        });
      }
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const filteredConversations = conversations.filter(c =>
    `${c.FName} ${c.LName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const convName = (c: Conversation) => `${c.FName} ${c.LName}`;

  return (
    <main className="min-h-screen bg-gray-50">
      <HomeNavbar />

      <div className="flex h-[calc(100vh-64px)] bg-white">
        {/* Left Sidebar: Conversations */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tin nhắn</h2>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm cuộc trò chuyện..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoadingConvs ? (
              <div className="p-8 text-center text-gray-400 text-sm">Đang tải...</div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map(conv => (
                <button
                  key={conv.OtherUserID}
                  onClick={() => setSelected(conv)}
                  className={`w-full px-4 py-3 border-b border-gray-100 transition-colors hover:bg-gray-50 ${selected?.OtherUserID === conv.OtherUserID ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg overflow-hidden">
                        {conv.AvatarURL
                          ? <img src={conv.AvatarURL} alt="" className="w-full h-full object-cover" />
                          : conv.FName.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-900">{convName(conv)}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(conv.LastSentAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{conv.LastMessage}</p>
                    </div>
                    {!conv.IsRead && (
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2" />
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Không có cuộc trò chuyện nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        {selected ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg overflow-hidden">
                  {selected.AvatarURL
                    ? <img src={selected.AvatarURL} alt="" className="w-full h-full object-cover" />
                    : selected.FName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{convName(selected)}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Phone className="h-5 w-5 text-gray-600" /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Video className="h-5 w-5 text-gray-600" /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Info className="h-5 w-5 text-gray-600" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {isLoadingMsgs ? (
                <div className="text-center text-gray-400 text-sm py-8">Đang tải tin nhắn...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-8">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.SenderID === myId;
                  return (
                    <div key={msg.MessageID} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-2xl ${isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"}`}>
                        <p className="text-sm">{msg.Content}</p>
                        <p className={`text-xs mt-1 ${isMe ? "text-blue-100" : "text-gray-500"}`}>
                          {new Date(msg.SentAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="flex items-end gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                  <Plus className="h-5 w-5 text-gray-600" />
                </button>
                <textarea
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập tin nhắn của bạn..."
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none max-h-24"
                  rows={1}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0 text-blue-600 hover:text-blue-700"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
