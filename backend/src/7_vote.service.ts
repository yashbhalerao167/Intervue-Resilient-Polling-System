import { Poll } from "./4_poll.model";
import { Vote } from "./5_vote.model";

export class VoteService {
  static async submitVote(
    pollId: string,
    studentId: string,
    selectedOption: string
  ) {
    const poll = await Poll.findById(pollId);

    if (!poll || !poll.isActive) {
      throw new Error("Poll is not active");
    }

    const now = new Date();
    if (now > poll.endTime) {
      throw new Error("Poll has ended");
    }

    const vote = await Vote.create({
      pollId,
      studentId,
      selectedOption
    });

    return vote;
  }

  static async getResults(pollId: string) {
    const votes = await Vote.find({ pollId });

    const resultMap: Record<string, number> = {};

    votes.forEach((vote) => {
      resultMap[vote.selectedOption] =
        (resultMap[vote.selectedOption] || 0) + 1;
    });

    return resultMap;
  }
}
