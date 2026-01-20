interface Props {
  results: Record<string, number>;
  ended: boolean;
  correctOption?: string;
}

function PollResults({ results, ended, correctOption }: Props) {
  const entries = Object.entries(results);

  if (entries.length === 0) {
    return null;
  }

  const totalVotes = entries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#fff",
        borderRadius: "16px",
        marginTop: "20px",
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          fontWeight: "700",
          color: "#111827",
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {ended ? "Final Results" : "Live Results"}
        <span
          style={{
            fontSize: "12px",
            fontWeight: "500",
            backgroundColor: ended ? "#EF4444" : "#10B981",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "999px",
          }}
        >
          {ended ? "ENDED" : "LIVE"}
        </span>
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {entries.map(([option, count]) => {
          const percentage =
            totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
          const isCorrect = ended && correctOption === option;

          return (
            <div key={option} style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: isCorrect ? "#059669" : "#374151",
                }}
              >
                <span>
                  {option} {isCorrect && "✅"}
                </span>
                <span>{percentage}%</span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "10px",
                  backgroundColor: "#F3F4F6",
                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${percentage}%`,
                    backgroundColor: isCorrect ? "#10B981" : "#6F3FF5",
                    borderRadius: "5px",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#9CA3AF",
                  marginTop: "2px",
                  textAlign: "right",
                }}
              >
                {count} votes
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PollResults;