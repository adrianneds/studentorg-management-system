import { writable } from 'svelte/store';
import { Link, navigate } from "svelte-routing";
import { setLoading } from './loading';

// Mock user data for testing
const mockUsers = {
  members: [
    {
      username: 'johndoe',
      password: 'password',
      type: 'member',
      student_number: '2024-0001',
      member_name: 'John Doe'
    }
  ],
  organizations: [
    {
      username: 'compsoc',
      password: 'password',
      type: 'organization',
      organization_id: 'CS-101123',
      organization_name: 'Computer Society'
    }
  ]
};

function createAuthStore() {
  const { subscribe, set, update } = writable(null);

  return {
    subscribe,

    init: () => {
      // setLoading(true, 'Initializing...');
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
      // setLoading(false);
    },

    login: async (userData) => {
      setLoading(true, 'Logging in...');
      // Simulate network delay
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
      if (userData.type == 'member') {
        navigate('/member-dashboard');
      } else if (userData.type == 'organization') {
        navigate('/organization-dashboard');
      }
      setLoading(false);
    },

    logout: () => {
      setLoading(true, 'Logging out...');
      localStorage.removeItem('user');
      set(null);
      setLoading(false);
    },

    validateCredentials: async(username, password, type) => {
      const res = await fetch(`http://localhost:5000/${type}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username: username, password: password})
      })
      if (!res.ok) {
        console.log(res)
        throw new Error('Failed login attempt')
      }
      return true
    }

    // validateCredentials: async (username, password, type) => {
    //   setLoading(true, 'Validating credentials...');
    //   // Simulate network delay
    //   await new Promise(resolve => setTimeout(resolve, 1000));
      
    //   if (type !== 'member' && type !== 'organization') {
    //     setLoading(false);
    //     return null;
    //   }
      
    //   const users = type === 'member' ? mockUsers.members : mockUsers.organizations;
    //   const user = users.find(u => u.username === username && u.password === password);
      
    //   setLoading(false);
    //   return user;
    // }
    
  };
}

export const auth = createAuthStore(); 