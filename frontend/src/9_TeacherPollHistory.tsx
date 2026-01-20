import { useState } from "react";

interface PollHistoryItem {
  pollId: string;
  question: string;
  startTime: string;
  endTime: string;
  results: Record<string, number>;
  answers: {
    studentId: string;
    selectedOption: string;
    createdAt: string;
  }[];
}

function TeacherPollHistory() {
  const [polls, setPolls] = useState<PollHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  async function loadHistory() {
    setLoading(true);
    setVisible(true);

    try {
      const res = await fetch("http://localhost:4000/api/poll/history");
      if (!res.ok) throw new Error("Failed to fetch poll history");
      const data = await res.json();
      setPolls(data);
    } catch (error) {
      console.error("Error loading poll history:", error);
      alert("Failed to load poll history. Check console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: "20px", fontFamily: "'Inter', sans-serif" }}>
      <button
        onClick={loadHistory}
        style={{
          padding: "10px 20px",
          backgroundColor: "#fff",
          border: "1px solid #D1D5DB",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          color: "#374151",
          width: "100%",
        }}
      >
        View Poll History
      </button>

      {loading && <p style={{ textAlign: "center", marginTop: "10px" }}>Loading...</p>}

      {visible && !loading && (
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {polls.length === 0 && <p>No polls conducted yet.</p>}

          {polls.map((poll) => (
            <div
              key={poll.pollId}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontWeight: "600", color: "#111827" }}>{poll.question}</span>
                <span style={{ fontSize: "12px", color: "#9CA3AF" }}>
                  {new Date(poll.startTime).toLocaleTimeString()}
                </span>
              </div>
              
              {/* Simple Results Summary */}
              <div style={{ fontSize: "14px", color: "#4B5563" }}>
                 Total Votes: {Object.values(poll.results).reduce((a, b) => a + b, 0)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeacherPollHistory;