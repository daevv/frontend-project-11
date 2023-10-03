import onChange from 'on-change';

export default (state, elements, i18n) => {
  const {
    submitButton,
    field,
    feedbackField,
    feedsContainer,
    postsContainer,
  } = elements;

  const renderFeed = (feed) => {
    const { title, description } = feed;
    const feedElement = document.createElement('li');
    feedElement.classList.add('list-group-item', 'border-0', 'border-end-0');
    feedElement.innerHTML = `
      <h3 class="h6 m-0">${title}</h3>
      <p class="m-0 small text-black-50">${description}</p>`;

    if (!feedsContainer.firstElementChild) {
      feedsContainer.innerHTML = `
      <div class="card border-0">
        <div class="card-body">
          <h2 class="card-title h4">Фиды</h2>
        </div>
        <ul class="list-group border-0 rounded-0">
        </ul>
      </div>`;
    }
    const feedsList = feedsContainer.querySelector('ul');
    feedsList.insertBefore(feedElement, feedsList.firstElementChild);
  };

  const renderPosts = (posts) => {
    if (!postsContainer.firstElementChild) {
      postsContainer.innerHTML = `
      <div class="card border-0">
        <div class="card-body">
          <h2 class="card-title h4">Посты</h2>
        </div>
        <ul class="list-group border-0 rounded-0">
        </ul>
      </div>`;
    }
    const postsList = postsContainer.querySelector('ul');

    // возможно придётся реверснуть, чтобы изменить порядок
    const html = posts.map((post) => {
      const { postTitle, postLink, postId } = post;
      return `
        <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
          <a href="${postLink}" class="fw-bold" data-id="${postId}" target="_blank" rel="noopener noreferrer">${postTitle}</a>
          <button type="button" class="btn btn-outline-primary btn-sm" data-id="${postId}" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>
        </li>`;
    }).join('');

    postsList.innerHTML = html + postsList.innerHTML;
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
      case 'form.status':
        handleStatusChange(value);
        break;
      case 'form.error':
        handleError(value, previousValue);
        break;
      case 'data.feeds':
        renderFeed(state.data.lastFeed);
        break;
      case 'data.posts':
        renderPosts(state.data.lastPosts);
        break;
      case 'form.feedbackStatus':
        handleFeedbackStatusChange(value);
        break;
      default:
        break;
    }
  });

  return watchedState;
};
