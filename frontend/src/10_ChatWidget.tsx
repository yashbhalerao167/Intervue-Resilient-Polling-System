import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface Participant {
  socketId: string;
  role: "teacher" | "student";
  studentId: string;
}

interface ChatMessage {
  senderId: string;
  senderRole: "teacher" | "student";
  text: string;
  timestamp: number;
}

interface Props {
  socket?: Socket | null;
}

const role = sessionStorage.getItem("role");

function ChatWidget({ socket }: Props) {
  const [activeTab, setActiveTab] = useState<"chat" | "participants">("chat");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  /* Participants updates */
  useEffect(() => {
    if (!socket) return;
    socket.on("participants:update", (list: Participant[]) => {
      setParticipants(list);
    });
    return () => {
      socket.off("participants:update");
    };
  }, [socket]);

  /* Chat messages */
  useEffect(() => {
    if (!socket) return;
    socket.on("chat:new_message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("chat:new_message");
    };
  }, [socket]);

  function sendMessage() {
    if (!socket || !input.trim()) return;
    socket.emit("chat:send_message", { text: input });
    setInput("");
  }

  return (
    <div
      style={{
        width: "350px", // Fixed width sidebar
        backgroundColor: "#fff",
        borderLeft: "1px solid #E5E7EB",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #E5E7EB",
          padding: "0 16px",
        }}
      >
        <button
          onClick={() => setActiveTab("chat")}
          style={{
            flex: 1,
            padding: "16px",
            border: "none",
            background: "none",
            fontSize: "14px",
            fontWeight: "600",
            color: activeTab === "chat" ? "#6F3FF5" : "#9CA3AF",
            borderBottom: activeTab === "chat" ? "2px solid #6F3FF5" : "none",
            cursor: "pointer",
          }}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab("participants")}
          style={{
            flex: 1,
            padding: "16px",
            border: "none",
            background: "none",
            fontSize: "14px",
            fontWeight: "600",
            color: activeTab === "participants" ? "#6F3FF5" : "#9CA3AF",
            borderBottom:
              activeTab === "participants" ? "2px solid #6F3FF5" : "none",
            cursor: "pointer",
          }}
        >
          Participants ({participants.length})
        </button>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {activeTab === "chat" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "#9CA3AF",
                  fontSize: "14px",
                  marginTop: "20px",
                }}
              >
                No messages yet.
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: msg.senderRole === "teacher" ? "#6F3FF5" : "#374151",
                    marginBottom: "2px",
                  }}
                >
                  {msg.senderId}
                </span>
                <div
                  style={{
                    backgroundColor: "#F3F4F6",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "#1F2937",
                    borderTopLeftRadius: "0",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {participants.map((p) => (
              <li
                key={p.socketId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px",
                  borderBottom: "1px solid #F3F4F6",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor:
                        p.role === "teacher" ? "#6F3FF5" : "#E5E7EB",
                      color: p.role === "teacher" ? "#fff" : "#6B7280",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                  >
                    {p.role === "teacher" ? "T" : "S"}
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>
                    {p.studentId}
                  </span>
                </div>

                {role === "teacher" && socket && p.role !== "teacher" && (
                  <button
                    onClick={() =>
                      socket.emit("teacher:kick_student", {
                        targetSocketId: p.socketId,
                      })
                    }
                    style={{
                      backgroundColor: "#FEE2E2",
                      color: "#DC2626",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#FCA5A5")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "#FEE2E2")
                    }
                  >
                    Kick
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Input */}
      {activeTab === "chat" && (
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #E5E7EB",
          }}
        >
          <div style={{ position: "relative" }}>
            <input
              type="text"
              value={input}
              placeholder="Type a message..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              style={{
                width: "100%",
                padding: "12px",
                paddingRight: "40px",
                borderRadius: "24px",
                border: "1px solid #E5E7EB",
                outline: "none",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#6F3FF5",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;