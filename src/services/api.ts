const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // User endpoints
  users: {
    getAll: () => fetch(`${API_BASE_URL}/users`).then(res => res.json()),
    getById: (id: string) => fetch(`${API_BASE_URL}/users/${id}`).then(res => res.json()),
    create: (userData: any) => 
      fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      }).then(res => res.json())
  },
  
  // Add more API endpoints here as needed
  // transactions: { ... },
  // budgets: { ... },
  // goals: { ... }
};

export default api;
