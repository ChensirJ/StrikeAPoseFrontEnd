import axios from './axios';

export const dashboardApi = {
  // 获取髋关节角度范围数据
  getStepHipDegree: async (actionId) => {
    const response = await axios.get(`/dashboard/step_hip_degree/${actionId}`);
    return response.data;
  },

  // 获取步长数据
  getStepLength: async (actionId) => {
    const response = await axios.get(`/dashboard/step_length/${actionId}`);
    return response.data;
  },

  // 获取步速数据
  getStepSpeed: async (actionId) => {
    const response = await axios.get(`/dashboard/step_speed/${actionId}`);
    return response.data;
  },

  // 获取步幅数据
  getStepStride: async (actionId) => {
    const response = await axios.get(`/dashboard/step_stride/${actionId}`);
    return response.data;
  },

  // 获取步长差异数据
  getStepDifference: async (actionId) => {
    const response = await axios.get(`/dashboard/step_difference/${actionId}`);
    return response.data;
  },

  // 获取平均值数据
  averages: {
    // 获取平均髋关节角度
    getStepHipDegree: async (actionId) => {
      const response = await axios.get(`/dashboard/average/step_hip_degree/${actionId}`);
      return response.data;
    },

    // 获取平均步长
    getStepLength: async (actionId) => {
      const response = await axios.get(`/dashboard/average/step_length/${actionId}`);
      return response.data;
    },

    // 获取平均步速
    getStepSpeed: async (actionId) => {
      const response = await axios.get(`/dashboard/average/step_speed/${actionId}`);
      return response.data;
    },

    // 获取平均步幅
    getStepStride: async (actionId) => {
      const response = await axios.get(`/dashboard/average/step_stride/${actionId}`);
      return response.data;
    },

    // 获取平均步长差异
    getStepDifference: async (actionId) => {
      const response = await axios.get(`/dashboard/average/step_difference/${actionId}`);
      return response.data;
    }
  }
}; 