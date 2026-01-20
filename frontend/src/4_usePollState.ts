import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface Poll {
  _id: string;
  question: string;
  options: string[];
  startTime: string;
  endTime: string;
  correctOption?: string;
}

export function usePollState(socket: Socket | null) {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [results, setResults] = useState<Record<string, number>>({});
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // When joining late or refreshing
    socket.on("poll:state", (data) => {
      if (!data) {
        setPoll(null);
        setRemainingTime(0);
        return;
      }

      setPoll(data.poll);
      setRemainingTime(data.remainingTime);
      setEnded(false);
    });

    // When teacher starts a poll
    socket.on("poll:started", (data) => {
      setPoll(data.poll);
      setRemainingTime(data.remainingTime);
      setResults({});
      setEnded(false);
    });

    // Live results update
    socket.on("poll:results", (data) => {
      setResults(data);
    });

    // Poll ended
    socket.on("poll:ended", (data) => {
      setResults(data);
      setEnded(true);
      setRemainingTime(0);
    });

    return () => {
      socket.off("poll:state");
      socket.off("poll:started");
      socket.off("poll:results");
      socket.off("poll:ended");
    };
  }, [socket]);

  return {
    poll,
    remainingTime,
    results,
    ended
  };
}
