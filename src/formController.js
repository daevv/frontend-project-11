import rss from './rss';
import parseFeed from './parseFeed';

export default (evt, state, validator) => {
  evt.preventDefault();
  state.form.status = 'checking';
  const data = new FormData(evt.target);
  const feed = data.get('rss-link');
  validator(feed, state.data.feeds)
    .then((validFeed) => {
      state.form.status = 'input';
      state.form.error = '';
      state.form.feedbackStatus = 'success';
      return rss(validFeed, state);
    })
    .then((parsedRss) => {
      if (parsedRss) return parseFeed(parsedRss, state, feed);
      throw new Error('network error');
    })
    .catch((e) => {
      state.form.status = 'input';
      state.form.error = e.message.key ?? e.message;
      state.form.feedbackStatus = 'error';
    });
};
