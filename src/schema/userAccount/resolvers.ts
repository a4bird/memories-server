import * as bcrypt from 'bcryptjs';
import * as yup from 'yup';
import jwt from 'jsonwebtoken';

import { secret, expiration } from '../../env';
import { UserAccount } from '../../entities/UserAccount';
import { MutationLoginArgs, MutationRegisterArgs } from '../../types/graphql';
import {
  invalidLogin,
  confirmEmailError,
  forgotPasswordLockedError,
} from './errorMessages/login';
import {
  emailNotLongEnough,
  invalidEmail,
  duplicateEmail,
  registerPasswordValidation,
} from './errorMessages/register';
import { formatYupError } from '../../utils/formatYupError';

const errorResponse = [
  {
    path: 'email',
    message: invalidLogin,
  },
];

const schema = yup.object().shape({
  email: yup.string().min(3, emailNotLongEnough).max(255).email(invalidEmail),
  password: registerPasswordValidation,
});

const resolvers = {
  Mutation: {
    login: async (
      _: any,
      { email, password }: MutationLoginArgs,
      { res }: any
    ) => {
      const user = await UserAccount.findOne({
        where: { email },
      });

      if (!user) {
        return errorResponse;
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
        return errorResponse;
      }

      const authToken = jwt.sign(email, secret);
      res.cookie('authToken', authToken, { maxAge: expiration });

      // TODO: Alternate to redis
      // if (req.sessionID) {
      //   await redis.lpush(`${userSessionIdPrefix}${user.id}`, req.sessionID);
      // }

      return user;
    },
    register: async (_: any, args: MutationRegisterArgs) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }

      const { email, password } = args;
      const userAlreadyExists = await UserAccount.findOne({
        where: { email },
        select: ['id'],
      });

      if (userAlreadyExists) {
        return [
          {
            path: 'email',
            message: duplicateEmail,
          },
        ];
      }

      const user = UserAccount.create({
        email,
        password: password,
      });

      await user.save();

      // if (process.env.NODE_ENV !== 'test') {
      //   const confirmationLink = await createConfirmEmailLink(
      //     url,
      //     user.id,
      //     redis
      //   );
      //   await sendEmail(email, confirmationLink);
      // }
      return user;
    },
  },
};

export default resolvers;
