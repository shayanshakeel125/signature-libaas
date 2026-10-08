/**
 * A single chat bubble.
 * – user messages   → right aligned, blue gradient bubble
 * – AI messages     → left aligned, light card bubble + robot avatar
 */
export default function ChatbotMessage({ message, avatarSrc }) {
  const isUser = message.role === 'user';
  const time = message.time || '';

  return (
    <article
      className={`sig-chat-msg ${isUser ? 'sig-chat-msg--user' : 'sig-chat-msg--ai'}`}
      aria-label={isUser ? 'Your message' : 'Signature AI message'}
    >
      {!isUser && avatarSrc && (
        <img className="sig-chat-msg__avatar" src={avatarSrc} alt="" aria-hidden="true" />
      )}

      <div className="sig-chat-msg__body">
        <div className="sig-chat-msg__bubble">
          <p>{message.text}</p>
        </div>

        {time && (
          <span className="sig-chat-msg__time">
            <span className="sig-chat-sr">Sent at </span>
            {time}
          </span>
        )}
      </div>
    </article>
  );
}
