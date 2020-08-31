import * as yup from 'yup';

export const duplicateEmail = 'Already taken';
export const emailNotLongEnough = 'Email must be atleast 3 characters';
export const invalidEmail = 'Email must be a valid email';
export const passwordNotLongEnough = 'Password must be atleast 3 characters';

export const registerPasswordValidation = yup
  .string()
  .min(3, passwordNotLongEnough)
  .max(255);
