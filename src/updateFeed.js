export default (rss, state) => {
  const title = rss.querySelector('title').textContent;
  const description = rss.querySelector('description').textContent;
  const items = [...rss.querySelectorAll('item')];
  const feed = {
    title,
    description,
    posts: [],
  };
  items.reduce((acc, post) => {
    const postTitle = post.querySelector('title').textContent;
    const postDescription = post.querySelector('description').textContent;
    const postLink = post.querySelector('link').textContent;
    const pubDate = post.querySelector('pubDate').textContent;
    acc.posts = [...acc.posts, {
      postTitle,
      postDescription,
      postLink,
      pubDate,
      postId: 5,
    }];
    return acc;
  }, feed);
  state.data.push(feed);
};
