import validateForm from './validator';

export default (form, state) => {
  form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    state.status = 'validation';
    const { target } = evt;
    const data = new FormData(target);
    const rssValue = data.get('rss-link');
    state.form.currentFeed = rssValue;
    validateForm(rssValue, state.feeds)
      .then((value) => {
        state.error = '';
        state.form.formStatus = value;
        state.feeds.push(value);
        console.log('ok');
      })
      .catch((err) => {
        const errMessage = err.message;
        state.error = errMessage;
        console.log('not ok');
      })
      .finally(() => {
        state.status = 'input';
      });
  });
};
