import { useState } from "react";

export default function TelegramChatButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="https://t.me/asivanta_bot"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Asia on Telegram"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "0 20px 0 14px",
        height: "48px",
        borderRadius: "999px",
        background: "#3B82F6",
        boxShadow: hovered
          ? "0 8px 28px rgba(59,130,246,0.45), 0 2px 8px rgba(0,0,0,0.12)"
          : "0 4px 16px rgba(59,130,246,0.3), 0 1px 4px rgba(0,0,0,0.08)",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease",
        cursor: "pointer",
        textDecoration: "none",
        outline: "none",
        border: "none",
        userSelect: "none",
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <path
          d="M4 8.5C4 7.12 5.12 6 6.5 6h15C22.88 6 24 7.12 24 8.5v9C24 18.88 22.88 20 21.5 20H16l-4 4v-4H6.5C5.12 20 4 18.88 4 17.5v-9z"
          fill="white"
        />
        <circle cx="10" cy="13" r="1.25" fill="#3B82F6" />
        <circle cx="14" cy="13" r="1.25" fill="#3B82F6" />
        <circle cx="18" cy="13" r="1.25" fill="#3B82F6" />
      </svg>
      <span
        style={{
          color: "#fff",
          fontSize: "15px",
          fontWeight: 600,
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
        }}
      >
        Chat with Asia
      </span>
    </a>
  );
}
