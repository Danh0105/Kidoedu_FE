import { useEffect, useState } from "react";

/* ================== API ================== */
const API_BASE = "http://localhost:3000/chatbot";

/* ================== COMPONENT ================== */
export default function ChatBox() {
  const [currentNode, setCurrentNode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------- Load start node ---------- */
  useEffect(() => {
    startChat();
  }, []);

  const startChat = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/nodes`);
    const nodes = await res.json();

    const start = nodes.find((n) => n.isStart);
    if (!start) {
      alert("Không có node bắt đầu (isStart)");
      return;
    }

    setMessages([
      {
        role: "assistant",
        content: start.content,
        options: start.options,
      },
    ]);

    setCurrentNode(start);
    setLoading(false);
  };

  /* ---------- Handle option click ---------- */
  const handleOptionClick = async (nextKey, label) => {
    if (!nextKey) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: label },
    ]);

    setLoading(true);

    const res = await fetch(`${API_BASE}/nodes/${nextKey}`);
    const nextNode = await res.json();

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: nextNode.content,
        options: nextNode.options,
      },
    ]);

    setCurrentNode(nextNode);
    setLoading(false);
  };

  if (!currentNode) return <div>Loading chatbot...</div>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        🤖 Chatbot hỗ trợ
        <button style={styles.restartBtn} onClick={startChat}>
          ⟳
        </button>
      </div>

      <div style={styles.chatArea}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background:
                msg.role === "user" ? "#DCF8C6" : "#F1F0F0",
            }}
          >
            <div style={{ whiteSpace: "pre-line" }}>{msg.content}</div>

            {msg.role === "assistant" && msg.options?.length > 0 && (
              <div style={styles.options}>
                {msg.options.map((opt) => (
                  <button
                    key={opt.id}
                    style={styles.optionBtn}
                    onClick={() =>
                      handleOptionClick(opt.nextNodeKey, opt.label)
                    }
                    disabled={!opt.nextNodeKey}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && <div style={styles.loading}>Đang trả lời...</div>}
      </div>
    </div>
  );
}

/* ================== STYLES ================== */
const styles = {
  wrapper: {
    maxWidth: 400,
    height: 500,
    border: "1px solid #ccc",
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: "Arial",
  },
  header: {
    background: "#0d6efd",
    color: "#fff",
    padding: "8px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  restartBtn: {
    background: "transparent",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },
  chatArea: {
    flex: 1,
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    overflowY: "auto",
    background: "#fafafa",
  },
  message: {
    maxWidth: "80%",
    padding: "8px 10px",
    borderRadius: 8,
    fontSize: 14,
  },
  options: {
    marginTop: 6,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  optionBtn: {
    background: "#fff",
    border: "1px solid #0d6efd",
    color: "#0d6efd",
    borderRadius: 6,
    padding: "6px 8px",
    cursor: "pointer",
    fontSize: 13,
    textAlign: "left",
  },
  loading: {
    fontSize: 12,
    color: "#888",
    alignSelf: "center",
  },
};
