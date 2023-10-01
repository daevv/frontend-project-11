import updateFeeds from './updateFeed';

export default (res, state) => {
  const parser = new DOMParser();
  const parse = (data) => parser.parseFromString(data, 'text/xml');
  fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(res)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network error');
    })
    .then((data) => data.contents)
    .then((content) => updateFeeds(parse(content), state))
    .catch((err) => {
      state.status = 'input';
      state.error = err.message;
      state.feedbackStatus = 'error';
    });
};
