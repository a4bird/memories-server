import { Album } from 'src/entities/album';
import { MyContext } from 'src/types/context';
import { MutationAddAlbumArgs, AddAlbumOutput } from 'src/types/graphql';
import { formatYupError } from 'src/utils/formatYupError';
import * as yup from 'yup';
import { titleLength, descriptionLength } from './errorMessages/addAlbum';

const schema = yup.object().shape({
  title: yup.string().min(1).max(90, titleLength),
  description: yup.string().min(1).max(240, descriptionLength),
});

export default async (
  _: any,
  { title, description }: MutationAddAlbumArgs,
  { loggedInUserEmail }: MyContext
): Promise<AddAlbumOutput> => {
  try {
    await schema.validate({ title, description }, { abortEarly: false });
  } catch (err) {
    return {
      errors: formatYupError(err),
    };
  }

  if (!loggedInUserEmail) {
    throw new Error('User not signed in');
  }

  const album = new Album();

  album.title = title;
  album.description = description;
  album.createdAt = new Date();

  await album.save();
  return {
    album: album,
  };
};
