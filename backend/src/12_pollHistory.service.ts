import { Poll } from "./4_poll.model";
import { Vote } from "./5_vote.model";

export class PollHistoryService {
  static async getPollHistory() {
    const polls = await Poll.find({ isActive: false }).sort({ endTime: -1 });

    const history = [];

    for (const poll of polls) {
      const votes = await Vote.find({ pollId: poll._id });

      // Aggregate results
      const results: Record<string, number> = {};
      poll.options.forEach((opt) => {
        results[opt] = 0;
      });

      votes.forEach((vote) => {
        results[vote.selectedOption] =
          (results[vote.selectedOption] || 0) + 1;
      });

      // Student answer history
      const answers = votes.map((vote) => ({
        studentId: vote.studentId,
        selectedOption: vote.selectedOption,
        createdAt: vote.createdAt
      }));

      history.push({
        pollId: poll._id,
        question: poll.question,
        options: poll.options,
        startTime: poll.startTime,
        endTime: poll.endTime,
        results,
        answers
      });
    }

    return history;
  }
}
