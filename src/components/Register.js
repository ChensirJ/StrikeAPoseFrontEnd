import React, { useState } from 'react';
import { Modal, message } from 'antd';
import axios from '../api/axios';

function Register({ visible, onClose }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users/register', {
        user: formData
      });
      
      if (response.data.id) {
        message.success('注册成功！请登录');
        setFormData({ username: '', password: '', email: '', phone: '' });
        onClose();
      } else {
        setError('注册失败，请重试');
      }
    } catch (error) {
      setError('注册失败，请重试');
    }
  };

  if (!visible) return null;

  return (
    <Modal
      title="注册"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <form onSubmit={handleSubmit} className="register-form">
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="用户名"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="密码"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="邮箱"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="tel"
            name="phone"
            placeholder="手机号"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>
        <button type="submit" className="submit-button">注册</button>
      </form>
    </Modal>
  );
}

export default Register; 