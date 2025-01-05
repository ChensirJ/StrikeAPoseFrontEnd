import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { Tabs } from 'antd';
import axios from '../api/axios';

const Charts = ({ chartData, actionId }) => {
  const [activeParam, setActiveParam] = useState('步速');
  const [currentChart, setCurrentChart] = useState(null);

  const params = [
    { key: '步速', endpoint: 'step_speed' },
    { key: '步幅', endpoint: 'step_stride' },
    { key: '步长', endpoint: 'step_length' },
    { key: '步长差', endpoint: 'step_difference' },
    { key: '步宽', endpoint: 'step_width' },
    { key: '单腿支撑时间', endpoint: 'single_support_time' },
    { key: '足离地距离', endpoint: 'foot_clearance' },
    { key: '髋关节夹角范围', endpoint: 'step_hip_degree' }
  ];

  const fetchAndRenderChart = async (endpoint, chartId, title) => {
    try {
      const response = await axios.get(`/dashboard/${endpoint}/${actionId}`);
      const chartData = JSON.parse(response.data);
      
      const chartDom = document.getElementById(chartId);
      if (!chartDom) return;

      if (currentChart) {
        currentChart.dispose();
      }

      const chart = echarts.init(chartDom);
      chart.setOption(chartData);
      setCurrentChart(chart);
    } catch (error) {
      console.error(`Error fetching data for ${title}:`, error);
    }
  };

  const renderChartWithCurrentState = (param) => {
    const paramConfig = params.find(p => p.key === param) || params[0];
    fetchAndRenderChart(paramConfig.endpoint, 'mainChart', param);
  };

  useEffect(() => {
    renderChartWithCurrentState(activeParam);

    return () => {
      if (currentChart) {
        currentChart.dispose();
      }
    };
  }, [activeParam, actionId]);

  const handleParamChange = (param) => {
    setActiveParam(param);
  };

  return (
    <div className="dashboard">
      <h1>分析结果</h1>
      
      <div className="chart-controls">
        <Tabs
          activeKey={activeParam}
          onChange={handleParamChange}
          items={params.map(param => ({
            key: param.key,
            label: param.key
          }))}
        />
      </div>

      <div className="chart-container">
        <div id="mainChart" className="chart" />
      </div>
    </div>
  );
};

export default Charts; 