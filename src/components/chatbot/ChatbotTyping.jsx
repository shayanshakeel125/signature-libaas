function Dots() {
  return (
    <span className="sig-chat-dots" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

/**
 * "Signature AI is typing…" indicators.
 *
 * variant="inline"         → shown inside the message list (robot avatar + dot bubble)
 * variant="float"          → thought bubble floating beside the robot (AI is replying)
 * variant="float-listening"→ calm dot bubble (user is typing their message)
 */
export default function ChatbotTyping({ variant = 'inline', avatarSrc }) {
  if (variant === 'float') {
    return (
      <div className="sig-chat-float-typing sig-chat-float-typing--ai" role="status">
        <Dots />
        <span className="sig-chat-sr">Signature AI is typing</span>
      </div>
    );
  }

  if (variant === 'float-listening') {
    return (
      <div className="sig-chat-float-typing sig-chat-float-typing--listening" role="status">
        <Dots />
        <span className="sig-chat-sr">Signature AI is reading your message</span>
      </div>
    );
  }

  return (
    <div className="sig-chat-msg sig-chat-msg--ai sig-chat-typing-row" role="status">
      {avatarSrc && (
        <img className="sig-chat-msg__avatar" src={avatarSrc} alt="" aria-hidden="true" />
      )}
      <span className="sig-chat-typing-row__bubble">
        <Dots />
        <span className="sig-chat-sr">Signature AI is typing a message</span>
      </span>
    </div>
  );
}
