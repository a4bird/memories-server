import { Request, Response } from 'express';

export type MyContext = {
  // TODO: Setup session if needed
  // req: Request & { session: Express.Session };
  req: Request;
  res: Response;
  loggedInUserEmail?: string;
};
