import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Search,
  ArrowLeft,
  MoreVertical,
  Phone,
  MapPin,
  Clock,
  CheckCheck,
  Check,
  Image as ImageIcon,
  Package,
  ChevronDown,
  Smile,
  GraduationCap,
  X,
  CalendarClock,
  ShieldCheck,
} from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { Navbar } from "../components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────

type MsgFrom = "me" | "them";
type ProposalStatus = "pending" | "accepted" | "declined";

interface BaseMsg {
  id: string;
  from: MsgFrom;
  time: string;
}
interface TextMsg extends BaseMsg { type: "text"; text: string; }
interface ImageMsg extends BaseMsg { type: "image"; url: string; caption?: string; }
interface ProposalMsg extends BaseMsg {
  type: "proposal";
  location: string;
  timeSlot: string;
  status: ProposalStatus;
}
type ChatMessage = TextMsg | ImageMsg | ProposalMsg;

interface Participant {
  name: string;
  avatar: string;
  university: string;
  isOnline: boolean;
  lastSeen?: string;
}
interface Product {
  title: string;
  price: string;
  priceSuffix?: string;
  image: string;
  badge: "FOR SALE" | "FOR RENT";
}
interface Conversation {
  id: string;
  participant: Participant;
  product: Product;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: ChatMessage[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    participant: {
      name: "Phuong Linh",
      avatar: "https://images.unsplash.com/photo-1758270705555-015de348a48a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      university: "HCMUT Student",
      isOnline: true,
    },
    product: {
      title: "Lab Coat – Large Size",
      price: "$15",
      priceSuffix: "/Semester",
      image: "https://images.unsplash.com/photo-1581093449818-2655b2467fd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      badge: "FOR RENT",
    },
    lastMessage: "Also, here's a photo of the coat 📸",
    lastTime: "2m ago",
    unread: 2,
    messages: [
      { id: "m1", type: "text", from: "them", time: "10:02 AM", text: "Hi! I saw you're interested in the lab coat rental. It's size Large, barely used. Any questions? 😊" },
      { id: "m2", type: "text", from: "me", time: "10:05 AM", text: "Hey! Yes I'm interested. Is the price negotiable? I was thinking $12/semester" },
      { id: "m3", type: "text", from: "them", time: "10:07 AM", text: "Hmm I was hoping for $15 but I could do $13 if we can meet this week 🤝" },
      { id: "m4", type: "text", from: "me", time: "10:09 AM", text: "That sounds fair! When are you free to meet?" },
      { id: "m5", type: "text", from: "them", time: "10:10 AM", text: "I'm usually free after 4pm on weekdays. Library area or B2 hall works for me!" },
      {
        id: "m6", type: "proposal", from: "me", time: "10:12 AM",
        location: "Library – B2 Hall", timeSlot: "Tuesday, 5:00 PM", status: "accepted",
      },
      { id: "m7", type: "text", from: "them", time: "10:13 AM", text: "Sounds good! See you then 🎉 I'll bring the coat." },
      {
        id: "m8", type: "image", from: "them", time: "10:15 AM",
        url: "https://images.unsplash.com/photo-1581093449818-2655b2467fd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
        caption: "Here's the actual condition of the coat — barely used!",
      },
    ],
  },
  {
    id: "c2",
    participant: {
      name: "Duc Anh",
      avatar: "https://images.unsplash.com/photo-1548884481-dfb662aadde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      university: "HCMUT Student",
      isOnline: true,
    },
    product: {
      title: "Engineering Drawing Kit",
      price: "$30",
      image: "https://images.unsplash.com/photo-1760030428004-60a033044f81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      badge: "FOR SALE",
    },
    lastMessage: "The full set includes compass, rulers and protractor",
    lastTime: "1h ago",
    unread: 1,
    messages: [
      { id: "m1", type: "text", from: "me", time: "9:00 AM", text: "Hi Duc Anh! Is the engineering drawing kit still available?" },
      { id: "m2", type: "text", from: "them", time: "9:05 AM", text: "Yes it is! Full set including compass, rulers, protractor and a carry case." },
      { id: "m3", type: "text", from: "me", time: "9:06 AM", text: "Great! Would $25 work for you?" },
      { id: "m4", type: "text", from: "them", time: "9:20 AM", text: "The full set includes compass, rulers and protractor. I think $28 is the lowest I can go 🙏" },
    ],
  },
  {
    id: "c3",
    participant: {
      name: "Ngoc Mai",
      avatar: "https://images.unsplash.com/photo-1573872877571-ac2fd416ae6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      university: "HCMUT Student",
      isOnline: false,
      lastSeen: "3h ago",
    },
    product: {
      title: "Old Exam Papers Bundle",
      price: "$10",
      image: "https://images.unsplash.com/photo-1588713444222-408f6d537ca3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      badge: "FOR SALE",
    },
    lastMessage: "Deal confirmed! See you at Campus A tomorrow ✅",
    lastTime: "Yesterday",
    unread: 0,
    messages: [
      { id: "m1", type: "text", from: "them", time: "Yesterday 2:00 PM", text: "Hi! The exam bundle has 3 years of past papers for Math, Physics, and CS courses." },
      { id: "m2", type: "text", from: "me", time: "Yesterday 2:05 PM", text: "Perfect, that's exactly what I need! Can we meet tomorrow morning?" },
      {
        id: "m3", type: "proposal", from: "me", time: "Yesterday 2:10 PM",
        location: "Campus A – Gate B", timeSlot: "Tomorrow, 9:00 AM", status: "accepted",
      },
      { id: "m4", type: "text", from: "them", time: "Yesterday 2:12 PM", text: "Deal confirmed! See you at Campus A tomorrow ✅" },
    ],
  },
  {
    id: "c4",
    participant: {
      name: "Quoc Huy",
      avatar: "https://images.unsplash.com/photo-1758270703070-f5027b558ac0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      university: "HCMUT Student",
      isOnline: false,
      lastSeen: "30m ago",
    },
    product: {
      title: "TI-84 Plus Calculator",
      price: "$55",
      image: "https://images.unsplash.com/photo-1737919144176-cb279b56ce6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      badge: "FOR SALE",
    },
    lastMessage: "I can throw in the case for free if you pay $50",
    lastTime: "2h ago",
    unread: 3,
    messages: [
      { id: "m1", type: "text", from: "them", time: "8:00 AM", text: "Hey! Saw your interest in the TI-84. It's in great shape, battery's good too." },
      { id: "m2", type: "text", from: "me", time: "8:30 AM", text: "Awesome! Does it come with a case?" },
      { id: "m3", type: "text", from: "them", time: "8:45 AM", text: "I can throw in the case for free if you pay $50 😄 What do you think?" },
    ],
  },
];

