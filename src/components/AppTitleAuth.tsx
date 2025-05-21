import { Image, Typography } from 'antd';
import { Flex } from 'antd';

export default function AppTitleAuth() {
  return (
    <Flex vertical align="center" justify="center" style={{ margin: '1rem 0' }}>
      <Image width={50} preview={false} src="/favicon.ico" alt="RBAC" />
      <Typography.Title
        level={2}
        style={{
          paddingLeft: '0.5rem',
          margin: 0,
          color: 'rgba(0, 0, 0, 0.7)',
          textAlign: 'center',
          fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
          lineHeight: 1.3,
        }}
      >
        Система автоматизации доступа <br />к корпоративным ресурсам
      </Typography.Title>
    </Flex>
  );
}

