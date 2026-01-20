type Role = "teacher" | "student";

interface Props {
  onSelectRole: (role: Role) => void;
}

function RoleSelect({ onSelectRole }: Props) {
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
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#6F3FF5",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "12px",
          }}
        >
          Intervue Poll
        </p>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "800",
            color: "#111827",
            marginBottom: "12px",
            lineHeight: "1.2",
          }}
        >
          Welcome to the Live Polling System
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#6B7280",
            marginBottom: "40px",
          }}
        >
          Please select the role that best describes you to begin using the live polling system.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          {/* Student Button */}
          <button
            onClick={() => onSelectRole("student")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "30px 20px",
              backgroundColor: "#fff",
              border: "2px solid #E5E7EB",
              borderRadius: "16px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              outline: "none",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#6F3FF5";
              e.currentTarget.style.backgroundColor = "#F5F3FF";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.backgroundColor = "#fff";
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#F3F4F6",
                borderRadius: "50%",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              🎓
            </div>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              I’m a Student
            </span>
            <span style={{ fontSize: "14px", color: "#6B7280", marginTop: "8px" }}>
              Vote & view results
            </span>
          </button>

          {/* Teacher Button */}
          <button
            onClick={() => onSelectRole("teacher")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "30px 20px",
              backgroundColor: "#fff",
              border: "2px solid #E5E7EB",
              borderRadius: "16px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              outline: "none",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#6F3FF5";
              e.currentTarget.style.backgroundColor = "#F5F3FF";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.backgroundColor = "#fff";
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#F3F4F6",
                borderRadius: "50%",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              👨‍🏫
            </div>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              I’m a Teacher
            </span>
            <span style={{ fontSize: "14px", color: "#6B7280", marginTop: "8px" }}>
              Create & manage polls
            </span>
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "#9CA3AF", lineHeight: "1.5" }}>
          Submit answers and view live poll results in real-time.
          <br />
          Designed for seamless interaction.
        </p>
      </div>
    </div>
  );
}

export default RoleSelect;