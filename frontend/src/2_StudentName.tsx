import { useState } from "react";

interface Props {
  onSubmitName: (name: string) => void;
}

function StudentName({ onSubmitName }: Props) {
  const [name, setName] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F3F4F6",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "48px",
          borderRadius: "24px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#6F3FF5",
            marginBottom: "8px",
            textTransform: "uppercase",
          }}
        >
          Intervue Poll
        </p>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#111827",
            marginBottom: "12px",
          }}
        >
          Let's Get Started
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#6B7280",
            marginBottom: "32px",
          }}
        >
          If you're a student, you'll be able to submit your answers and participate
          in live polls.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Enter your Name
            </label>
            <input
              type="text"
              placeholder="Ex: Rahul Bajaj"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "2px solid #E5E7EB",
                fontSize: "16px",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#6F3FF5")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
            />
          </div>

          <button
            disabled={!name}
            onClick={() => onSubmitName(name)}
            style={{
              padding: "14px",
              backgroundColor: name ? "#6F3FF5" : "#E5E7EB",
              color: name ? "#fff" : "#9CA3AF",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: name ? "pointer" : "not-allowed",
              transition: "background-color 0.2s",
              marginTop: "10px",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentName;