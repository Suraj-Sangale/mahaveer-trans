"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import "./AiChat.css";

// ── Icons (inline SVG — no extra deps) ────────────────────────────────────────

function IconChat() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function IconBot() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <line x1="12" y1="7" x2="12" y2="11" />
      <line x1="8" y1="15" x2="8" y2="17" />
      <line x1="16" y1="15" x2="16" y2="17" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Quick navigation links available across the site
const QUICK_NAV_ITEMS = [
  { label: "📍 Track Cargo", path: "/tracking" },
  { label: "💰 Request Quote", path: "/quote" },
  { label: "🚛 Fleet Info", path: "/fleet" },
  { label: "🛠️ Services", path: "/services" },
  { label: "📞 Contact Us", path: "/contact" },
];

function renderMessageContent(content, onNavigate) {
  if (!content) return null;

  // Regex matches:
  // 1. [Label](url_or_path)
  // 2. **bold**
  // 3. raw https:// URL
  const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|(https?:\/\/[^\s]+))/g;
  const tokens = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }

    if (match[2] && match[3]) {
      tokens.push({ type: "link", label: match[2], href: match[3] });
    } else if (match[5]) {
      tokens.push({ type: "bold", value: match[5] });
    } else if (match[6]) {
      tokens.push({ type: "rawUrl", href: match[6] });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    tokens.push({ type: "text", value: content.slice(lastIndex) });
  }

  return tokens.map((token, idx) => {
    if (token.type === "bold") {
      return <strong key={idx}>{token.value}</strong>;
    }

    if (token.type === "link") {
      const isInternal = token.href.startsWith("/");
      if (isInternal) {
        return (
          <button
            key={idx}
            type="button"
            className="ai-nav-chip-inline"
            onClick={(e) => {
              e.preventDefault();
              onNavigate(token.href);
            }}
            title={`Go to ${token.label}`}
          >
            <span>{token.label}</span>
            <IconArrowRight />
          </button>
        );
      }
      return (
        <a
          key={idx}
          href={token.href}
          target="_blank"
          rel="noopener noreferrer"
          className="ai-link"
        >
          {token.label} ↗
        </a>
      );
    }

    if (token.type === "rawUrl") {
      return (
        <a
          key={idx}
          href={token.href}
          target="_blank"
          rel="noopener noreferrer"
          className="ai-link"
        >
          {token.href}
        </a>
      );
    }

    return <React.Fragment key={idx}>{token.value}</React.Fragment>;
  });
}

