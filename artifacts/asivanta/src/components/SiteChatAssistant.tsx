import { useMemo, useState } from "react";
import {
  Bot,
  ExternalLink,
  Loader2,
  MessageCircle,
  Send,
  X,
} from "lucide-react";

type ChatLink = {
  label: string;
  href: string;
};

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
  links?: ChatLink[];
};

const starterLinks: ChatLink[] = [
  { label: "Instant Quote", href: "/instant-quote" },
  { label: "Sourcing Review", href: "/contact" },
  { label: "Services", href: "/#services" },
];

function clientFallback(message: string): ChatMessage {
  const lower = message.toLowerCase();
  if (
    lower.includes("quote") ||
    lower.includes("rfq") ||
    lower.includes("price")
  ) {
    return {
      id: Date.now() + 1,
      role: "assistant",
      text: "For a quote or RFQ, start with Instant Quote. You can upload a BOM/spec file or build a part list, and ASIVANTA will review it for pricing and supplier comparison.",
      links: [{ label: "Start Instant Quote", href: "/instant-quote" }],
    };
  }
  if (
    lower.includes("contact") ||
    lower.includes("help") ||
    lower.includes("talk")
  ) {
    return {
      id: Date.now() + 1,
      role: "assistant",
      text: "The best next step is the sourcing review form. Share your company, project type, and the sourcing problem you want ASIVANTA to review.",
      links: [{ label: "Contact ASIVANTA", href: "/contact" }],
    };
  }
  return {
    id: Date.now() + 1,
    role: "assistant",
    text: "I can help you find the right ASIVANTA page for supplier sourcing, verification, quote comparison, factory readiness, and client portal access.",
    links: starterLinks,
  };
}

export default function SiteChatAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "Hello. I can help you find the right ASIVANTA page for sourcing, supplier verification, quote comparison, or client access.",
      links: starterLinks,
    },
  ]);

  const currentPath = useMemo(
    () => `${window.location.pathname}${window.location.search}`,
    [],
  );

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          path: currentPath,
          title: document.title,
          history: messages.slice(-6).map(({ role, text }) => ({ role, text })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.answer) {
        throw new Error(data?.error || "Chat unavailable");
      }
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: data.answer,
          links: Array.isArray(data.links) ? data.links : [],
        },
      ]);
    } catch {
      setMessages((current) => [...current, clientFallback(trimmed)]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <section className="fixed bottom-24 right-4 z-[9999] flex h-[min(620px,calc(100vh-120px))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl md:right-6">
          <div className="flex items-center justify-between bg-[#0a1128] px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">ASIVANTA Assistant</h2>
                <p className="text-xs text-blue-100/70">Sourcing guidance</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-[#f6f8fb] px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "border border-gray-100 bg-white text-gray-700 shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  {message.links && message.links.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.links.map((link) => (
                        <a
                          key={`${message.id}-${link.href}`}
                          href={link.href}
                          className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
                        >
                          {link.label}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  Checking ASIVANTA guidance...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className="border-t border-gray-100 bg-white p-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 600))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) sendMessage(e);
                }}
                rows={2}
                className="max-h-24 min-h-[44px] flex-1 resize-none rounded-xl border border-gray-200 bg-[#f8fafc] px-3 py-2 text-sm outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15"
                placeholder="Ask about sourcing, quotes, verification..."
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-6 right-4 z-[9999] inline-flex h-12 items-center gap-2 rounded-full bg-blue-600 px-4 pr-5 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(37,99,235,0.35)] transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_12px_36px_rgba(37,99,235,0.45)] md:right-6"
        aria-label="Open ASIVANTA assistant"
      >
        <MessageCircle className="h-5 w-5" />
        <span>Ask ASIVANTA</span>
      </button>
    </>
  );
}
