import saveProfile from './saveProfileMutation';
import getUserProfile from './getUserProfileQuery';

const resolvers = {
  Mutation: {
    saveProfile,
  },
  Query: {
    getUserProfile,
  },
};

export default resolvers;
