import { API_BASE } from './config';

export async function safeFetch(path: string) {
  try {
    const res = await fetch(API_BASE + path);
    if (!res.ok) return null;
    const text = await res.text();
    if (!text || text.trim() === '') return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  } catch {
    return null;
  }
}

export const api = {
  get: (path: string) => safeFetch(path),
  post: async (path: string, body: any) => {
    try {
      const res = await fetch(API_BASE + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const text = await res.text();
      if (!text) return null;
      return JSON.parse(text);
    } catch { return null; }
  },
  delete: async (path: string) => {
    try {
      const res = await fetch(API_BASE + path, { method: 'DELETE' });
      return res.ok;
    } catch { return false; }
  }
};
