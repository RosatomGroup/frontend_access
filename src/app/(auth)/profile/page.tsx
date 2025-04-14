'use client';

import { Typography } from 'antd';
import { Breadcrumb, Layout, theme } from 'antd';
import AppSider from '../../../components/AppSider';
import AppHeader from '../../../components/AppHeader';
import Link from 'next/link';

const { Header, Content } = Layout;

export default function ProfilePage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <AppHeader />
      <Layout style={{ minHeight: '100vh' }}>
        <AppSider />
        <Layout>
          <Header style={{ paddingLeft: 16, background: colorBgContainer, height: '100px' }}>
            <Breadcrumb
              style={{ margin: '16px 0' }}
              items={[
                {
                  title: <Link href="/">Главная</Link>,
                },
                {
                  title: 'Профиль',
                },
              ]}
            />
            <Typography.Title level={4}>Профиль пользователя</Typography.Title>
          </Header>
          <Content style={{ margin: '0 16px', paddingTop: '16px' }}>
            <div
              style={{
                padding: 24,
                minHeight: 900,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import { useProfileModal } from '@/context/ModalContext'; // Ваш контекст или хранилище

// export default function ProfilePage() {
//   const router = useRouter();
//   const { openProfileModal } = useProfileModal();

//   useEffect(() => {
//     openProfileModal(); // Открываем модалку
//     window.history.replaceState(null, '', window.location.pathname); // Очищаем историю
//   }, [openProfileModal]);

//   return null;
// }

// app/profile/page.tsx
// 'use client';

// export default function ProfilePage() {
//   // Эта страница не рендерит ничего,
//   // так как модалка управляется через AppHeader
//   return null;
// }

// app/profile/page.tsx

// 'use client';

// import { Card } from 'antd';
// import Profile from '@/components/ui/Profile';

// export default function ProfilePage() {
//   return (
//     <div className="p-4">
//       <Card title="Профиль пользователя" bordered={false}>
//         <Profile />
//       </Card>
//     </div>
//   );
// }