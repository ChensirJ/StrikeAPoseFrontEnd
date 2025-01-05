import React, { useState, useEffect } from 'react';
import './App.css';
import { Button, Upload, message } from 'antd';
import axios from './api/axios';
import Login from './components/Login';
import Register from './components/Register';
import DateSelector from './components/DateSelector';
import { videoApi } from './api/video';
import { UploadOutlined } from '@ant-design/icons';
import { api } from './api/index';
import Charts from './components/Charts';

function App() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoType, setVideoType] = useState('original'); // 'original' 或 'marked'
  const [uploading, setUploading] = useState(false);
  const [videos, setVideos] = useState([]); // 存储用户的视频列表
  const [currentAction, setCurrentAction] = useState(1);
  const [chartData, setChartData] = useState({
    stepHipDegree: null,
    stepLength: null,
    stepSpeed: null,
    stepStride: null,
    stepDifference: null
  });
  const [averages, setAverages] = useState({
    stepHipDegree: null,
    stepLength: null,
    stepSpeed: null,
    stepStride: null,
    stepDifference: null
  });
  // 添加 patientInfo 状态
  const [patientInfo, setPatientInfo] = useState({
    name: '张三',
    age: '45岁',
    gender: '男',
    date: '2024-12-01',
    recordNo: 'P20240118001'
  });
  const [selectedDate, setSelectedDate] = useState(null);

  // 添加登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // 模拟检查日期数据
  const [availableDates, setAvailableDates] = useState([
    '2024-12-01',
    '2024-12-10',
    '2024-12-20',
    '2024-12-31',
    '2025-01-09'
  ]);

  // 获取图表数据
  const fetchChartData = async (actionId) => {
    try {
      const [
        hipDegree,
        length,
        speed,
        stride,
        difference,
        avgHipDegree,
        avgLength,
        avgSpeed,
        avgStride,
        avgDifference
      ] = await Promise.all([
        api.dashboard.getStepHipDegree(actionId),
        api.dashboard.getStepLength(actionId),
        api.dashboard.getStepSpeed(actionId),
        api.dashboard.getStepStride(actionId),
        api.dashboard.getStepDifference(actionId),
        api.dashboard.averages.getStepHipDegree(actionId),
        api.dashboard.averages.getStepLength(actionId),
        api.dashboard.averages.getStepSpeed(actionId),
        api.dashboard.averages.getStepStride(actionId),
        api.dashboard.averages.getStepDifference(actionId)
      ]);

      setChartData({
        stepHipDegree: hipDegree,
        stepLength: length,
        stepSpeed: speed,
        stepStride: stride,
        stepDifference: difference
      });

      setAverages({
        stepHipDegree: avgHipDegree,
        stepLength: avgLength,
        stepSpeed: avgSpeed,
        stepStride: avgStride,
        stepDifference: avgDifference
      });
    } catch (error) {
      console.error('获取图表数据失败:', error);
      message.error('获取分析数据失败');
    }
  };

  // 当创建新的动作分析时获取数据
  useEffect(() => {
    if (currentAction) {
      fetchChartData(currentAction);
    }
  }, [currentAction]);

  // 处理视频上传和创建动作分析
  const handleVideoUpload = async (file) => {
    if (!currentUser) {
      message.error('请先登录！');
      return;
    }

    setUploading(true);
    try {
      // 1. 上传视频
      const uploadResult = await api.video.upload(currentUser.id, file);
      if (!uploadResult.message === "Video uploaded successfully") {
        throw new Error('视频上传失败');
      }

      // 2. 获取最新上传的视频信息
      const latestVideo = await axios.get(`/videos/get_videos/${currentUser.id}`);
      const videoId = latestVideo.data.id;

      // 3. 创建动作分析
      const actionResult = await api.action.create(currentUser.id, videoId);
      if (actionResult.action_id) {
        setCurrentAction(actionResult.action_id);
        message.success('视频已上传，正在进行分析...');
        
        // 根据视频类型设置不同的URL
        const videoUrl = videoType === 'original' 
          ? `/videos/original.mp4`
          : `/videos/labeled.mp4`;
        setVideoUrl(videoUrl);
      }
    } catch (error) {
      console.error('处理失败:', error);
      message.error('操作失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 上传组件配置
  const uploadProps = {
    beforeUpload: (file) => {
      if (!file.type.startsWith('video/')) {
        message.error('只能上传视频文件！');
        return false;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        await handleVideoUpload(file);
        onSuccess();
      } catch (error) {
        onError(error);
      }
    },
    showUploadList: false
  };

  // 注册成功后的处理
  const handleRegisterSuccess = (userData) => {
    setCurrentUser(userData);
    setShowRegister(false);
    message.success('注册成功！');
  };

  // 获取用户视频列表
  useEffect(() => {
    const fetchUserVideos = async () => {
      if (!currentUser) return;
      
      try {
        const response = await axios.get(`/videos/user/${currentUser.id}`);
        if (response.data && response.data.length > 0) {
          setVideos(response.data);
          // 默认显示最新的视频
          const latestVideo = response.data[0];
          const url = videoApi.getVideoUrl('original', currentUser.id, latestVideo.id);
          setVideoUrl(url);
        }
      } catch (error) {
        console.error('获取视频列表失败:', error);
      }
    };

    fetchUserVideos();
  }, [currentUser]);

  // 视频播放器组件
  const VideoPlayer = ({ url }) => {
    if (!url) return (
      <div className="video-placeholder">
        请上传视频或选择已有视频
      </div>
    );

    return (
      <video
        controls
        autoPlay
        muted
        className="main-video"
        key={url} // 确保URL改变时重新加载视频
      >
        <source src={url} type="video/mp4" />
        您的浏览器不支持视频播放。
      </video>
    );
  };

  useEffect(() => {
    // 检查本地存储中是否有用户信息
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // 日期选择处理
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // 这里可以添加获取对应日期视频的逻辑
    console.log('选择的日期:', date);
  };

  useEffect(() => {
    // 默认选择最新的日期
    if (availableDates.length > 0) {
      setSelectedDate(availableDates[0]);
    }
  }, []);

  useEffect(() => {
    if (currentAction) {
      const newVideoUrl = videoType === 'original'
        ? `/videos/original.mp4`
        : `/videos/labeled.mp4`;
      setVideoUrl(newVideoUrl);
    }
  }, [videoType, currentAction]);

  return (
    <div className="container">
      <div className="page-title">
        <span className="title-text">步态分析数据</span>
        <div className="header-actions">
          {!isLoggedIn ? (
            <>
              <Button 
                type="primary" 
                onClick={() => setShowLogin(true)}
                size="middle"
              >
                登录
              </Button>
              <Button 
                onClick={() => setShowRegister(true)}
                size="middle"
              >
                注册
              </Button>
            </>
          ) : (
            <>
              <span className="user-welcome">
                欢迎，{currentUser?.username}
              </span>
              <Button 
                onClick={handleLogout}
                size="middle"
                type="primary"
                danger
              >
                退出登录
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="main-content">
        <div className="video-section">
          <DateSelector
            dates={availableDates}
            onSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
          {/* 添加患者信息卡片 */}
          <div className="patient-info-card">
            <div className="patient-info-header">
              <div className="patient-basic-info">
                <span className="patient-name">{patientInfo.name}</span>
                <span className="patient-details">
                  {patientInfo.age} | {patientInfo.gender}
                </span>
              </div>
              <div className="patient-record-info">
                <div className="info-item">
                  <span className="info-label">病历号：</span>
                  <span className="info-value">123456</span>
                </div>
              </div>
            </div>
          </div>

          {/* 添加上传区域 */}
          <div className="upload-container">
            <Upload {...uploadProps}>
              <Button 
                icon={<UploadOutlined />} 
                loading={uploading}
              >
                上传视频
              </Button>
            </Upload>
          </div>

          {/* 添加视频类型切换按钮 */}
          <div className="video-type-selector">
            <div 
              className={`video-type-button ${videoType === 'original' ? 'active' : ''}`}
              onClick={() => setVideoType('original')}
            >
              原始视频
            </div>
            <div 
              className={`video-type-button ${videoType === 'marked' ? 'active' : ''}`}
              onClick={() => setVideoType('marked')}
            >
              标记视频
            </div>
          </div>

          <div className="video-container">
            <VideoPlayer url={videoUrl} />
          </div>
        </div>

        <div className="data-section">
          {currentAction && chartData.stepLength && (
          <div className="analysis-section">
            <Charts chartData={chartData} actionId={currentAction} />
          </div>
        )}
        </div>
      </div>

      <Login 
        visible={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <Register
        visible={showRegister}
        onClose={() => setShowRegister(false)}
        onRegisterSuccess={handleRegisterSuccess}
      />

      
    </div>
  );
}

export default App;