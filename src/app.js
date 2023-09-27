import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/ru';
import createWatchedState from './view';

export default async () => {
  const state = {
    feeds: [],
    error: '',
    status: 'input',
  };

  const elements = {
    form: document.querySelector('form'),
    submitButton: document.querySelector('button'),
    field: document.querySelector('input'),
    feedbackField: document.querySelector('.feedback'),
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
          reedFullPostButton: 'Читать полностью',
          closeButton: 'Закрыть',
          success: 'RSS успешно загружен',
          errors: {
            validation: {
              wrongFormat: 'Ссылка должна быть валидным URL',
              sameFeed: 'RSS уже существует',
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

  const validator = (currentFeed, feeds) => {
    const schema = yup.string().url().notOneOf(feeds);
    return schema.validate(currentFeed);
  };

  const watchedState = createWatchedState(state, elements, i18n);
  elements.form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    watchedState.status = 'checking';
    const data = new FormData(evt.target);
    const feed = data.get('rss-link');
    validator(feed, state.feeds)
      .then((validFeed) => {
        console.log(validFeed);
        watchedState.feeds.push(validFeed);
        watchedState.status = 'input';
        watchedState.error = '';
      })
      .catch((e) => {
        watchedState.status = 'input';
        watchedState.error = e.message.key;
        console.log(e.message.key);
      });
  });
};
