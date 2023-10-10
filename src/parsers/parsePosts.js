import initIdGenerator from '../utils';

const postIdGenerator = initIdGenerator();

export default (postElements, feedId) => {
  const posts = postElements.map((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const postLink = item.querySelector('link').textContent;
    const pubDate = item.querySelector('pubDate').textContent;
    return {
      feedId,
      postTitle,
      postDescription,
      postLink,
      pubDate,
      postId: postIdGenerator(),
    };
  });
  return posts;
};
