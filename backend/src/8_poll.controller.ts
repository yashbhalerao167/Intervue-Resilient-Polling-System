import { Request, Response } from "express";
import { PollService } from "./6_poll.service";

export class PollController {
  static async createPoll(req: Request, res: Response) {
    try {
      const { question, options, durationInSeconds } = req.body;

      const poll = await PollService.createPoll(
        question,
        options,
        durationInSeconds
      );

      res.status(201).json(poll);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getActivePoll(_req: Request, res: Response) {
    try {
      const poll = await PollService.getActivePoll();
      res.json(poll);
    } catch {
      res.status(500).json({ message: "Failed to fetch active poll" });
    }
  }
}
