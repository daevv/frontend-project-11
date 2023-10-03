import parsePosts from './parsePosts';
import rss from './rss';

const checkForUpdates = (state) => setTimeout(() => {
  const { feeds } = state.data;
  console.log('UPDATES CHECKING!!!');
  feeds.forEach((feed) => {
    const { id, url } = feed;
    const previousPostsTitles = state.data.posts
      .filter(({ feedId }) => feedId === id)
      .map(({ postTitle }) => postTitle);
    rss(url)
      .then((response) => [...response.querySelectorAll('item')])
      .then((postItems) => parsePosts(postItems, id))
      .then((currentPosts) => currentPosts
        .filter(({ postTitle }) => !previousPostsTitles.includes(postTitle)))
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
  });
  checkForUpdates(state);
}, 5000);

export default checkForUpdates;
