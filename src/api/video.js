import axios from './axios';

// 视频相关的 API 函数
export const videoApi = {
  // 上传视频
  uploadVideo: async (userId, videoFile) => {
    const formData = new FormData();
    formData.append('video', videoFile);
    
    try {
      const response = await axios.post(`/videos/upload/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 获取视频流URL
  getVideoUrl: (videoType, userId, videoId) => {
    return `${process.env.REACT_APP_API_URL}/videos/stream/${videoType}/${userId}/${videoId}`;
  }
}; 