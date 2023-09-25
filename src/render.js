export default (elements, error, previousError) => {
  const { form, feedbackField, input } = elements;
  form.reset();
  // input.focus();
  feedbackField.textContent = error;
  if (previousError && error) {
    return;
  }
  input.classList.toggle('invalid');
};
