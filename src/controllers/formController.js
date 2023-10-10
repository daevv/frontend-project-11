import rss from '../api/rss';
import parseFeed from '../parsers/parseFeed';

export default (evt, state, validator) => {
  evt.preventDefault();
  state.form.status = 'checking';
  const data = new FormData(evt.target);
  const feed = data.get('rss-link');
  validator(feed, state.data.feeds)
    .then((validFeed) => rss(validFeed, state))
    .then((parsedRss) => {
      if (parsedRss) {
        evt.target.reset();
        evt.target.querySelector('input').focus();
        parseFeed(parsedRss, state, feed);
        state.form.error = '';
        state.form.feedbackStatus = 'success';
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
