import createWatchedState from './model';
import initController from './controller';

export default () => {
  const state = {
    form: {
      formStatus: 'invalid',
      currentFeed: '',
    },
    feeds: [],
    error: '',
    status: 'input',
  };

  const elements = {
    form: document.querySelector('form'),
    submitButton: document.querySelector('button'),
    input: document.querySelector('input'),
    feedbackField: document.querySelector('.feedback'),
  };

  const watchedState = createWatchedState(state, elements);
  initController(elements.form, watchedState);
};
