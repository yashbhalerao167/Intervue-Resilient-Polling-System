import { useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  socket: Socket | null;
}

function TeacherPoll({ socket }: Props) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [correctOption, setCorrectOption] = useState<string | null>(null);
  const [duration, setDuration] = useState(60);

  function updateOption(index: number, value: string) {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  }

  function addOption() {
    setOptions([...options, ""]);
  }

  function createPoll() {
    if (!socket) return;

    const cleanedOptions = options.filter((o) => o.trim() !== "");

    if (!correctOption || !cleanedOptions.includes(correctOption)) {
      alert("Please select a correct option before asking the question.");
      return;
    }

    socket.emit("teacher:create_poll", {
      question,
      options: cleanedOptions,
      correctOption,
      durationInSeconds: duration,
    });

    // Reset UI
    setQuestion("");
    setOptions(["", ""]);
    setCorrectOption(null);
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
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "8px",
          }}
        >
          Create a Poll
        </h2>
        <p style={{ color: "#6B7280", fontSize: "14px" }}>
          Ask a question, define options, and set a timer.
        </p>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "8px",
          }}
        >
          Enter your question
        </label>
        <input
          type="text"
          placeholder="e.g. Which planet is known as the Red Planet?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: "16px",
            border: "2px solid #E5E7EB",
            borderRadius: "12px",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#6F3FF5")}
          onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
        />
      </div>

      <div style={{ flex: 1, overflowY: "auto", marginBottom: "24px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "12px",
          }}
        >
          Options (Select the correct answer)
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {options.map((opt, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 0",
              }}
            >
              <input
                type="radio"
                name="correctOption"
                checked={correctOption === opt && opt !== ""}
                onChange={() => setCorrectOption(opt)}
                style={{
                  accentColor: "#6F3FF5",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              />
              <input
                type="text"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  fontSize: "14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "10px",
                  outline: "none",
                  backgroundColor: "#F9FAFB",
                }}
              />
            </div>
          ))}
        </div>
        <button
          onClick={addOption}
          style={{
            marginTop: "16px",
            color: "#6F3FF5",
            background: "none",
            border: "none",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          + Add another option
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #F3F4F6",
          paddingTop: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <label
            style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}
          >
            Timer (seconds):
          </label>
          <input
            type="number"
            value={duration}
            min={1}
            max={60}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value <= 60) setDuration(value);
            }}
            style={{
              width: "80px",
              padding: "8px 12px",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: "600",
            }}
          />
        </div>

        <button
          onClick={createPoll}
          style={{
            backgroundColor: "#6F3FF5",
            color: "#fff",
            padding: "12px 32px",
            borderRadius: "12px",
            border: "none",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(111, 63, 245, 0.2)",
          }}
        >
          Ask Question
        </button>
      </div>
    </div>
  );
}

export default TeacherPoll;