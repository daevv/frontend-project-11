const alloriginsHttp = 'https://allorigins.hexlet.app/get';

export default (link) => {
  const parser = new DOMParser();
  const parse = (data) => parser.parseFromString(data, 'text/xml');

  const url = new URL(alloriginsHttp);
  url.searchParams.set('disableCache', true);
  url.searchParams.set('url', link);
  return fetch(url)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network error');
    })
    .then((data) => parse(data.contents))
    .catch(() => false);
};
