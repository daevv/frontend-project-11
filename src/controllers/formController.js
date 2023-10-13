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
        const containsRss = !!parsedRss.querySelector('rss');
        if (!containsRss) {
          throw new Error('errors.validation.invalidRss');
        }
        evt.target.reset();
        evt.target.querySelector('input').focus();
        parseFeed(parsedRss, state, feed);
        state.form.feedback = 'success';
        state.form.feedbackStatus = 'success';
        state.form.status = 'input';
        return;
      }
      throw new Error('errors.network.badConnection');
    })
    .catch((e) => {
      state.form.status = 'input';
      state.form.feedbackStatus = 'error';
      state.form.feedback = e.message.key ?? e.message;
    });
};
