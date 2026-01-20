import { Server } from "socket.io";
import http from "http";
import { PollService } from "./6_poll.service";
import { VoteService } from "./7_vote.service";

/* =======================
   Types
======================= */

interface Participant {
  socketId: string;
  role: "teacher" | "student";
  studentId: string; // stable identity
}

interface ChatMessage {
  senderId: string;
  senderRole: "teacher" | "student";
  text: string;
  timestamp: number;
}

/* =======================
   In-memory state
======================= */

const participants: Participant[] = [];
const kickedStudentIds = new Set<string>();
let pollTimeout: NodeJS.Timeout | null = null;

/* =======================
   Socket setup
======================= */

export function setupSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173"
    }
  });

  io.on("connection", async (socket) => {
    console.log("Socket connected:", socket.id);

    /* =======================
       POLL STATE RECOVERY
    ======================= */

    const activePoll = await PollService.getActivePoll();

    if (activePoll) {
      const now = Date.now();
      const end = new Date(activePoll.endTime).getTime();
      const remainingTime = Math.max(
        0,
        Math.floor((end - now) / 1000)
      );

      socket.emit("poll:state", {
        poll: activePoll,
        remainingTime
      });
    } else {
      socket.emit("poll:state", null);
    }

    /* =======================
       PARTICIPANT JOIN
    ======================= */

    socket.on("participant:join", ({ role, name }) => {
      const studentId = role === "teacher" ? "Teacher" : name;

      if (!studentId) return;

      if (kickedStudentIds.has(studentId)) {
        socket.emit("student:kicked");
        socket.disconnect(true);
        return;
      }

      participants.push({
        socketId: socket.id,
        role,
        studentId
      });

      io.emit("participants:update", participants);
    });

    /* =======================
       TEACHER CREATES POLL
    ======================= */

    socket.on("teacher:create_poll", async (data) => {
      try {
        const { question, options, durationInSeconds, correctOption } = data;
        const poll = await PollService.createPoll(
          question,
          options,
          durationInSeconds,
          correctOption
        );

        if (pollTimeout) {
          clearTimeout(pollTimeout);
        }

        pollTimeout = setTimeout(async () => {
          await PollService.closePoll(poll._id.toString());
          const results = await VoteService.getResults(
            poll._id.toString()
          );
          io.emit("poll:ended", results);
        }, durationInSeconds * 1000);

        io.emit("poll:started", {
          poll,
          remainingTime: durationInSeconds
        });
      } catch (error: any) {
        socket.emit("error", { message: error.message });
      }
    });

    /* =======================
       STUDENT VOTES
    ======================= */

    socket.on("student:vote", async (data) => {
      try {
        const { pollId, studentId, selectedOption } = data;

        await VoteService.submitVote(
          pollId,
          studentId,
          selectedOption
        );

        const results = await VoteService.getResults(pollId);
        io.emit("poll:results", results);
      } catch (error: any) {
        socket.emit("error", { message: error.message });
      }
    });

    /* =======================
       CHAT MESSAGES
    ======================= */

    socket.on("chat:send_message", ({ text }) => {
      const sender = participants.find(
        (p) => p.socketId === socket.id
      );

      if (!sender) return;

      const message: ChatMessage = {
        senderId: sender.studentId,
        senderRole: sender.role,
        text,
        timestamp: Date.now()
      };

      io.emit("chat:new_message", message);
    });

    /* =======================
       TEACHER KICKS STUDENT
    ======================= */

    socket.on("teacher:kick_student", ({ targetSocketId }) => {
      const requester = participants.find(
        (p) => p.socketId === socket.id
      );

      if (!requester || requester.role !== "teacher") return;

      const targetIndex = participants.findIndex(
        (p) => p.socketId === targetSocketId
      );

      if (targetIndex === -1) return;

      const target = participants[targetIndex];

      kickedStudentIds.add(target.studentId);

      io.to(target.socketId).emit("student:kicked");

      const targetSocket = io.sockets.sockets.get(
        target.socketId
      );
      if (targetSocket) {
        targetSocket.disconnect(true);
      }

      participants.splice(targetIndex, 1);
      io.emit("participants:update", participants);
    });

    /* =======================
       DISCONNECT
    ======================= */

    socket.on("disconnect", () => {
      const index = participants.findIndex(
        (p) => p.socketId === socket.id
      );

      if (index !== -1) {
        participants.splice(index, 1);
        io.emit("participants:update", participants);
      }

      console.log("Socket disconnected:", socket.id);
    });
  });
}
