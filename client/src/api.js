// Small wrapper around the Express API.
const BASE = import.meta.env.VITE_API_URL ?? '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  getPortfolio: () => request('/api/portfolio'),
  sendMessage: (message, conversationId) =>
    request('/api/chat', { method: 'POST', body: JSON.stringify({ message, conversationId }) }),
  getConversation: (id) => request(`/api/chat/${id}`),
  deleteConversation: (id) => request(`/api/chat/${id}`, { method: 'DELETE' }),
};
