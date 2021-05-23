import { invalidLogin } from './errorMessages/login';

import { MyContext } from '../../types/context';

import userProfile from '../userProfile/userProfile';
import register from './registerMutation';
import mapUserAccount from './mapUserAccount';
import loginMutation from './loginMutation';
import me from './meQuery';

export interface UserAccountResolverOutput {
  id: string;
  email: string;
  photoUrl: string;
  /**
   * Data to pass to child resolvers. Fields here will not show in the response
   */
  resolverData: {
    profileId?: number;
  };
}

const resolvers = {
  Mutation: {
    login: loginMutation,
    register: register,
    logout: async (_: any, __: any, { res, loggedInUserEmail }: MyContext) => {
      if (loggedInUserEmail) {
        res.clearCookie('authToken');
      }
    },
  },
  Query: {
    me: me,
  },
  UserAccount: {
    profile: userProfile,
  },
};

export default resolvers;
