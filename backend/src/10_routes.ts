import { Router } from "express";
import { PollController } from "./8_poll.controller";
import { VoteController } from "./9_vote.controller";
import { PollHistoryController } from "./13_pollHistory.controller";

const router = Router();

/**
 * Poll routes (Teacher)
 */
router.post("/poll", PollController.createPoll);
router.get("/poll/active", PollController.getActivePoll);
router.get("/poll/history", PollHistoryController.getHistory);

/**
 * Vote routes (Student)
 */
router.post("/vote", VoteController.submitVote);
router.get("/results/:pollId", VoteController.getResults);

export default router;
