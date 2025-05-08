import { writable } from 'svelte/store';

export const loading = writable(false);
export const loadingMessage = writable('');

export const setLoading = (isLoading, message = '') => {
  loading.set(isLoading);
  loadingMessage.set(message);
}; 