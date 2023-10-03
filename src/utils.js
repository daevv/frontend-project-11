const initIdGenerator = () => {
  const id = 0;
  return () => id + 1;
};

export { initIdGenerator };
