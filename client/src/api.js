export default async function api(url, opts = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api' + url, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: 'Bearer ' + token }) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}
