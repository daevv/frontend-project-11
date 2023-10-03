import parsePosts from './parsePosts';
import { initIdGenerator } from './utils';

const feedIdGenerator = initIdGenerator();

export default (rss, state, feedLink) => {
  const title = rss.querySelector('title').textContent;
  const description = rss.querySelector('description').textContent;
  const items = [...rss.querySelectorAll('item')];
  const id = feedIdGenerator();
  const feed = {
    title,
    description,
    id,
    url: feedLink,
  };
  const posts = parsePosts(items, id);

  state.data.lastFeed = (feed);
  state.data.feeds.push(feed);
  state.data.lastPosts = [...posts];
  state.data.posts = [...state.data.posts, ...posts];
};
