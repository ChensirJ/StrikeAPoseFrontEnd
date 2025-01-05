import React, { useState } from 'react';
import { Modal, message } from 'antd';
import axios from '../api/axios';

function Login({ visible, onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users/login', {
        user_model: {
          username: formData.username,
          password: formData.password
        }
      });
      
      if (response.data.message === 'Login successful') {
        message.success('登录成功！');
        onLoginSuccess(response.data.user);
        setFormData({ username: '', password: '' });
        setError('');
        onClose();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error);
      setError(error.response?.data?.message || '登录失败，请重试');
    }
  };

  return (
    <Modal
      title="登录"
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="用户名"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="密码"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">登录</button>
      </form>
    </Modal>
  );
}

export default Login; 