const AUTO_REPLIES: Record<string, string[]> = {
  c1: ["Sure, anything else you'd like to know? 😊", "The coat is in really great condition!", "Let me know if you want more photos."],
  c2: ["That could work! Let me think about it.", "The kit is barely used, very good value.", "Happy to meet anywhere on campus!"],
  c3: ["Great talking to you! 👋", "See you soon!", "Looking forward to the meetup."],
  c4: ["Yeah the case is almost new too!", "I can also do $52 if you need the charger.", "Just say when you want to meet!"],
};

const PROPOSAL_LOCATIONS = [
  "Library – B2 Hall",
  "Campus A – Gate B",
  "Campus B – Canteen",
  "Engineering Block – Room 201",
  "Student Center Lobby",
  "Sports Hall Entrance",
];

const PROPOSAL_TIMES = [
  "Monday, 8:00 AM", "Monday, 2:00 PM", "Monday, 5:00 PM",
  "Tuesday, 8:00 AM", "Tuesday, 2:00 PM", "Tuesday, 5:00 PM",
  "Wednesday, 8:00 AM", "Wednesday, 2:00 PM", "Wednesday, 5:00 PM",
  "Thursday, 8:00 AM", "Thursday, 5:00 PM",
  "Friday, 12:00 PM", "Friday, 5:00 PM",
  "Saturday, 10:00 AM", "Saturday, 2:00 PM",
];

// ─── Utility ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2);
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }}
            className="w-2 h-2 bg-gray-400 rounded-full block"
          />
        ))}
      </div>
    </div>
  );
}

