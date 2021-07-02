import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import env from '../../env';
import { UserAccount } from '../../entities/userAccount';
import { MutationLoginArgs } from '../../types/graphql';
import mapUserAccount from './mapUserAccount';
import { invalidLogin } from './errorMessages/login';

const errorResponse = [
  {
    path: 'email',
    message: invalidLogin,
  },
];

export default async (
  _: any,
  { email, password }: MutationLoginArgs,
  { res }: any
) => {
  const user = await UserAccount.findOne({
    where: { email },
  });

  if (!user) {
    return {
      errors: errorResponse,
    };
  }

  // TODO: Later
  // if (!user.confirmed) {
  //   return [
  //     {
  //       path: 'email',
  //       message: confirmEmailError,
  //     },
  //   ];
  // }

  // if (user.forgotPasswordLocked) {
  //   return [
  //     {
  //       path: 'email',
  //       message: forgotPasswordLockedError,
  //     },
  //   ];
  // }

  const passwordsMatch = bcrypt.compareSync(password, user.password);

  if (!passwordsMatch) {
    return {
      errors: errorResponse,
    };
  }

  const authToken = jwt.sign(email, env.secret);
  res.cookie('authToken', authToken, {
    maxAge: env.expiration,
    sameSite: 'None',
    secure: true,
  });

  // TODO: Alternate to redis / redis as a task in fargate
  // if (req.sessionID) {
  //   await redis.lpush(`${userSessionIdPrefix}${user.id}`, req.sessionID);
  // }

  const userAccount = await mapUserAccount(user);
  return {
    userAccount,
  };
};
