import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaArrowUp, FaBolt, FaComments, FaPlus, FaRobot, FaTimes } from "react-icons/fa";
import { sendAiMessage } from "../services/aiAgentApi";
import { getStoredUser } from "../utils/authStorage";
import "./InternovaAIAgent.css";

const STORAGE_KEY = "internova_ai_chat_v1";
const TEASER_KEY = "internova_ai_teaser_dismissed";
const DEFAULT_GREETING = "Hi! 👋 I'm the InternovaTech AI Assistant. I can help with internships, registration, payments, offer letters, courses, quizzes, certificates, account guidance, and other InternovaTech platform questions. How can I help you today?";

const quickActionsFor = (pathname) => {
  if (/^\/internships\/[^/]+/.test(pathname)) return ["Tell me about this internship", "What is the fee?", "How do I enroll?", "What do I get after completion?"];
  if (pathname === "/internships") return ["Find an internship", "Internship duration", "How to register?"];
  if (pathname === "/my-purchases") return ["How do I access my internship?", "Where is my certificate?", "Explain my progress"];
  if (pathname.startsWith("/course/")) return ["How does progress work?", "How do I complete the course?", "Quiz information"];
  if (pathname.startsWith("/quiz/")) return ["How does the quiz work?", "What happens after passing?"];
  if (pathname.startsWith("/certificate/")) return ["How do I get my certificate?", "How can I verify my certificate?"];
  if (pathname === "/contact") return ["Contact support", "Refund help", "Payment help"];
  return ["Explore internships", "How to register?", "Payment help", "Offer letter", "Certificate", "My purchase", "Contact support"];
};

const pageName = (pathname) => {
  if (pathname.startsWith("/internships/")) return "Internship Details";
  if (pathname === "/internships") return "Internships";
  if (pathname === "/my-purchases") return "My Purchases";
  if (pathname.startsWith("/course/")) return "Course Progress";
  if (pathname.startsWith("/quiz/")) return "Quiz";
  if (pathname.startsWith("/certificate/")) return "Certificate";
  if (pathname.startsWith("/admin/")) return "Admin";
  return "InternovaTech";
};

const getInternshipId = (pathname) => {
  const matches = pathname.match(/^\/(?:internships|course|quiz|certificate)\/([a-f\d]{24})/i);
  return matches?.[1] || "";
};

