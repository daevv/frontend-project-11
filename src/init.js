import * as yup from 'yup';
import i18next from 'i18next';
import ru from './locales/ru';
import formController from './controllers/formController';
import modalController from './controllers/modalController';
import createWatchedState from './view';
import { feeds, posts } from './model';
import checkForUpdates from './api/checkForUpdates';
import setTextContents from './setTextContents';

export default async () => {
  const state = {
    form: {
      feedback: '',
      status: 'input',
      feedbackStatus: '',
    },
    data: {
      feeds,
      posts,
      lastFeed: '',
      lastPosts: [],
      readPostsIds: [],
    },
  };
  const elements = {
    siteTitle: document.querySelector('h1'),
    siteSubTitle: document.querySelector('p.lead'),
    formLabel: document.querySelector('label'),
    form: document.querySelector('form'),
    submitButton: document.querySelector('[type="submit"]'),
    field: document.querySelector('input'),
    feedbackField: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    rssExample: document.querySelector('p.text-white'),
    modal: {
      modalElement: document.querySelector('.modal'),
      modalTitle: document.querySelector('.modal-title'),
      modalBody: document.querySelector('.modal-body'),
      modalBtn: document.querySelector('.full-article'),
      modalCloser: document.querySelector('.btn-secondary[data-bs-dismiss="modal"]'),
    },
  };

  const defaultLang = 'ru';
  const i18n = i18next.createInstance();
  await i18n.init({
    lng: defaultLang,
    debug: false,
    resources: {
      ru,
    },
  });

  setTextContents(elements, i18n);

  yup.setLocale({
    mixed: {
      notOneOf: () => ({ key: 'errors.validation.sameFeed' }),
    },
    string: {
      url: () => ({ key: 'errors.validation.wrongFormat' }),
    },
  });

  const validator = (currentFeed, addedFeeds) => {
    const feedsList = addedFeeds.map(({ url }) => url);
    const schema = yup.string().url().notOneOf(feedsList);
    return schema.validate(currentFeed);
  };

  const watchedState = createWatchedState(state, elements, i18n);
  elements.form.addEventListener('submit', (evt) => formController(evt, watchedState, validator));
  elements.modal.modalElement.addEventListener('show.bs.modal', (evt) => modalController(evt, watchedState, elements));

  checkForUpdates(watchedState);
};
