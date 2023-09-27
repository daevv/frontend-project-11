import onChange from 'on-change';

export default (state, elements, i18n) => {
  const { submitButton, field, feedbackField } = elements;

  const onStatusChange = (status) => {
    submitButton.disabled = status !== 'input';
  };

  const handleError = (error, previousError) => {
    const errorText = error ? i18n.t(error) : i18n.t('success');
    feedbackField.textContent = errorText;
    if (error && previousError) {
      return;
    }
    if (error) {
      field.classList.add('invalid');
      field.classList.remove('is-valid');
    } else {
      field.classList.remove('invalid');
      field.classList.add('is-valid');
    }
  };

  const watchedState = onChange(state, (path, value, previousValue) => {
    switch (path) {
      case 'status':
        onStatusChange(value);
        break;
      case 'error':
        handleError(value, previousValue);
        break;
      default:
        break;
    }
  });

  return watchedState;
};
