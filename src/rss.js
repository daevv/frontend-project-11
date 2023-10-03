export default (link) => {
  const parser = new DOMParser();
  const parse = (data) => parser.parseFromString(data, 'text/xml');
  return fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network error');
    })
    .then((data) => parse(data.contents))
    .catch(() => false);
};
