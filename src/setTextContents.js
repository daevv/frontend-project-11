export default (elements, i18n) => {
  const setText = (element, text) => element.textContent = text;

  setText(elements.siteTitle, i18n.t('siteTitle'));
  setText(elements.siteSubTitle, i18n.t('siteSubTitle'));
  setText(elements.formLabel, i18n.t('formLabel'));
  setText(elements.submitButton, i18n.t('submitButton'));
  setText(elements.rssExample, i18n.t('rssExample'));

  setText(elements.modal.modalBtn, i18n.t('modalBtn'));
  setText(elements.modal.modalCloser, i18n.t('modalCloser'));
};
