import parsePosts from '../parsers/parsePosts';
import rss from './rss';

const checkForUpdates = (state) => {
  const { feeds } = state.data;
  console.log('UPDATES CHECKING!!!');
  const requests = feeds.map((feed) => {
    const { id, url } = feed;
    const previousPostsTitles = state.data.posts
      .filter(({ feedId }) => feedId === id)
      .map(({ postTitle }) => postTitle);
    const request = rss(url).then((response) => {
      const postItems = [...response.querySelectorAll('item')];
      const parsedPosts = parsePosts(postItems, id);
      const newPosts = parsedPosts
        .filter(({ postTitle }) => !previousPostsTitles.includes(postTitle));
      return newPosts;
    })
      .then((newPosts) => {
        if (newPosts.length > 0) {
          console.log('there are new posts');
          state.data.lastPosts = newPosts;
          state.data.posts = [...state.data.posts, ...newPosts];
          return;
        }
        console.log('there are no new posts');
      })
      .catch(() => {});
    return request;
  });
  Promise.all(requests).finally(() => setTimeout(() => checkForUpdates(state), 5000));
};

export default checkForUpdates;
