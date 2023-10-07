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
          <h2 class="card-title h4">${i18n.t('feeds')}</h2>
        </div>
        <ul class="list-group border-0 rounded-0">
        </ul>
      </div>`;
    }
    const feedsList = feedsContainer.querySelector('ul');
    feedsList.insertBefore(feedElement, feedsList.firstElementChild);
  };

  const renderPosts = ({ lastPosts, readPostsIds }) => {
    if (!postsContainer.firstElementChild) {
      postsContainer.innerHTML = `
      <div class="card border-0">
        <div class="card-body">
          <h2 class="card-title h4">${i18n.t('posts')}</h2>
        </div>
        <ul class="list-group border-0 rounded-0">
        </ul>
      </div>`;
    }
    const postsList = postsContainer.querySelector('ul');

    // возможно придётся реверснуть, чтобы изменить порядок
    lastPosts.forEach((post) => {
      const { postTitle, postLink, postId } = post;
      const listElement = document.createElement('li');
      listElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      listElement.innerHTML = `<a href="${postLink}" class="${readPostsIds.includes(postId) ? 'fw-normal' : 'fw-bold'}" data-id="${postId}" target="_blank" rel="noopener noreferrer">${postTitle}</a>`;

      const viewButton = document.createElement('button');
      viewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      viewButton.textContent = i18n.t('openFeedButton');
      viewButton.type = 'submit';
      viewButton.dataset.id = postId;
      viewButton.dataset.bsToggle = 'modal';
      viewButton.dataset.bsTarget = '#exampleModal';
      listElement.appendChild(viewButton);

      viewButton.addEventListener('click', (evt) => {
        evt.preventDefault();
        const postElement = evt.target.closest('li').querySelector('a');
        postElement.classList = 'fw-normal';
        readPostsIds.push(postElement.dataset.id);
      });
      postsList.prepend(listElement);
    });
  };

  const handleStatusChange = (status) => {
    submitButton.disabled = status !== 'input';
    console.log('changing status');
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
        renderPosts(state.data);
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
