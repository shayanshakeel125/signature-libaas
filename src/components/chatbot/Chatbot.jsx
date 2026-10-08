import { useCallback, useEffect, useRef, useState } from 'react';
import ChatbotMessage from './ChatbotMessage';
import ChatbotTyping from './ChatbotTyping';
import { sendChatMessage } from './chatApi';
import './Chatbot.css';

/** Provided by the user – lives in /public/images (BASE_URL keeps it working on GitHub Pages). */
const ROBOT_AVATAR = `${import.meta.env.BASE_URL}images/signature-ai-robot.png`;

const WELCOME_MESSAGE = "Hi! 👋 I'm Signature AI. How can I help you today?";
const SUGGESTIONS = ['View Products', 'Check Prices', 'Order Help', 'Size Guide'];
const ERROR_MESSAGE =
  "I couldn't reach our assistant service just now. Please try again in a moment. 🙏";

let messageCounter = 0;
const createMessage = (role, text) => ({
  id: `sig-msg-${Date.now()}-${messageCounter++}`,
  role,
  text,
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
});

/**
 * Signature AI – floating shopping assistant.
 * Fixed on the left side, available on every storefront page,
 * hidden on the /admin panel (App.jsx decides where it mounts).
 */
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const windowRef = useRef(null);
  const launcherRef = useRef(null);
  const seededRef = useRef(false);
  const isOpenRef = useRef(false);

  /* Always keep the newest message in view (never touches page scroll). */
  useEffect(() => {
    const list = listRef.current;
    if (!list || !isOpen) return;
    list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const openChat = useCallback(() => {
    isOpenRef.current = true;
    setIsOpen(true);

    // Welcome message + quick replies appear the very first time only.
    if (!seededRef.current) {
      seededRef.current = true;
      setMessages([createMessage('assistant', WELCOME_MESSAGE)]);
      setShowSuggestions(true);
    }

    // Focus the input once the window has faded in.
    window.setTimeout(() => {
      if (isOpenRef.current) inputRef.current?.focus({ preventScroll: true });
    }, 220);
  }, []);

  const closeChat = useCallback(() => {
    isOpenRef.current = false;
    setIsOpen(false);
    // Give focus back to the launcher (keyboard users never lose their place).
    window.setTimeout(() => {
      if (!isOpenRef.current) launcherRef.current?.focus({ preventScroll: true });
    }, 60);
  }, []);

  /* Escape key closes the messenger. */
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeChat();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeChat]);

  /* Chat window ke bahar kahin bhi click → chatbot khud band ho jaye. */
  useEffect(() => {
    if (!isOpen) return undefined;

    const onPointerDown = (event) => {
      const target = event.target;
      // Chat window ya floating robot button par click → kuch mat karo
      if (
        windowRef.current?.contains(target) ||
        launcherRef.current?.contains(target)
      ) {
        return;
      }
      closeChat();
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [isOpen, closeChat]);

  const handleSend = useCallback(
    async (overrideText, sendOptions = {}) => {
      const text =
        (typeof overrideText === 'string' ? overrideText : inputValue).trim();
      if (!text || isTyping) return;

      inputRef.current?.focus({ preventScroll: true });
      setInputValue('');
      if (inputRef.current) inputRef.current.style.height = 'auto';
      setShowSuggestions(false);
      setMessages((prev) => [...prev, createMessage('user', text)]);
      setIsTyping(true);

      try {
        // Suggestion chips send English labels – the reply still
        // follows the language the visitor has been typing in.
        const reply = await sendChatMessage(text, sendOptions);
        setMessages((prev) => [...prev, createMessage('assistant', reply)]);
      } catch {
        setMessages((prev) => [...prev, createMessage('assistant', ERROR_MESSAGE)]);
      } finally {
        setIsTyping(false);
      }
    },
    [inputValue, isTyping]
  );

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    // Auto-grow the textarea (up to a comfortable limit).
    const el = event.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const canSend = inputValue.trim().length > 0 && !isTyping;

  return (
    <div className={`sig-chat-root${isOpen ? ' is-open' : ''}`}>
      {/* ============ MESSENGER WINDOW ============ */}
      <section
        id="sig-chat-window"
        ref={windowRef}
        className="sig-chat-window"
        role="dialog"
        aria-label="Signature AI shopping assistant"
        aria-hidden={!isOpen}
      >
        <header className="sig-chat-header">
          <span className="sig-chat-header__avatar">
            <img src={ROBOT_AVATAR} alt="" aria-hidden="true" />
            <span className="sig-chat-header__status" aria-hidden="true" />
          </span>

          <div className="sig-chat-header__meta">
            <h2 className="sig-chat-header__name">
              <span className="sig-chat-header__brand">Signature</span> AI
            </h2>
            <p className={`sig-chat-header__presence${isTyping ? ' is-typing' : ''}`}>
              {isTyping ? 'Typing…' : 'Online'}
            </p>
          </div>

          <button
            type="button"
            className="sig-chat-close"
            onClick={closeChat}
            aria-label="Close chat window"
            title="Close (Esc)"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M2 2l10 10M12 2L2 12" />
            </svg>
          </button>
        </header>

        <div
          className="sig-chat-list"
          ref={listRef}
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
        >
          {messages.map((message) => (
            <ChatbotMessage key={message.id} message={message} avatarSrc={ROBOT_AVATAR} />
          ))}

          {showSuggestions && (
            <div className="sig-chat-suggestions" aria-label="Suggested questions">
              {SUGGESTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="sig-chat-chip"
                  onClick={() => handleSend(item, { fromSuggestion: true })}
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {isTyping && <ChatbotTyping variant="inline" avatarSrc={ROBOT_AVATAR} />}
        </div>

        <form
          className="sig-chat-input"
          onSubmit={(event) => {
            event.preventDefault();
            handleSend();
          }}
        >
          <div className="sig-chat-input__row">
            <label className="sig-chat-sr" htmlFor="sig-chat-textarea">
              Message Signature AI
            </label>
            <textarea
              id="sig-chat-textarea"
              ref={inputRef}
              className="sig-chat-textarea"
              rows={1}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder="Ask about products, prices, orders…"
            />
            <button
              type="submit"
              className="sig-chat-send"
              disabled={!canSend}
              aria-label="Send message"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>

          <p className="sig-chat-hint">
            Press Enter to send · Shift + Enter for a new line
          </p>
        </form>
      </section>

      {/* ============ FLOATING ROBOT AVATAR ============ */}
      <div className="sig-chat-launcher">
        {isTyping && <ChatbotTyping variant="float" />}

        <button
          type="button"
          ref={launcherRef}
          className={`sig-chat-avatar${isTyping ? ' is-typing' : ''}`}
          onClick={isOpen ? closeChat : openChat}
          aria-expanded={isOpen}
          aria-controls="sig-chat-window"
          aria-label={isOpen ? 'Close Signature AI chat' : 'Open Signature AI chat'}
        >
          <img src={ROBOT_AVATAR} alt="" aria-hidden="true" />
          <span className="sig-chat-avatar__status" aria-hidden="true" />
        </button>

        <span className="sig-chat-avatar__label" aria-hidden="true">
          Signature AI
        </span>
      </div>
    </div>
  );
}
