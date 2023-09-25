import onChange from 'on-change';
import renderForm from './render';

const onStatusChange = (status, btn) => {
  switch (status) {
    case 'input':
      btn.disabled = false;
      break;
    case 'validation':
      btn.disabled = true;
      break;
    default:
      throw new Error('invalid status');
  }
};

export default (state, elements) => onChange(state, (path, value, previousValue) => {
  if (path === 'status') {
    onStatusChange(value, elements.submitButton);
  }
  if (path === 'error') {
    renderForm(elements, state.error, previousValue);
  }
});
