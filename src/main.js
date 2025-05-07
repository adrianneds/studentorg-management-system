import "./app.css";
import App from "./App.svelte";
import { Router } from "svelte-routing";

// Initialize the app with the current URL
const app = new App({
  target: document.body,
  props: {
    url: window.location.pathname
  }
});

// Handle browser navigation
window.addEventListener('popstate', () => {
  app.$set({ url: window.location.pathname });
});

// Handle initial navigation
if (window.location.pathname === '/') {
  window.history.replaceState({}, '', '/home');
  app.$set({ url: '/home' });
}

export default app;