function detectNavigationIntent(text) {
  if (!text) return null;
  const lower = text.toLowerCase();

  // 1. Direct tag match: [[NAVIGATE:/path]] or [NAVIGATE:/path]
  const tagMatch = text.match(/\[\[?NAVIGATE:([a-zA-Z0-9_\-\/]+)\]?\]/i);
  if (tagMatch) {
    return tagMatch[1];
  }

  // 2. Fallback heuristic pattern matching if user explicitly typed a navigation command
  const navCommands = ["go to", "goto", "take me to", "open", "navigate to", "redirect to", "show me", "take me", "show page", "view"];
  const hasNavCommand = navCommands.some((cmd) => lower.includes(cmd));

  if (hasNavCommand) {
    if (lower.includes("quote") || lower.includes("price") || lower.includes("pricing") || lower.includes("rate") || lower.includes("estimate") || lower.includes("cost") || lower.includes("booking")) {
      return "/quote";
    }
    if (lower.includes("track") || lower.includes("tracking") || lower.includes("cargo status") || lower.includes("consignment") || lower.includes("shipment")) {
      return "/tracking";
    }
    if (lower.includes("fleet") || lower.includes("truck") || lower.includes("vehicle") || lower.includes("trailer") || lower.includes("container")) {
      return "/fleet";
    }
    if (lower.includes("service") || lower.includes("services") || lower.includes("logistics") || lower.includes("warehousing")) {
      return "/services";
    }
    if (lower.includes("contact") || lower.includes("call") || lower.includes("reach") || lower.includes("phone") || lower.includes("support")) {
      return "/contact";
    }
    if (lower.includes("about") || lower.includes("company") || lower.includes("who are you")) {
      return "/about";
    }
    if (lower.includes("home") || lower.includes("main page")) {
      return "/";
    }
  }

  return null;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function AiChat() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // controls DOM presence after close animation
  const [showBadge, setShowBadge] = useState(true);
  const [messages, setMessages] = useState([]); // { role: "user"|"ai", content, time }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [navigatingToast, setNavigatingToast] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const closingTimer = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, open, navigatingToast]);

  // Focus textarea when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 280);
    }
  }, [open]);

  const handleOpen = useCallback(() => {
    clearTimeout(closingTimer.current);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-floating-widget", { detail: { id: "ai-chat" } })
      );
    }
    setMounted(true);
    setShowBadge(false);
    requestAnimationFrame(() => setOpen(true));
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    closingTimer.current = setTimeout(() => setMounted(false), 250);
  }, []);

  const handleNavigate = useCallback(
    (path) => {
      router.push(path);
      // On mobile screens, auto-close the chat panel so the destination page is visible
      if (typeof window !== "undefined" && window.innerWidth <= 640) {
        handleClose();
      }
    },
    [router, handleClose]
  );

  const handleToggle = () => (open ? handleClose() : handleOpen());

  // Listen for open events from other floating widgets
  useEffect(() => {
    const handleOtherOpen = (e) => {
      if (e.detail?.id !== "ai-chat" && open) {
        handleClose();
      }
    };

    window.addEventListener("open-floating-widget", handleOtherOpen);
    return () => window.removeEventListener("open-floating-widget", handleOtherOpen);
  }, [open, handleClose]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        handleClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleClose]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text, time: new Date() };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response.");
      }

      const rawReply = data.reply || "";

      // 1. Extract navigation intent from AI response tag [[NAVIGATE:/path]]
      const navTagMatch = rawReply.match(/\[\[?NAVIGATE:([a-zA-Z0-9_\-\/]+)\]?\]/i);
      let targetPath = navTagMatch ? navTagMatch[1] : null;

      // 2. Fallback: check user input for explicit navigation command
      if (!targetPath) {
        targetPath = detectNavigationIntent(text);
      }

      // 3. Clean any tag from the visible text
      const cleanReply = rawReply.replace(/\[\[?NAVIGATE:[a-zA-Z0-9_\-\/]+\]?\]/gi, "").trim();

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: cleanReply, time: new Date() },
      ]);

      // 4. Automatically navigate the page!
      if (targetPath) {
        setNavigatingToast(targetPath);
        setTimeout(() => {
          handleNavigate(targetPath);
          setTimeout(() => setNavigatingToast(null), 1400);
        }, 800);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  // Send on Enter (Shift+Enter = newline)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-resize textarea
  const handleInput = (e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 110) + "px";
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        id="ai-chat-trigger-btn"
        ref={triggerRef}
        className="ai-chat-trigger"
        onClick={handleToggle}
        aria-label={open ? "Close AI chat" : "Open AI chat"}
        aria-expanded={open}
      >
        {open ? <IconX /> : <IconChat />}
        {showBadge && !open && (
          <span className="ai-chat-badge" aria-hidden="true" />
        )}
      </button>

      {/* Chat panel — only in DOM while open or animating closed */}
      {mounted && (
        <div
          id="ai-chat-panel"
          ref={panelRef}
          className="ai-chat-panel"
          data-open={String(open)}
          role="dialog"
          aria-label="Mahaveer Trans AI Support"
          aria-modal="false"
        >
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-avatar">
              <IconBot />
            </div>
            <div className="ai-chat-header-info">
              <div className="ai-chat-header-name">Mahaveer Trans Support</div>
              <div className="ai-chat-header-status">
                <span className="ai-chat-status-dot" aria-hidden="true" />
                AI Assistant · Online
              </div>
            </div>
            <button
              id="ai-chat-close-btn"
              className="ai-chat-close"
              onClick={handleClose}
              aria-label="Close chat"
            >
              <IconX />
            </button>
          </div>

          {/* Messages */}
          <div
            className="ai-chat-messages"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.length === 0 && (
              <div className="ai-chat-welcome">
                <div className="ai-chat-welcome-icon">
                  <IconBot />
                </div>
                <h4>Hi! I&apos;m your Mahaveer Trans assistant 👋</h4>
                <p>
                  Ask me about our freight services, cargo tracking, quotes, or navigate to:
                </p>
                <div className="ai-quick-pills-list">
                  {QUICK_NAV_ITEMS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="ai-quick-pill"
                      onClick={() => handleNavigate(item.path)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`ai-msg ${msg.role}`}>
                <div className="ai-msg-bubble">
                  {renderMessageContent(msg.content, handleNavigate)}
                </div>

                <span className="ai-msg-time">{formatTime(msg.time)}</span>
              </div>
            ))}

            {loading && (
              <div className="ai-typing-indicator" aria-label="AI is typing">
                <div className="ai-typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Navigation indicator toast */}
          {navigatingToast && (
            <div className="ai-nav-toast" role="status">
              <span className="ai-nav-toast-dot" />
              <span>
                🚀 Navigating to <strong>{navigatingToast}</strong>…
              </span>
            </div>
          )}

          {/* Error bar */}
          {error && (
            <div className="ai-chat-error" role="alert">
              ⚠ {error}
            </div>
          )}

          {/* Input */}
          <div className="ai-chat-input-area">
            <textarea
              id="ai-chat-input"
              ref={textareaRef}
              className="ai-chat-textarea"
              placeholder="Type your message…"
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              rows={1}
              aria-label="Chat message input"
              disabled={loading}
            />
            <button
              id="ai-chat-send-btn"
              className="ai-chat-send"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <IconSend />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