const createId = () => `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
const initialMessages = () => [{ id: createId(), role: "assistant", content: DEFAULT_GREETING, links: [], timestamp: Date.now() }];

function loadChat() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved?.messages) && saved.messages.length ? saved : { conversationId: "", messages: initialMessages() };
  } catch {
    return { conversationId: "", messages: initialMessages() };
  }
}

export default function InternovaAIAgent() {
  const location = useLocation();
  const [saved] = useState(loadChat);
  const [messages, setMessages] = useState(saved.messages);
  const [conversationId, setConversationId] = useState(saved.conversationId);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [teaserVisible, setTeaserVisible] = useState(() => localStorage.getItem(TEASER_KEY) !== "1");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const controllerRef = useRef(null);
  const quickActions = useMemo(() => quickActionsFor(location.pathname), [location.pathname]);

  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ conversationId, messages: messages.slice(-20) })); } catch {}
  }, [conversationId, messages]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isSending, isOpen]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 150); }, [isOpen]);
  useEffect(() => () => controllerRef.current?.abort(), []);

  const dismissTeaser = () => {
    setTeaserVisible(false);
    try { localStorage.setItem(TEASER_KEY, "1"); } catch {}
  };
  const openChat = () => { dismissTeaser(); setIsOpen(true); };
  const clearChat = () => { controllerRef.current?.abort(); setMessages(initialMessages()); setConversationId(""); setError(""); setInput(""); };
  const sendMessage = async (text = input, retrying = false) => {
    const content = String(text || "").trim();
    if (!content || isSending) return;
    const nextUserMessage = { id: createId(), role: "user", content, timestamp: Date.now() };
    const history = messages.slice(-8).map(({ role, content: messageContent }) => ({ role, content: messageContent }));
    if (!retrying) setMessages((current) => [...current, nextUserMessage]);
    setInput(""); setError(""); setIsSending(true);
    controllerRef.current = new AbortController();
    try {
      const data = await sendAiMessage({
        message: content,
        conversationId,
        history,
        context: { route: location.pathname, page: pageName(location.pathname), internshipId: getInternshipId(location.pathname) },
      }, controllerRef.current.signal);
      if (!data?.success || !data?.message) throw new Error(data?.message || "Unable to get a response");
      setConversationId(data.conversationId || conversationId);
      const links = Array.isArray(data.links)
        ? data.links
            .filter((link) => typeof link?.label === "string" && /^\/[a-z0-9/_-]*(?:#[a-z0-9_-]+)?$/i.test(link?.href || ""))
            .slice(0, 2)
        : [];
      setMessages((current) => [...current, { id: createId(), role: "assistant", content: data.message, links, timestamp: Date.now() }]);
    } catch (requestError) {
      if (requestError?.code !== "ERR_CANCELED") setError(requestError?.response?.data?.message || "Sorry, I'm temporarily unable to respond. Please try again in a moment or contact InternovaTech Support.");
    } finally { setIsSending(false); controllerRef.current = null; }
  };
  const onKeyDown = (event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } };
  const user = getStoredUser();
  const greeting = user?.name ? `Welcome back, ${String(user.name).split(" ")[0]}!` : "InternovaTech AI";

  return <div className="internova-ai-root">
    {!isOpen && teaserVisible && <div className="internova-ai-teaser" role="status"><span>Hi 👋 Need help with InternovaTech?</span><button onClick={dismissTeaser} aria-label="Dismiss welcome message"><FaTimes /></button></div>}
    {isOpen && <section className="internova-ai-panel" role="dialog" aria-modal="false" aria-label="InternovaTech AI Support Assistant">
      <header className="internova-ai-header"><div className="internova-ai-brand"><span className="internova-ai-avatar"><FaRobot /></span><span><strong>{greeting}</strong><small><i /> Online · Support assistant</small></span></div><div className="internova-ai-header-actions"><button onClick={clearChat} aria-label="Start a new chat" title="New chat"><FaPlus /></button><button onClick={() => setIsOpen(false)} aria-label="Close AI assistant" title="Close"><FaTimes /></button></div></header>
      <div className="internova-ai-messages" aria-live="polite">
        {messages.map((message) => <article key={message.id} className={`internova-ai-message ${message.role}`}><div className="internova-ai-bubble">{message.content}</div>{message.role === "assistant" && message.links?.length > 0 && <nav className="internova-ai-message-links" aria-label="Recommended InternovaTech pages">{message.links.map((link) => <a key={link.href} href={link.href}>{link.label} <span aria-hidden="true">→</span></a>)}</nav>}<time>{new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time></article>)}
        {isSending && <div className="internova-ai-typing" aria-label="Assistant is typing"><span /><span /><span /></div>}
        {error && <div className="internova-ai-error"><span>{error}</span><button onClick={() => sendMessage(messages.at(-1)?.role === "user" ? messages.at(-1).content : "", true)}>Retry</button></div>}
        <div ref={messagesEndRef} />
      </div>
      {messages.length <= 1 && <div className="internova-ai-actions" aria-label="Suggested questions">{quickActions.map((action) => <button key={action} onClick={() => sendMessage(action)} disabled={isSending}>{action}</button>)}</div>}
      <div className="internova-ai-composer"><textarea ref={inputRef} value={input} maxLength={2000} rows="1" onChange={(event) => setInput(event.target.value)} onKeyDown={onKeyDown} placeholder="Ask about InternovaTech..." aria-label="Message InternovaTech AI" disabled={isSending} /><button onClick={() => sendMessage()} disabled={!input.trim() || isSending} aria-label="Send message"><FaArrowUp /></button></div>
      <p className="internova-ai-note"><FaBolt /> Answers are limited to InternovaTech support.</p>
    </section>}
    <button className="internova-ai-fab" onClick={openChat} aria-label="Open InternovaTech AI support assistant" aria-expanded={isOpen}>{isOpen ? <FaTimes /> : <><FaComments /><span>AI</span></>}</button>
  </div>;
}