function ProposalBubble({
  msg,
  onAccept,
  onDecline,
}: {
  msg: ProposalMsg;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}) {
  const isMe = msg.from === "me";
  const statusMap: Record<ProposalStatus, { label: string; cls: string }> = {
    pending: { label: "Awaiting Response", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    accepted: { label: "Accepted ✓", cls: "bg-green-50 text-green-700 border-green-200" },
    declined: { label: "Declined ✗", cls: "bg-red-50 text-red-600 border-red-200" },
  };
  const { label, cls } = statusMap[msg.status];

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3`}>
      <div className="max-w-xs w-full">
        <div className="bg-white border-2 border-blue-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-blue-600 px-4 py-2.5 flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-white flex-shrink-0" />
            <span className="text-sm font-semibold text-white">Meetup Proposal</span>
            {isMe && <span className="ml-auto text-xs text-blue-200">You proposed</span>}
          </div>
          {/* Details */}
          <div className="px-4 py-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>{msg.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>{msg.timeSlot}</span>
            </div>
          </div>
          {/* Status */}
          <div className={`mx-4 mb-3 px-3 py-1.5 rounded-lg border text-xs font-medium text-center ${cls}`}>
            {label}
          </div>
          {/* Action buttons for receiver */}
          {!isMe && msg.status === "pending" && onAccept && onDecline && (
            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => onAccept(msg.id)}
                className="flex-1 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Accept
              </button>
              <button
                onClick={() => onDecline(msg.id)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Decline
              </button>
            </div>
          )}
        </div>
        <p className={`text-xs text-gray-400 mt-1 ${isMe ? "text-right" : "text-left"}`}>{msg.time}</p>
      </div>
    </div>
  );
}

function ImageBubble({ msg }: { msg: ImageMsg }) {
  const isMe = msg.from === "me";
  return (
    <div className={`flex items-end gap-2 mb-3 ${isMe ? "flex-row-reverse" : ""}`}>
      <div className="w-7 h-7 flex-shrink-0" />
      <div className={`max-w-[260px] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
        <div className={`rounded-2xl overflow-hidden shadow-sm ${isMe ? "rounded-br-sm" : "rounded-bl-sm"}`}>
          <ImageWithFallback src={msg.url} alt="Shared image" className="w-full h-44 object-cover" />
        </div>
        {msg.caption && (
          <div className={`mt-1 px-3 py-2 text-sm rounded-xl max-w-full ${
            isMe ? "bg-blue-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
          }`}>
            {msg.caption}
          </div>
        )}
        <p className={`text-xs text-gray-400 mt-1 ${isMe ? "text-right" : "text-left"}`}>{msg.time}</p>
      </div>
    </div>
  );
}

function TextBubble({ msg }: { msg: TextMsg }) {
  const isMe = msg.from === "me";
  return (
    <div className={`flex items-end gap-2 mb-3 ${isMe ? "flex-row-reverse" : ""}`}>
      <div className="w-7 h-7 flex-shrink-0" />
      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[72%]`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isMe
              ? "bg-blue-600 text-white rounded-br-sm shadow-sm shadow-blue-600/20"
              : "bg-gray-100 text-gray-800 rounded-bl-sm"
          }`}
        >
          {msg.text}
        </div>
        <div className={`flex items-center gap-1 mt-1 ${isMe ? "flex-row-reverse" : ""}`}>
          <p className="text-xs text-gray-400">{msg.time}</p>
          {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-400" />}
        </div>
      </div>
    </div>
  );
}

// ─── Inbox Item ───────────────────────────────────────────────────────────────

