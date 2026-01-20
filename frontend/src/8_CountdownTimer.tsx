import { useEffect, useState } from "react";

interface Props {
  initialSeconds: number;
}

function CountdownTimer({ initialSeconds }: Props) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        backgroundColor: "#F3F4F6",
        padding: "6px 12px",
        borderRadius: "99px",
        color: "#1F2937",
        fontSize: "14px",
        fontWeight: "600",
      }}
    >
      <span>⏱</span>
      <span>{seconds}s</span>
    </div>
  );
}

export default CountdownTimer;