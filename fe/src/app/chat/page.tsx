"use client";

import { useState } from "react";
import { Send, Phone, Video, Info, Search as SearchIcon, Plus, MessageCircle } from "lucide-react";
import HomeNavbar from "../../components/HomeNavbar";

/* ─── Types ─────────────────────────────────────────────── */
interface Conversation {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
}

interface Message {
    id: string;
    sender: "me" | "other";
    text: string;
    time: string;
}

/* ─── Mock Data ──────────────────────────────────────────── */
const mockConversations: Conversation[] = [
    {
        id: "1",
        name: "Hoàng Nam",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hoang",
        lastMessage: "Ok, tôi sẽ gửi sách cho bạn ngay",
        time: "2 phút trước",
        unread: 1,
        online: true,
    },
    {
        id: "2",
        name: "Minh Anh",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minh",
        lastMessage: "Cảm ơn bạn, sách rất tuyệt vời!",
        time: "1 giờ trước",
        unread: 0,
        online: false,
    },
    {
        id: "3",
        name: "Trần Văn Khoa",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Khoa",
        lastMessage: "Bạn có còn sách này không?",
        time: "3 giờ trước",
        unread: 0,
        online: true,
    },
    {
        id: "4",
        name: "Phương Linh",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Linh",
        lastMessage: "Mình đã nhận được sách, cảm ơn bạn!",
        time: "1 ngày trước",
        unread: 0,
        online: false,
    },
];

const mockMessages: Message[] = [
    {
        id: "1",
        sender: "other",
        text: "Bạn có sách Giải tích 1 của James Stewart không?",
        time: "10:30",
    },
    {
        id: "2",
        sender: "me",
        text: "Có chứ, còn 2 cuốn, tình trạng rất tốt",
        time: "10:32",
    },
    {
        id: "3",
        sender: "other",
        text: "Giá bao nhiêu? Tôi có thể xem hình ảnh không?",
        time: "10:35",
    },
    {
        id: "4",
        sender: "me",
        text: "30.000 VNĐ/cuốn, để tôi gửi hình cho bạn",
        time: "10:36",
    },
    {
        id: "5",
        sender: "other",
        text: "Ok, tôi sẽ mua 1 cuốn. Giao ở đâu?",
        time: "10:40",
    },
    {
        id: "6",
        sender: "me",
        text: "Ok, tôi sẽ gửi sách cho bạn ngay",
        time: "10:42",
    },
];

/* ─── Main Chat Page ─────────────────────────────────────── */
export default function ChatPage() {
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
    const [selectedConversation, setSelectedConversation] = useState<Conversation>(mockConversations[0]);
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            const newMessage: Message = {
                id: String(messages.length + 1),
                sender: "me",
                text: inputValue,
                time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages([...messages, newMessage]);
            setInputValue("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const filteredConversations = conversations.filter((conv) =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-gray-50">
            <HomeNavbar />

            <div className="flex h-[calc(100vh-64px)] bg-white">
                {/* ─── Left Sidebar: Conversations ─────────────────────── */}
                <div className="w-80 border-r border-gray-200 flex flex-col">
                    {/* Header */}
                    <div className="border-b border-gray-200 p-4">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Tin nhắn</h2>

                        {/* Search */}
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm cuộc trò chuyện..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Conversations List */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length > 0 ? (
                            filteredConversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => setSelectedConversation(conv)}
                                    className={`w-full px-4 py-3 border-b border-gray-100 transition-colors hover:bg-gray-50 ${selectedConversation.id === conv.id ? "bg-blue-50" : ""
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Avatar */}
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={conv.avatar}
                                                alt={conv.name}
                                                className="w-12 h-12 rounded-full"
                                            />
                                            {conv.online && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-semibold text-gray-900">{conv.name}</p>
                                                <span className="text-xs text-gray-500">{conv.time}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                                        </div>

                                        {/* Unread badge */}
                                        {conv.unread > 0 && (
                                            <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-bold text-white">{conv.unread}</span>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">Không tìm thấy cuộc trò chuyện</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── Main Chat Area ─────────────────────────────── */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    src={selectedConversation.avatar}
                                    alt={selectedConversation.name}
                                    className="w-12 h-12 rounded-full"
                                />
                                {selectedConversation.online && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{selectedConversation.name}</h3>
                                <p className="text-xs text-gray-500">
                                    {selectedConversation.online ? "Đang hoạt động" : "Ngoại tuyến"}
                                </p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Phone className="h-5 w-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Video className="h-5 w-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Info className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === "me"
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                                        }`}
                                >
                                    <p className="text-sm">{msg.text}</p>
                                    <p
                                        className={`text-xs mt-1 ${msg.sender === "me" ? "text-blue-100" : "text-gray-500"
                                            }`}
                                    >
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-200 bg-white p-4">
                        <div className="flex items-end gap-3">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                                <Plus className="h-5 w-5 text-gray-600" />
                            </button>

                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
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
            </div>
        </main>
    );
}
