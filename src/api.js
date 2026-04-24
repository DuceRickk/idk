function getCsrfToken() {
  return document.cookie
    .split('; ')
    .find(r => r.startsWith('csrf_token='))
    ?.split('=')[1] ?? '';
}

async function apiFetch(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    headers['X-CSRF-Token'] = getCsrfToken();
  }
  return fetch(path, { ...options, method, headers, credentials: 'include' });
}

export const api = {
  get:  (path)        => apiFetch(path),
  post: (path, body)  => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
};
