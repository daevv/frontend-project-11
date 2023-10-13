import { uniqueId } from 'lodash';

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
      postId: uniqueId(),
    };
  });
  return posts;
};
