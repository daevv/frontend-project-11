import rss from './rss';
import parseFeed from './parseFeed';

export default (evt, state, validator) => {
  evt.preventDefault();
  state.form.status = 'checking';
  const data = new FormData(evt.target);
  const feed = data.get('rss-link');
  validator(feed, state.data.feeds)
    .then((validFeed) => {
      state.form.error = '';
      state.form.feedbackStatus = 'success';
      return rss(validFeed, state);
    })
    .then((parsedRss) => {
      if (parsedRss) {
        parseFeed(parsedRss, state, feed);
        state.form.status = 'input';
        return;
      }
      throw new Error('errors.network.badConnection');
    })
    .catch((e) => {
      state.form.status = 'input';
      state.form.feedbackStatus = 'error';
      state.form.error = e.message.key ?? e.message;
    });
};
