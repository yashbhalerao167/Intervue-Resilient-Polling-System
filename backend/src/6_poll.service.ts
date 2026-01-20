import { Poll } from "./4_poll.model";

export class PollService {
  static async createPoll(
  question: string,
  options: string[],
  durationInSeconds: number,
  correctOption?: string
) {
    const now = new Date();

    const activePoll = await Poll.findOne({ isActive: true });
    if (activePoll) {
      throw new Error("An active poll already exists");
    }
    if (correctOption && !options.includes(correctOption)) {
  throw new Error("Correct option must be one of the provided options");
}


    const endTime = new Date(now.getTime() + durationInSeconds * 1000);

    const poll = await Poll.create({
  question,
  options,
  correctOption, // ✅ NEW
  isActive: true,
  startTime: now,
  endTime
});
    return poll;
  }

  static async getActivePoll() {
    return Poll.findOne({ isActive: true });
  }

  static async closePoll(pollId: string) {
    await Poll.findByIdAndUpdate(pollId, {
      isActive: false
    });
  }
}
