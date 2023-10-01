import onChange from 'on-change';

export default (state, elements, i18n) => {
  const {
    submitButton,
    field,
    feedbackField,
    feedsContainer,
    postsContainer,
  } = elements;

  const renderFeeds = (feeds) => {
    const feedNames = feeds.map(({ title, description }) => (`
      <li class="list-group-item border-0 border-end-0">
        <h3 class="h6 m-0">${title}</h3>
        <p class="m-0 small text-black-50">${description}</p>
      </li>`
    )).join('');

    const posts = feeds.map((feed) => {
      const currentFeedPosts = feed.posts;
      return currentFeedPosts.map(({ postTitle, postLink, postId }) => (`
        <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
          <a href="${postLink}" class="fw-bold" data-id="${postId}" target="_blank" rel="noopener noreferrer">${postTitle}</a>
          <button type="button" class="btn btn-outline-primary btn-sm" data-id="${postId}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>
        </li>`
      )).join('');
    }).join('');

    feedsContainer.innerHTML = `
      <div class="card border-0">
        <div class="card-body">
          <h2 class="card-title h4">Фиды</h2>
        </div>
        <ul class="list-group border-0 rounded-0">
          ${feedNames}
        </ul>
      </div>`;

    postsContainer.innerHTML = `
      <div class="card border-0">
        <div class="card-body">
          <h2 class="card-title h4">Посты</h2>
        </div>
        <ul class="list-group border-0 rounded-0">
          ${posts}
        </ul>
      </div>`;
  };

  const handleStatusChange = (status) => {
    submitButton.disabled = status !== 'input';
  };

  const handleError = (error, previousError) => {
    const errorText = error ? i18n.t(error) : i18n.t('success');
    feedbackField.textContent = errorText;
    if (error && previousError) {
      return;
    }
    if (error) {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
    } else {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
    }
  };

  const handleFeedbackStatusChange = (status) => {
    if (status === 'success') {
      feedbackField.classList.add('text-success');
      feedbackField.classList.remove('text-danger');
    } else {
      feedbackField.classList.remove('text-success');
      feedbackField.classList.add('text-danger');
    }
  };

  const watchedState = onChange(state, (path, value, previousValue) => {
    switch (path) {
      case 'status':
        handleStatusChange(value);
        break;
      case 'error':
        handleError(value, previousValue);
        break;
      case 'data':
        renderFeeds(value);
        break;
      case 'feedbackStatus':
        handleFeedbackStatusChange(value);
        break;
      default:
        break;
    }
  });

  return watchedState;
};
