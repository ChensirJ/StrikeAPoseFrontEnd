import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://172.31.178.187:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default instance; 