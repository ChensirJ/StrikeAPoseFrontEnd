import axios from './axios';
import { dashboardApi } from './dashboard';

/**
 * @typedef {Object} CreateActionRequest
 * @property {number} user_id
 * @property {number} video_id
 */

/**
 * @typedef {Object} CreateActionResponse
 * @property {string} message
 * @property {number} action_id
 */

export const api = {
  // 用户相关
  user: {
    register: async (userData) => {
      const response = await axios.post('/register', { user: userData });
      return response.data;
    }
  },

  // 视频相关
  video: {
    upload: async (userId, videoFile) => {
      const formData = new FormData();
      formData.append('video', videoFile);
      const response = await axios.post(`/videos/upload/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    getUrl: (videoType, userId, videoId) => {
      return `${process.env.REACT_APP_API_URL}/videos/stream/${videoType}/${userId}/${videoId}`;
    }
  },

  // 动作分析相关
  action: {
    /**
     * 创建动作分析
     * @param {number} userId 
     * @param {number} videoId 
     * @returns {Promise<CreateActionResponse>}
     */
    create: async (userId, videoId) => {
      const data = {
        user_id: parseInt(userId),
        video_id: parseInt(1)
      };
      
      try {
        const response = await axios.post(
          '/actions/',
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error('创建动作分析失败:', error);
        throw error;
      }
    }
  },

  dashboard: dashboardApi
}; 