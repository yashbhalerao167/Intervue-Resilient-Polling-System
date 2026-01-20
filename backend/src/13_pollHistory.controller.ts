import { Request, Response } from "express";
import { PollHistoryService } from "./12_pollHistory.service";

export class PollHistoryController {
  static async getHistory(_req: Request, res: Response) {
    try {
      const polls = await PollHistoryService.getPollHistory();
      res.json(polls);
    } catch {
      res.status(500).json({ message: "Failed to fetch poll history" });
    }
  }
}
