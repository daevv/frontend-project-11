export default (evt, state, elements) => {
  console.log(evt.relatedTarget);
  const postId = parseInt(evt.relatedTarget.dataset.id, 10);
  const {
    postTitle,
    postDescription,
    postLink,
  } = state.data.posts.find((post) => post.postId === postId);
  elements.modal.modalTitle.textContent = postTitle;
  elements.modal.modalBody.textContent = postDescription;
  elements.modal.modalBtn.href = postLink;
};
