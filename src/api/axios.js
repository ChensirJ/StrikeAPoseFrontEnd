import axios from 'axios';

const instance = axios.create({
  baseURL: '/api/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default instance; 