import * as yup from 'yup';

import { UserAccount } from 'src/entities/userAccount';

import { MutationRegisterArgs } from 'src/types/graphql';
import { formatYupError } from 'src/utils/formatYupError';

import {
  emailNotLongEnough,
  invalidEmail,
  duplicateEmail,
  passwordNotLongEnough,
} from './errorMessages/register';

import mapUserAccount from './mapUserAccount';

const schema = yup.object().shape({
  email: yup.string().min(3, emailNotLongEnough).max(255).email(invalidEmail),
  password: yup.string().min(3, passwordNotLongEnough).max(255),
});

export default async (_: any, args: MutationRegisterArgs) => {
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

  const userAccount = await mapUserAccount(user);

  return {
    userAccount,
  };
};
