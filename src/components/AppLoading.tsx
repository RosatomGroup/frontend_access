import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';

export default function AppLoadingComponent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          background: 'rgba(255, 255, 255, 0.7)',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }
}

