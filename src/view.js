import onChange from 'on-change';

export default (state, elements, i18n) => {
  const {
    submitButton,
    field,
    feedbackField,
    feedsContainer,
    postsContainer,
  } = elements;

  const getCardElement = (type) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card', 'border-0');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const listElement = document.createElement('ul');
    listElement.classList.add('list-group', 'border-0', 'rounded-0');

    const cardTitle = document.createElement('h2');
    cardTitle.classList.add('card-title', 'h4');
    cardTitle.textContent = i18n.t(type);

    cardBody.append(cardTitle);
    cardElement.append(cardBody);
    cardElement.append(listElement);

    return cardElement;
  };

  const renderFeed = (feed) => {
    const { title, description } = feed;

    const feedElement = document.createElement('li');
    feedElement.classList.add('list-group-item', 'border-0', 'border-end-0');

    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = title;

    const feedSubTitle = document.createElement('p');
    feedSubTitle.classList.add('m-0', 'small', 'text-black-50');
    feedSubTitle.textContent = description;

    feedElement.append(feedTitle);
    feedElement.append(feedSubTitle);

    if (!feedsContainer.firstElementChild) {
      const cardElement = getCardElement('feeds');
      feedsContainer.append(cardElement);
    }

    const feedsList = feedsContainer.querySelector('ul');
    feedsList.insertBefore(feedElement, feedsList.firstElementChild);
  };

  const renderPosts = ({ lastPosts, readPostsIds }) => {
    if (!postsContainer.firstElementChild) {
      const cardElement = getCardElement('posts');
      postsContainer.append(cardElement);
    }
    const postsList = postsContainer.querySelector('ul');

    lastPosts.reverse().forEach((post) => {
      const { postTitle, postLink, postId } = post;

      const listElement = document.createElement('li');
      listElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      const title = document.createElement('a');
      title.classList.add(readPostsIds.includes(postId) ? 'fw-normal' : 'fw-bold');
      title.href = postLink;
      title.dataset.id = postId;
      title.setAttribute('target', '_blank');
      title.setAttribute('rel', 'noopener noreferrer');
      title.textContent = postTitle;

      listElement.append(title);

      const viewButton = document.createElement('button');
      viewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      viewButton.textContent = i18n.t('openFeedButton');
      viewButton.setAttribute('type', 'button');
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
  };

  const handleFeedbackChange = (value) => {
    const feedbackText = i18n.t(value);
    console.log(feedbackText);
    feedbackField.textContent = feedbackText;
  };

  const handleFeedbackStatusChange = (status) => {
    if (status === 'success') {
      feedbackField.classList.add('text-success');
      feedbackField.classList.remove('text-danger');
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
    } else {
      feedbackField.classList.remove('text-success');
      feedbackField.classList.add('text-danger');
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
    }
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.status':
        handleStatusChange(value);
        break;
      case 'form.feedback':
        handleFeedbackChange(value);
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
