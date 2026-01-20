import { Request, Response } from "express";
import { VoteService } from "./7_vote.service";

export class VoteController {
  static async submitVote(req: Request, res: Response) {
    try {
      const { pollId, studentId, selectedOption } = req.body;

      const vote = await VoteService.submitVote(
        pollId,
        studentId,
        selectedOption
      );

      res.status(201).json(vote);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getResults(req: Request, res: Response) {
    try {
      const { pollId } = req.params;

      const results = await VoteService.getResults(pollId);

      res.json(results);
    } catch {
      res.status(500).json({ message: "Failed to fetch poll results" });
    }
  }
}
