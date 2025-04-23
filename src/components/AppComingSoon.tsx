import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Space } from 'antd';
import Image from 'next/image';

const { Title, Text } = Typography;

const ComingSoonPage: React.FC = () => {
  const [timer, setTimer] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const countdownDate = new Date('2025-06-06T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimer({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <Row justify="center" align="middle" gutter={[32, 32]}>
        <Col>
          <Image
            src={'/images/Process.png'}
            alt="Coming Soon"
            width={500}  // Физическая ширина изображения
            height={300} // Физическая высота
            style={{ width: '100%', maxWidth: '500px', height: 'auto' }} // Стили для адаптивности
          />
        </Col>
        <Col>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Title level={1}>Ведутся работы</Title>
            <Text style={{ fontSize: '24px' }}>Мы скоро все сделаем</Text>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '25px' }}>
              {`${timer.days.toString().padStart(2, '0')} : ${timer.hours.toString().padStart(2, '0')} : ${timer.minutes.toString().padStart(2, '0')} : ${timer.seconds.toString().padStart(2, '0')}`}
              <div style={{ fontSize: '14px', marginTop: '1rem' }}>
                Дни : Часы : Минуты : Секунды
              </div>
            </div>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default ComingSoonPage;

