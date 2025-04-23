'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Typography } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import Image from 'next/image';

const { Title, Text } = Typography;

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Title level={1}>404 - Страница не найдена</Title>
      <Text style={{ fontSize: '18px' }}>Похоже, этой страницы не существует.</Text>

      <Image
        src={'/images/404error.png'}
        alt="Error 404"
        style={{ width: '100%', maxWidth: '500px', height: 'auto' }}
        width={500}
        height={300}
      />

      <Link href="/">
        <Button type="primary" style={{ marginTop: 24 }}>
          Вернуться на главную
        </Button>
      </Link>
    </div>
  );
}

