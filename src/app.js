import * as yup from 'yup';
import i18next from 'i18next';
// import resources from './locales/ru';
import formController from './formController';
import modalController from './modalController';
import createWatchedState from './view';
import { feeds, posts } from './model';
import checkForUpdates from './checkForUpdates';

export default async () => {
  const state = {
    form: {
      error: '.',
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
    form: document.querySelector('form'),
    submitButton: document.querySelector('button[type="submit"]'),
    field: document.querySelector('input'),
    feedbackField: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modal: {
      modalElement: document.querySelector('.modal'),
      modalTitle: document.querySelector('.modal-title'),
      modalBody: document.querySelector('.modal-body'),
      modalBtn: document.querySelector('.full-article'),
    },
  };

  const defaultLang = 'ru';
  const i18n = i18next.createInstance();
  await i18n.init({
    lng: defaultLang,
    debug: false,
    resources: {
      ru: { // Тексты конкретного языка
        translation: {
          posts: 'Посты',
          feeds: 'Фиды',
          openFeedButton: 'Просмотр',
          success: 'RSS успешно загружен',
          errors: {
            validation: {
              wrongFormat: 'Ссылка должна быть валидным URL',
              sameFeed: 'RSS уже существует',
            },
            network: {
              badConnection: 'Плохая связь с интернетом',
            },
          },
        },
      },
    },
  });

  yup.setLocale({
    mixed: {
      notOneOf: () => ({ key: 'errors.validation.sameFeed' }),
    },
    string: {
      url: () => ({ key: 'errors.validation.wrongFormat' }),
    },
  });

  const validator = (currentFeed) => {
    const feedsList = state.data.feeds.map(({ url }) => url);
    const schema = yup.string().url().notOneOf(feedsList);
    return schema.validate(currentFeed);
  };

  const watchedState = createWatchedState(state, elements, i18n);
  elements.form.addEventListener('submit', (evt) => formController(evt, watchedState, validator));
  elements.modal.modalElement.addEventListener('show.bs.modal', (evt) => modalController(evt, watchedState, elements));

  checkForUpdates(watchedState);
};
