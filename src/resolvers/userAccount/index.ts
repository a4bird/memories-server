import * as bcrypt from 'bcryptjs';
import * as yup from 'yup';
import jwt from 'jsonwebtoken';

import env from '../../env';
import { UserAccount } from '../../entities/userAccount';
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
  passwordNotLongEnough,
} from './errorMessages/register';
import { formatYupError } from '../../utils/formatYupError';
import { MyContext } from '../../types/context';
import userProfile from './userProfile';

export interface UserAccountResolverOutput {
  id: string;
  email: string;
  /**
   * Data to pass to child resolvers. Fields here will not show in the response
   */
  resolverData: {
    profileId?: number;
  };
}

interface MeOutput {
  userAccount?: UserAccountResolverOutput;
}

const errorResponse = [
  {
    path: 'email',
    message: invalidLogin,
  },
];

const schema = yup.object().shape({
  email: yup.string().min(3, emailNotLongEnough).max(255).email(invalidEmail),
  password: yup.string().min(3, passwordNotLongEnough).max(255),
});

const mapUserAccount = (
  userAccount: UserAccount
): UserAccountResolverOutput => {
  return {
    id: userAccount.id,
    email: userAccount.email,
    resolverData: {
      profileId: userAccount.profileId,
    },
  };
};

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
      res.cookie('authToken', authToken, { maxAge: env.expiration });

      // TODO: Alternate to redis
      // if (req.sessionID) {
      //   await redis.lpush(`${userSessionIdPrefix}${user.id}`, req.sessionID);
      // }

      return {
        userAccount: user,
      };
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
        return {
          errors: [
            {
              path: 'email',
              message: duplicateEmail,
            },
          ],
        };
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
      return {
        userAccount: user,
      };
    },
    logout: async (_: any, __: any, { res, loggedInUserEmail }: MyContext) => {
      if (loggedInUserEmail) {
        res.clearCookie('authToken');
      }
    },
  },
  Query: {
    me: async (
      _: any,
      __: any,
      { loggedInUserEmail }: MyContext
    ): Promise<MeOutput> => {
      let currentUser: UserAccount | undefined;
      if (loggedInUserEmail) {
        currentUser = await UserAccount.findOne({
          where: { email: loggedInUserEmail },
        });
      }

      if (!currentUser) {
        return { userAccount: undefined };
      }

      return {
        userAccount: mapUserAccount(currentUser),
      };
    },
  },
  UserAccount: {
    profile: userProfile,
  },
};

export default resolvers;
