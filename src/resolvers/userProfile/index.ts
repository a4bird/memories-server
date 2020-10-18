import * as yup from 'yup';
import { MutationSaveProfileArgs, UserProfileOutput } from 'src/types/graphql';
import { firstNameLength, lastNameLength } from './errorMessages/saveProfile';
import { formatYupError } from 'src/utils/formatYupError';
import { MyContext } from 'src/types/context';
import { UserProfile } from 'src/entities/userProfile';
import { UserAccount } from 'src/entities/userAccount';

const schema = yup.object().shape({
  firstName: yup.string().min(1).max(50, firstNameLength),
  lastName: yup.string().min(1).max(50, lastNameLength),
});

const resolvers = {
  Mutation: {
    saveProfile: async (
      _: any,
      { firstName, lastName, gender }: MutationSaveProfileArgs,
      { loggedInUserEmail }: MyContext
    ): Promise<UserProfileOutput> => {
      try {
        await schema.validate(
          { firstName, lastName, gender },
          { abortEarly: false }
        );
      } catch (err) {
        return {
          errors: formatYupError(err),
        };
      }

      if (!loggedInUserEmail) {
        throw new Error('User not signed in');
      }

      const currentUser = await UserAccount.findOne({
        where: { email: loggedInUserEmail },
      });

      if (!currentUser) {
        throw new Error(
          'Something went wrong, user could not be retrieved for logged in user'
        );
      }

      const userProfile = new UserProfile();
      userProfile.firstName = firstName;
      userProfile.lastName = lastName;
      userProfile.gender = gender;

      currentUser.profile = userProfile;

      await currentUser.save();
      return {
        userProfile: userProfile,
      };
    },
  },
  Query: {},
};

export default resolvers;
