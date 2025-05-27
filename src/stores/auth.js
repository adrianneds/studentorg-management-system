import { writable } from 'svelte/store';
import { Link, navigate } from "svelte-routing";
import { setLoading } from './loading';

function createAuthStore() {
  const { subscribe, set, update } = writable(null);

  return {
    subscribe,

    init: () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.type === 'member' || user.type === 'organization') {
          set(user);
        } else {
          localStorage.removeItem('user');
          set(null);
        }
      }
    },

    login: async (userData) => {
      setLoading(true, 'Logging in...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate user type
      if (userData.type !== 'member' && userData.type !== 'organization') {
        setLoading(false);
        throw new Error('Invalid user type');
      }

      // Store user data without password
      const { password, ...userWithoutPassword } = userData;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      set(userWithoutPassword);
      setLoading(false);
    },

    logout: () => {
      localStorage.removeItem('user');
      set(null);
    },

    validateCredentials: async(username, password, type) => {
      const res = await fetch(`http://localhost:5001/${type}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username: username, password: password})
      })
      if (!res.ok) {
        return false;
      }
      return true;
    }
    
  };
}

export const auth = createAuthStore(); 