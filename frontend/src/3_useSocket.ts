import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

export function useSocket(
  role: "teacher" | "student",
  userName: string
): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io("http://localhost:4000");

    setSocket(s);

    s.emit("participant:join", {
      role,
      name: userName
    });

    return () => {
      s.disconnect();
    };
  }, [role, userName]);

  return socket;
}
