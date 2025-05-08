import axios from 'axios';

const API = axios.create({
  baseURL: 'https://task-hub-903a.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
