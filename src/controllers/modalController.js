export default (evt, state, elements) => {
  const postId = evt.relatedTarget.dataset.id;
  const {
    postTitle,
    postDescription,
    postLink,
  } = state.data.posts.find((post) => post.postId === postId);
  elements.modal.modalTitle.textContent = postTitle;
  elements.modal.modalBody.textContent = postDescription;
  elements.modal.modalBtn.href = postLink;
};
