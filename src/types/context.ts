import { Request, Response } from 'express';
import { UserAccount } from '../entities/UserAccount';

export type MyContext = {
  // TODO: Setup session if needed
  // req: Request & { session: Express.Session };
  currentUser?: UserAccount;
  req: Request;
  res: Response;
};