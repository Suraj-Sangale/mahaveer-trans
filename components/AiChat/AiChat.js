"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import "./AiChat.css";

// ── Icons ──────────────────────────────────────────────────────────────────────

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

function IconArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconMic({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function IconSpeaker({ speaking }) {
  if (speaking) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="6" width="12" height="12" rx="2" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

// ── Languages & Localized Strings ──────────────────────────────────────────────

const LANGUAGES = [
  { code: "en", label: "English", speechLang: "en-IN", flag: "🇬🇧" },
  { code: "hi", label: "हिन्दी", speechLang: "hi-IN", flag: "🇮🇳" },
  { code: "mr", label: "मराठी", speechLang: "mr-IN", flag: "🚩" },
  { code: "gu", label: "ગુજરાતી", speechLang: "gu-IN", flag: "🪔" },
];

const I18N = {
  en: {
    name: "Mahaveer Trans Support",
    status: "AI Assistant · Online",
    welcomeTitle: "Hi! I'm your Mahaveer Trans assistant 👋",
    welcomeDesc: "Ask me about freight services, cargo tracking, quotes, or navigate to:",
    placeholder: "Type message or click 🎤 to speak…",
    listening: "🎙️ Listening… Speak in English",
    speakBtn: "Listen to answer",
    stopBtn: "Stop listening",
    micBtn: "Voice input",
    navPills: [
      { label: "📍 Track Cargo", path: "/tracking" },
      { label: "💰 Request Quote", path: "/quote" },
      { label: "🚛 Fleet Info", path: "/fleet" },
      { label: "🛠️ Services", path: "/services" },
      { label: "📞 Contact Us", path: "/contact" },
    ],
  },
  hi: {
    name: "महावीर ट्रांस सपोर्ट",
    status: "AI सहायक · ऑनलाइन",
    welcomeTitle: "नमस्ते! मैं आपका महावीर ट्रांस सहायक हूँ 👋",
    welcomeDesc: "मुझसे फ्रेट सेवाओं, लाइव कार्गो ट्रैकिंग, कोटेशन के बारे में पूछें या सीधे पेज खोलें:",
    placeholder: "संदेश लिखें या बोलने के लिए 🎤 दबाएं…",
    listening: "🎙️ सुन रहे हैं… कृपया हिन्दी में बोलें",
    speakBtn: "उत्तर सुनें",
    stopBtn: "रोकें",
    micBtn: "आवाज से बोलें",
    navPills: [
      { label: "📍 कार्गो ट्रैक करें", path: "/tracking" },
      { label: "💰 कोटेशन प्राप्त करें", path: "/quote" },
      { label: "🚛 फ्लीट और ट्रक", path: "/fleet" },
      { label: "🛠️ हमारी सेवाएं", path: "/services" },
      { label: "📞 संपर्क करें", path: "/contact" },
    ],
  },
  mr: {
    name: "महावीर ट्रान्स सपोर्ट",
    status: "AI सहाय्यक · ऑनलाइन",
    welcomeTitle: "नमस्कार! मी आपला महावीर ट्रान्स सहाय्यक आहे 👋",
    welcomeDesc: "आमच्या मालवाहतूक सेवा, थेट ट्रॅकिंग, दर कोटेशनबद्दल विचारा किंवा थेट पृष्ठावर जा:",
    placeholder: "संदेश टाईप करा किंवा बोलण्यासाठी 🎤 दाबा…",
    listening: "🎙️ ऐकत आहे… कृपया मराठीत बोला",
    speakBtn: "उत्तर ऐका",
    stopBtn: "थांबवा",
    micBtn: "आवाजाने बोला",
    navPills: [
      { label: "📍 माल ट्रॅकिंग", path: "/tracking" },
      { label: "💰 कोटेशन मिळवा", path: "/quote" },
      { label: "🚛 फ्लीट आणि वाहने", path: "/fleet" },
      { label: "🛠️ वाहतूक सेवा", path: "/services" },
      { label: "📞 संपर्क साधा", path: "/contact" },
    ],
  },
  gu: {
    name: "મહાવીર ટ્રાન્સ સપોર્ટ",
    status: "AI સહાયક · ઓનલાઇન",
    welcomeTitle: "નમસ્તે! હું તમારો મહાવીર ટ્રાન્સ સહાયક છું 👋",
    welcomeDesc: "અમારી ફ્રેટ સેવાઓ, લાઇવ કાર્ગો ટ્રેકિંગ, ક્વોટેશન વિશે પૂછો અથવા પેજ ખોલો:",
    placeholder: "સંદેશ લખો અથવા બોલવા માટે 🎤 દબાવો…",
    listening: "🎙️ સાંભળી રહ્યા છીએ… કૃપા કરીને ગુજરાતીમાં બોલો",
    speakBtn: "જવાબ સાંભળો",
    stopBtn: "રોકો",
    micBtn: "અવાજથી બોલો",
    navPills: [
      { label: "📍 કાર્ગો ટ્રેક કરો", path: "/tracking" },
      { label: "💰 ક્વોટેશન મેળવો", path: "/quote" },
      { label: "🚛 ફ્લીટ વાહનો", path: "/fleet" },
      { label: "🛠️ અમારી સેવાઓ", path: "/services" },
      { label: "📞 અમારો સંપર્ક કરો", path: "/contact" },
    ],
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function parseMessageContent(content) {
  if (!content) return [];

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

  return tokens;
}

function detectNavigationIntent(text) {
  if (!text) return null;
  const lower = text.toLowerCase();

  const tagMatch = text.match(/\[\[?NAVIGATE:([a-zA-Z0-9_\-\/]+)\]?\]/i);
  if (tagMatch) {
    return tagMatch[1];
  }

  const quoteWords = ["quote", "price", "pricing", "rate", "cost", "booking", "कोटेशन", "रेट", "किराया", "दाम", "दर", "भाव", "भाडे", "ક્વોટ", "ભાડું"];
  if (quoteWords.some((w) => lower.includes(w))) {
    return "/quote";
  }

  const trackWords = ["track", "tracking", "cargo status", "consignment", "shipment", "पार्सल", "ट्रैक", "ट्रैकिंग", "ट्रॅक", "ट्रॅकिंग", "ટ્રેક", "ટ્રેકિંગ"];
  if (trackWords.some((w) => lower.includes(w))) {
    return "/tracking";
  }

  const fleetWords = ["fleet", "truck", "trucks", "vehicle", "vehicles", "trailer", "container", "फ्लीट", "गाड़ी", "गाड़ियां", "गाडी", "वाहने", "વાહનો", "વાહન"];
  if (fleetWords.some((w) => lower.includes(w))) {
    return "/fleet";
  }

  const serviceWords = ["service", "services", "logistics", "warehousing", "सेवाएं", "सेवा", "सर्विस", "सर्व्हिस", "સેવાઓ", "સેવા"];
  if (serviceWords.some((w) => lower.includes(w))) {
    return "/services";
  }

  const contactWords = ["contact", "call", "reach", "phone", "support", "address", "संपर्क", "फोन", "पत्ता", "સરનામું", "કોલ"];
  if (contactWords.some((w) => lower.includes(w))) {
    return "/contact";
  }

  const aboutWords = ["about", "company", "who are you", "कंपनी", "बद्दल", "વિશે"];
  if (aboutWords.some((w) => lower.includes(w))) {
    return "/about";
  }

  const homeWords = ["home", "main page", "होम", "મુખ્ય"];
  if (homeWords.some((w) => lower.includes(w))) {
    return "/";
  }

  return null;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function AiChat() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [navigatingToast, setNavigatingToast] = useState(null);

  const [language, setLanguage] = useState("en");
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgIndex, setSpeakingMsgIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const closingTimer = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const recognitionRef = useRef(null);

  const t = I18N[language] || I18N.en;

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, open, navigatingToast]);

  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 280);
    }
  }, [open]);

  const handleOpen = useCallback(() => {
    clearTimeout(closingTimer.current);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-floating-widget", { detail: { id: "ai-chat" } }));
    }
    setMounted(true);
    setShowBadge(false);
    requestAnimationFrame(() => setOpen(true));
  }, []);

  const handleClose = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIndex(null);
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setOpen(false);
    closingTimer.current = setTimeout(() => setMounted(false), 250);
  }, [isListening]);

  const handleNavigate = useCallback((path) => {
    router.push(path);
    if (typeof window !== "undefined" && window.innerWidth <= 640) {
      handleClose();
    }
  }, [router, handleClose]);

  const handleToggle = () => (open ? handleClose() : handleOpen());

  useEffect(() => {
    const handleOtherOpen = (e) => {
      if (e.detail?.id !== "ai-chat" && open) {
        handleClose();
      }
    };
    window.addEventListener("open-floating-widget", handleOtherOpen);
    return () => window.removeEventListener("open-floating-widget", handleOtherOpen);
  }, [open, handleClose]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && triggerRef.current && !triggerRef.current.contains(e.target)) {
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

  const toggleListening = useCallback(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      const currentLangConfig = LANGUAGES.find((l) => l.code === language);
      recognition.lang = currentLangConfig?.speechLang || "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError("");
      };
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map((r) => r[0].transcript).join("");
        setInput(transcript);
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
          textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 110) + "px";
        }
      };
      recognition.onerror = (event) => {
        if (event.error !== "no-speech") setError(`Microphone error: ${event.error}`);
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setError("Could not access microphone.");
    }
  }, [isListening, language]);

  const speakMessage = useCallback((text, msgIndex) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setError("Text-to-speech is not supported in this browser.");
      return;
    }
    if (speakingMsgIndex === msgIndex) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIndex(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanSpeech = text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\*\*/g, "")
      .replace(/\[\[?NAVIGATE:[^\]]+\]?\]/g, "")
      .trim();

    if (!cleanSpeech) return;
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    const currentLangConfig = LANGUAGES.find((l) => l.code === language);
    const targetLang = currentLangConfig?.speechLang || "en-IN";
    utterance.lang = targetLang;
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(targetLang) || v.lang.includes(language));
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onstart = () => setSpeakingMsgIndex(msgIndex);
    utterance.onend = () => setSpeakingMsgIndex(null);
    utterance.onerror = () => setSpeakingMsgIndex(null);

    window.speechSynthesis.speak(utterance);
  }, [language, speakingMsgIndex]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsg = { role: "user", content: text, time: new Date() };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const langConfig = LANGUAGES.find((l) => l.code === language);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `The user's preferred conversation language is ${langConfig?.label || "English"} (${language}). Respond naturally in ${langConfig?.label || "English"}.`,
            },
            ...updatedMessages.map((m) => ({
              role: m.role === "ai" ? "assistant" : "user",
              content: m.content,
            })),
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get response.");

      const rawReply = data.reply || "";
      const navTagMatch = rawReply.match(/\[\[?NAVIGATE:([a-zA-Z0-9_\-\/]+)\]?\]/i);
      let targetPath = navTagMatch ? navTagMatch[1] : null;

      if (!targetPath) targetPath = detectNavigationIntent(text);

      const cleanReply = rawReply.replace(/\[\[?NAVIGATE:[a-zA-Z0-9_\-\/]+\]?\]/gi, "").trim();

      setMessages((prev) => [...prev, { role: "ai", content: cleanReply, time: new Date() }]);

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
  }, [input, loading, messages, language, isListening, handleNavigate]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 110) + "px";
  };

  return (
    <>
      <button
        id="ai-chat-trigger-btn"
        ref={triggerRef}
        className="ai-chat-trigger"
        onClick={handleToggle}
        aria-label={open ? "Close AI chat" : "Open AI chat"}
        aria-expanded={open}
      >
        {open ? <IconX /> : <IconChat />}
        {showBadge && !open && <span className="ai-chat-badge" aria-hidden="true" />}
      </button>

      {mounted && (
        <div
          id="ai-chat-panel"
          ref={panelRef}
          className="ai-chat-panel"
          data-open={String(open)}
          role="dialog"
          aria-label="Mahaveer Trans AI Multilingual Voice & Chat Support"
          aria-modal="false"
        >
          <div className="ai-chat-header">
            <div className="ai-chat-avatar"><IconBot /></div>
            <div className="ai-chat-header-info">
              <div className="ai-chat-header-name">{t.name}</div>
              <div className="ai-chat-header-status">
                <span className="ai-chat-status-dot" aria-hidden="true" />
                {t.status}
              </div>
            </div>
            <button id="ai-chat-close-btn" className="ai-chat-close" onClick={handleClose} aria-label="Close chat">
              <IconX />
            </button>
          </div>

          <div className="ai-lang-switcher" role="radiogroup" aria-label="Select Chat Language">
            {LANGUAGES.map((item) => (
              <button
                key={item.code}
                type="button"
                className={`ai-lang-btn ${language === item.code ? "active" : ""}`}
                onClick={() => setLanguage(item.code)}
                aria-checked={language === item.code}
                role="radio"
              >
                <span className="ai-lang-flag">{item.flag}</span>
                <span className="ai-lang-name">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="ai-chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
            {messages.length === 0 && (
              <div className="ai-chat-welcome">
                <div className="ai-chat-welcome-icon"><IconBot /></div>
                <h4>{t.welcomeTitle}</h4>
                <p>{t.welcomeDesc}</p>
                <div className="ai-quick-pills-list">
                  {t.navPills.map((item, idx) => (
                    <button key={idx} type="button" className="ai-quick-pill" onClick={() => handleNavigate(item.path)}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`ai-msg ${msg.role}`}>
                <div className="ai-msg-bubble">
                  {parseMessageContent(msg.content).map((token, idx) => {
                    if (token.type === "bold") {
                      return <strong key={idx}>{token.value}</strong>;
                    }
                    if (token.type === "link") {
                      if (token.href.startsWith("/")) {
                        return (
                          <button
                            key={idx}
                            type="button"
                            className="ai-nav-chip-inline"
                            onClick={() => handleNavigate(token.href)}
                            title={`Go to ${token.label}`}
                          >
                            <span>{token.label}</span>
                            <IconArrowRight />
                          </button>
                        );
                      }
                      return (
                        <a key={idx} href={token.href} target="_blank" rel="noopener noreferrer" className="ai-link">
                          {token.label} ↗
                        </a>
                      );
                    }
                    if (token.type === "rawUrl") {
                      return (
                        <a key={idx} href={token.href} target="_blank" rel="noopener noreferrer" className="ai-link">
                          {token.href}
                        </a>
                      );
                    }
                    return <React.Fragment key={idx}>{token.value}</React.Fragment>;
                  })}
                </div>
                <div className="ai-msg-footer">
                  <span className="ai-msg-time">{formatTime(msg.time)}</span>
                  {msg.role === "ai" && (
                    <button
                      type="button"
                      className={`ai-speak-btn ${speakingMsgIndex === i ? "active" : ""}`}
                      onClick={() => speakMessage(msg.content, i)}
                      title={speakingMsgIndex === i ? t.stopBtn : t.speakBtn}
                      aria-label={speakingMsgIndex === i ? t.stopBtn : t.speakBtn}
                    >
                      <IconSpeaker speaking={speakingMsgIndex === i} />
                      <span className="ai-speak-label">{speakingMsgIndex === i ? "Stop" : "Listen"}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="ai-typing-indicator" aria-label="AI is typing">
                <div className="ai-typing-dots"><span /><span /><span /></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {isListening && (
            <div className="ai-listening-bar" role="status">
              <span className="ai-listening-pulse" />
              <span>{t.listening}</span>
              <button type="button" className="ai-listening-stop-btn" onClick={toggleListening}>Done</button>
            </div>
          )}

          {navigatingToast && (
            <div className="ai-nav-toast" role="status">
              <span className="ai-nav-toast-dot" />
              <span>🚀 Navigating to <strong>{navigatingToast}</strong>…</span>
            </div>
          )}

          {error && <div className="ai-chat-error" role="alert">⚠ {error}</div>}

          <div className="ai-chat-input-area">
            <button
              id="ai-chat-mic-btn"
              type="button"
              className={`ai-chat-mic ${isListening ? "listening" : ""}`}
              onClick={toggleListening}
              aria-label={isListening ? t.stopBtn : t.micBtn}
              title={isListening ? t.stopBtn : t.micBtn}
            >
              <IconMic active={isListening} />
            </button>

            <textarea
              id="ai-chat-input"
              ref={textareaRef}
              className="ai-chat-textarea"
              placeholder={isListening ? t.listening : t.placeholder}
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
              aria-label={t.send}
              title={t.send}
            >
              <IconSend />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
