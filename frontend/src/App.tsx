import { useEffect, useState } from "react";
import RoleSelect from "./1_RoleSelect";
import StudentName from "./2_StudentName";
import { useSocket } from "./3_useSocket";
import { usePollState } from "./4_usePollState";
import TeacherPoll from "./5_TeacherPoll";
import StudentPoll from "./6_StudentPoll";
import PollResults from "./7_PollResults";
import CountdownTimer from "./8_CountdownTimer";
import TeacherPollHistory from "./9_TeacherPollHistory";
import ChatWidget from "./10_ChatWidget";

type Role = "teacher" | "student" | null;

function App() {
  const [role, setRole] = useState<Role>(null);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [kicked, setKicked] = useState(false);

  // Restore from sessionStorage
  useEffect(() => {
    const savedRole = sessionStorage.getItem("role") as Role;
    const savedName = sessionStorage.getItem("studentName");

    if (savedRole) setRole(savedRole);
    if (savedName) setStudentName(savedName);
    const wasKicked = sessionStorage.getItem("kicked");
    if (wasKicked) setKicked(true);
  }, []);

  // Persist to sessionStorage
  useEffect(() => {
    if (role) sessionStorage.setItem("role", role);
  }, [role]);

  useEffect(() => {
    if (studentName) sessionStorage.setItem("studentName", studentName);
  }, [studentName]);

  // Socket + Poll State
  const socket = useSocket(role as "teacher" | "student", studentName!);
  const { poll, remainingTime, results, ended } = usePollState(socket);

  useEffect(() => {
    if (!socket) return;

    socket.on("student:kicked", () => {
      setKicked(true);
      sessionStorage.setItem("kicked", "true");
      socket.disconnect();
    });

    return () => {
      socket.off("student:kicked");
    };
  }, [socket]);

  // Step 1: Choose role (Full Page)
  if (!role) {
    return <RoleSelect onSelectRole={setRole} />;
  }

  // Step 2: Student enters name (Full Page)
  if (role === "student" && !studentName) {
    return <StudentName onSubmitName={setStudentName} />;
  }

  // Kicked student view (Full Page)
  if (kicked) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F3F4F6",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "20px",
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚫</div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#EF4444",
              marginBottom: "8px",
            }}
          >
            Access Revoked
          </h2>
          <p style={{ color: "#6B7280" }}>
            The teacher has removed you from the session.
          </p>
        </div>
      </div>
    );
  }

  // SHARED STYLES FOR DASHBOARD
  const containerStyle = {
    display: "flex",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#F3F4F6",
    overflow: "hidden", // Prevent full page scroll, let columns scroll
  };

  const mainContentStyle = {
    flex: 1,
    padding: "32px",
    overflowY: "auto" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
    maxWidth: "1200px", // Prevent it from getting too wide on huge screens
    margin: "0 auto",
    width: "100%",
  };

  // Teacher View
  if (role === "teacher") {
    return (
      <div style={containerStyle}>
        {/* LEFT COLUMN: Main Actions */}
        <div style={mainContentStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "800",
                color: "#111827",
              }}
            >
              Teacher Dashboard
            </h1>
            {poll && !ended && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  backgroundColor: "#fff",
                  padding: "8px 16px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#059669",
                      borderRadius: "50%",
                      display: "inline-block",
                    }}
                  ></span>
                  Poll Active
                </span>
                <CountdownTimer initialSeconds={remainingTime} />
              </div>
            )}
          </div>

          <TeacherPoll socket={socket} />

          {/* If there is an active poll or results to show */}
          {(poll || Object.keys(results).length > 0) && (
            <PollResults
              results={results}
              ended={ended}
              correctOption={poll?.correctOption}
            />
          )}

          <div
            style={{
              borderTop: "2px solid #E5E7EB",
              paddingTop: "12px",
              marginTop: "12px",
            }}
          >
            <TeacherPollHistory />
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <ChatWidget socket={socket} />
      </div>
    );
  }

  // Student View
  return (
    <div style={containerStyle}>
      {/* LEFT COLUMN: Voting Area */}
      <div style={mainContentStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1
            style={{ fontSize: "28px", fontWeight: "800", color: "#111827" }}
          >
            Student Dashboard
          </h1>
          {poll && !ended && <CountdownTimer initialSeconds={remainingTime} />}
        </div>

        <StudentPoll
          socket={socket}
          poll={poll}
          remainingTime={remainingTime}
          studentId={studentName!}
        />

        <PollResults
          results={results}
          ended={ended}
          correctOption={poll?.correctOption}
        />
      </div>

      {/* RIGHT COLUMN: Sidebar */}
      <ChatWidget socket={socket} />
    </div>
  );
}

export default App;