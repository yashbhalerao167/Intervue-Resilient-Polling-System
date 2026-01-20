import { Socket } from "socket.io-client";

interface Poll {
  _id: string;
  question: string;
  options: string[];
}

interface Props {
  socket: Socket | null;
  poll: Poll | null;
  remainingTime: number;
  studentId: string;
}

function StudentPoll({ socket, poll, remainingTime, studentId }: Props) {
  if (!poll) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "40px",
          textAlign: "center",
          color: "#9CA3AF",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "48px",
            marginBottom: "24px",
            opacity: 0.5,
          }}
        >
          ⏳
        </div>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#374151" }}>
          Waiting for the teacher...
        </h2>
        <p>A new poll question will appear here shortly.</p>
      </div>
    );
  }

  const pollEnded = remainingTime <= 0;

  function submitVote(option: string) {
    if (!socket || pollEnded) return;

    socket.emit("student:vote", {
      pollId: poll!._id,
      studentId,
      selectedOption: option,
    });
  }

  return (
    <div
      style={{
        padding: "32px",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#fff",
        borderRadius: "24px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#111827",
            lineHeight: "1.3",
          }}
        >
          {poll.question}
        </h2>
        {pollEnded && (
          <p
            style={{
              color: "#EF4444",
              fontWeight: "500",
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>🛑</span> Voting has ended.
          </p>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "16px",
        }}
      >
        {poll.options.map((opt, index) => (
          <button
            key={index}
            disabled={pollEnded}
            onClick={() => submitVote(opt)}
            style={{
              padding: "20px",
              backgroundColor: "#fff",
              border: "2px solid #E5E7EB",
              borderRadius: "16px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
              textAlign: "left",
              cursor: pollEnded ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              opacity: pollEnded ? 0.6 : 1,
              position: "relative",
            }}
            onMouseOver={(e) => {
              if (!pollEnded) {
                e.currentTarget.style.borderColor = "#6F3FF5";
                e.currentTarget.style.backgroundColor = "#F5F3FF";
                e.currentTarget.style.color = "#6F3FF5";
              }
            }}
            onMouseOut={(e) => {
              if (!pollEnded) {
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.color = "#374151";
              }
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "#E5E7EB",
                color: "#6B7280",
                textAlign: "center",
                lineHeight: "24px",
                marginRight: "12px",
                fontSize: "12px",
              }}
            >
              {String.fromCharCode(65 + index)}
            </span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StudentPoll;