function InboxItem({
  conv,
  isActive,
  onClick,
}: {
  conv: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ x: 2 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors text-left ${
        isActive ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50"
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={conv.participant.avatar}
          alt={conv.participant.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {conv.participant.isOnline && (
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
        )}
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`text-sm truncate ${isActive ? "text-blue-700 font-semibold" : "font-semibold text-gray-900"}`}>
            {conv.participant.name}
          </span>
          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{conv.lastTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
          {conv.unread > 0 && (
            <span className="ml-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
              {conv.unread}
            </span>
          )}
        </div>
        {/* Product tag */}
        <div className="flex items-center gap-1 mt-1">
          <Package className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-400 truncate">{conv.product.title}</span>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Propose Meetup Card (Action Bar) ─────────────────────────────────────────

function ProposeMeetupBar({
  onSend,
  onClose,
}: {
  onSend: (location: string, timeSlot: string) => void;
  onClose: () => void;
}) {
  const [location, setLocation] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.97 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mx-4 mb-3 bg-white rounded-2xl border-2 border-blue-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold text-white">Propose a Meetup</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-blue-700/40 rounded-full transition-colors">
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Form */}
      <div className="p-4 space-y-3">
        {/* Campus Location */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            Campus Location
          </label>
          <div className="relative">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">Choose a location…</option>
              {PROPOSAL_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Time */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            Preferred Time
          </label>
          <div className="relative">
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">Choose a time…</option>
              {PROPOSAL_TIMES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Send */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={!location || !timeSlot}
          onClick={() => { if (location && timeSlot) { onSend(location, timeSlot); } }}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Send className="w-4 h-4" />
          Send Proposal
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>("c1");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPropose, setShowPropose] = useState(false);
  const [inboxSearch, setInboxSearch] = useState("");
  const [mobileView, setMobileView] = useState<"inbox" | "chat">("inbox");
  const [inboxTab, setInboxTab] = useState<"all" | "buying" | "selling">("all");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeConv = conversations.find((c) => c.id === activeId) ?? null;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages, isTyping]);

  // Mark as read on open
  useEffect(() => {
    if (activeId) {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, unread: 0 } : c))
      );
    }
  }, [activeId]);

  const addMessage = useCallback(
    (convId: string, msg: ChatMessage) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          const lastMsg =
            msg.type === "text"
              ? msg.text
              : msg.type === "proposal"
              ? `📍 Meetup @ ${msg.location}`
              : "📸 Photo";
          return {
            ...c,
            messages: [...c.messages, msg],
            lastMessage: lastMsg,
            lastTime: "Just now",
          };
        })
      );
    },
    []
  );

  const sendTextMessage = useCallback(() => {
    if (!inputText.trim() || !activeId) return;
    const msg: TextMsg = {
      id: uid(), type: "text", from: "me", time: nowTime(), text: inputText.trim(),
    };
    addMessage(activeId, msg);
    setInputText("");
    setShowPropose(false);

    // Simulate reply
    const replies = AUTO_REPLIES[activeId] ?? ["Got it! 👍"];
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply: TextMsg = {
        id: uid(), type: "text", from: "them", time: nowTime(),
        text: replies[Math.floor(Math.random() * replies.length)],
      };
      addMessage(activeId, reply);
    }, 1500 + Math.random() * 1000);
  }, [inputText, activeId, addMessage]);

  const sendProposal = useCallback(
    (location: string, timeSlot: string) => {
      if (!activeId) return;
      const msg: ProposalMsg = {
        id: uid(), type: "proposal", from: "me", time: nowTime(),
        location, timeSlot, status: "pending",
      };
      addMessage(activeId, msg);
      setShowPropose(false);

      // Auto-accept after 2s
      setTimeout(() => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== activeId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === msg.id ? { ...m, status: "accepted" } : m
              ),
            };
          })
        );
        const reply: TextMsg = {
          id: uid(), type: "text", from: "them", time: nowTime(),
          text: `Sounds good! I'll be at ${location} on ${timeSlot}. See you there! 🎉`,
        };
        addMessage(activeId, reply);
      }, 2000);
    },
    [activeId, addMessage]
  );

  const handleProposalAction = useCallback(
    (convId: string, msgId: string, action: "accepted" | "declined") => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === msgId ? { ...m, status: action } : m
            ),
          };
        })
      );
      if (action === "accepted") {
        const reply: TextMsg = {
          id: uid(), type: "text", from: "me", time: nowTime(),
          text: "Proposal accepted! Looking forward to it 🙌",
        };
        setTimeout(() => addMessage(convId, reply), 300);
      }
    },
    [addMessage]
  );

  const filteredConvs = conversations.filter((c) => {
    if (inboxSearch && !c.participant.name.toLowerCase().includes(inboxSearch.toLowerCase()) &&
        !c.product.title.toLowerCase().includes(inboxSearch.toLowerCase())) return false;
    return true;
  });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  // ── Render ──

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* ════════════ LEFT: INBOX ════════════ */}
        <motion.aside
          className={`
            flex flex-col bg-white border-r border-gray-100 flex-shrink-0
            ${mobileView === "inbox" ? "flex" : "hidden"}
            md:flex w-full md:w-80 lg:w-96
          `}
          initial={false}
        >
          {/* Inbox header */}
          <div className="px-5 pt-5 pb-3 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Messages</h2>
                {totalUnread > 0 && (
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-semibold">
                    {totalUnread}
                  </span>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations…"
                value={inboxSearch}
                onChange={(e) => setInboxSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              {(["all", "buying", "selling"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setInboxTab(tab)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    inboxTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
            <AnimatePresence>
              {filteredConvs.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-400">No conversations found</div>
              ) : (
                filteredConvs.map((conv) => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <InboxItem
                      conv={conv}
                      isActive={conv.id === activeId}
                      onClick={() => {
                        setActiveId(conv.id);
                        setMobileView("chat");
                        setShowPropose(false);
                      }}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* EduCart safe deal badge */}
          <div className="p-4 flex-shrink-0 border-t border-gray-100">
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-700">All deals are within your verified university community.</p>
            </div>
          </div>
        </motion.aside>

        {/* ════════════ RIGHT: CHAT WINDOW ════════════ */}
        <main
          className={`
            flex-1 flex flex-col min-w-0 overflow-hidden
            ${mobileView === "chat" ? "flex" : "hidden"}
            md:flex
          `}
        >
          {activeConv ? (
            <>
              {/* ── Chat Header ── */}
              <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm">
                {/* Mobile back */}
                <button
                  className="md:hidden p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  onClick={() => setMobileView("inbox")}
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={activeConv.participant.avatar}
                    alt={activeConv.participant.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                  {activeConv.participant.isOnline && (
                    <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Seller info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{activeConv.participant.name}</h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs text-blue-600 font-medium hidden sm:block">
                        {activeConv.participant.university}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {activeConv.participant.isOnline
                      ? "🟢 Online now"
                      : `Last seen ${activeConv.participant.lastSeen}`}
                  </p>
                </div>

                {/* Product snippet */}
                <div className="hidden sm:flex items-center gap-3 px-3 py-2 bg-blue-50 rounded-xl border border-blue-100 flex-shrink-0">
                  <img
                    src={activeConv.product.image}
                    alt={activeConv.product.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                          activeConv.product.badge === "FOR RENT"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {activeConv.product.badge}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 max-w-[120px] truncate">
                      {activeConv.product.title}
                    </p>
                    <p className="text-xs font-bold text-blue-600">
                      {activeConv.product.price}
                      {activeConv.product.priceSuffix && (
                        <span className="font-normal text-gray-400">{activeConv.product.priceSuffix}</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
                    <Phone className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* ── Messages Area ── */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-1 bg-gradient-to-b from-gray-50 to-white">
                {/* Date divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200 flex-shrink-0">
                    Today
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <AnimatePresence initial={false}>
                  {activeConv.messages.map((msg) => {
                    if (msg.type === "text") {
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TextBubble msg={msg} />
                        </motion.div>
                      );
                    }
                    if (msg.type === "image") {
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ImageBubble msg={msg} />
                        </motion.div>
                      );
                    }
                    if (msg.type === "proposal") {
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.25 }}
                          className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"} mb-3`}
                        >
                          <ProposalBubble
                            msg={msg as ProposalMsg}
                            onAccept={(id) => handleProposalAction(activeConv.id, id, "accepted")}
                            onDecline={(id) => handleProposalAction(activeConv.id, id, "declined")}
                          />
                        </motion.div>
                      );
                    }
                    return null;
                  })}
                </AnimatePresence>

                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* ── Propose Meetup Action Bar ── */}
              <AnimatePresence>
                {showPropose && (
                  <ProposeMeetupBar
                    onSend={sendProposal}
                    onClose={() => setShowPropose(false)}
                  />
                )}
              </AnimatePresence>

              {/* ── Input Bar ── */}
              <div className="bg-white border-t border-gray-100 px-4 py-3 flex-shrink-0">
                {/* Meetup toggle pill */}
                {!showPropose && (
                  <div className="flex items-center gap-2 mb-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowPropose(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-xs font-semibold border border-blue-100 transition-colors"
                    >
                      <CalendarClock className="w-3.5 h-3.5" />
                      Propose a Meetup
                    </motion.button>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {/* Attachment */}
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 group">
                    <Paperclip className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </button>

                  {/* Photo */}
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 group">
                    <ImageIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </button>

                  {/* Text input */}
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") sendTextMessage(); }}
                      placeholder="Type a message…"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Smile className="w-4 h-4 text-gray-400 hover:text-yellow-400 transition-colors" />
                    </button>
                  </div>

                  {/* Send */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={sendTextMessage}
                    disabled={!inputText.trim()}
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:bg-gray-100 disabled:text-gray-300 bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4"
              >
                <Send className="w-10 h-10 text-blue-300" />
              </motion.div>
              <h3 className="font-semibold text-gray-700 mb-1">Select a conversation</h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Pick a chat from the left to start negotiating your deal
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
