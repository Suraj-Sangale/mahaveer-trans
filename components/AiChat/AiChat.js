"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import "./AiChat.css";

// ── Icons (inline SVG — no extra deps) ────────────────────────────────────────

function IconChat() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function IconBot() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <line x1="12" y1="7" x2="12" y2="11" />
      <line x1="8" y1="15" x2="8" y2="17" />
      <line x1="16" y1="15" x2="16" y2="17" />
    </svg>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // controls DOM presence after close animation
  const [showBadge, setShowBadge] = useState(true);
  const [messages, setMessages] = useState([]); // { role: "user"|"ai", content, time }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const closingTimer = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, open]);

  // Focus textarea when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 280);
    }
  }, [open]);

  const handleOpen = () => {
    clearTimeout(closingTimer.current);
    setMounted(true);
    setShowBadge(false);
    // Small tick to let DOM render before triggering animation
    requestAnimationFrame(() => setOpen(true));
  };

  const handleClose = () => {
    setOpen(false);
    // Wait for close animation to finish before unmounting
    closingTimer.current = setTimeout(() => setMounted(false), 250);
  };

  const handleToggle = () => (open ? handleClose() : handleOpen());

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

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.reply, time: new Date() },
      ]);
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
        className="ai-chat-trigger"
        onClick={handleToggle}
        aria-label={open ? "Close AI chat" : "Open AI chat"}
        aria-expanded={open}
      >
        {open ? <IconX /> : <IconChat />}
        {showBadge && !open && <span className="ai-chat-badge" aria-hidden="true" />}
      </button>

      {/* Chat panel — only in DOM while open or animating closed */}
      {mounted && (
        <div
          id="ai-chat-panel"
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
          <div className="ai-chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
            {messages.length === 0 && (
              <div className="ai-chat-welcome">
                <div className="ai-chat-welcome-icon">
                  <IconBot />
                </div>
                <h4>Hi! I&apos;m your Mahaveer Trans assistant 👋</h4>
                <p>
                  Ask me about our logistics services, cargo tracking, freight
                  quotes, or anything else we can help with.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`ai-msg ${msg.role}`}>
                <div className="ai-msg-bubble">{msg.content}</div>
                <span className="ai-msg-time">{formatTime(msg.time)}</span>
              </div>
            ))}

            {loading && (
              <div className="ai-typing-indicator" aria-label="AI is typing">
                <div className="ai-typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

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
