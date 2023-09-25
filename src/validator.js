import * as yup from 'yup';

export default (currentFeed, feeds) => {
  const schema = yup.string().url().notOneOf(feeds, 'RSS уже существует');
  const result = schema.validate(currentFeed);
  return result;
};
