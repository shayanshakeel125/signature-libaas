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
 * variant="inline" → shown inside the message list (robot avatar + dot bubble)
 * variant="float"  → small speech bubble floating above the robot's head
 */
export default function ChatbotTyping({ variant = 'inline', avatarSrc }) {
  if (variant === 'float') {
    return (
      <div className="sig-chat-float-typing" role="status">
        <Dots />
        <span className="sig-chat-sr">Signature AI is typing</span>
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
