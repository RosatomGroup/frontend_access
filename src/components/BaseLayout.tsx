// 'use client';

// import { Typography, Breadcrumb, Layout, theme } from 'antd';
// import Link from 'next/link';
// import AppHeader from './AppHeader';
// import AppSider from './AppSider';

// const { Header, Content } = Layout;

// /**
//  * Базовый макет для страниц приложения
//  * @param title - Заголовок страницы
//  * @param breadcrumbs - Хлебные крошки
//  * @param children - Дочерние элементы
//  */
// export default function BaseLayout({
//   title,
//   breadcrumbs,
//   children,
// }: {
//   title: string;
//   breadcrumbs: Array<{ title: string; href?: string }>;
//   children: React.ReactNode;
// }) {
//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();

//   return (
//     <Layout>
//       <AppHeader />
//       <Layout style={{ minHeight: '100vh' }}>
//         <AppSider />
//         <Layout>
//           <Header style={{ paddingLeft: 16, background: colorBgContainer, height: '100px' }}>
//             <Breadcrumb
//               style={{ margin: '16px 0' }}
//               items={breadcrumbs.map(item => ({
//                 title: item.href ? <Link href={item.href}>{item.title}</Link> : item.title,
//               }))}
//             />
//             <Typography.Title level={4}>{title}</Typography.Title>
//           </Header>
//           <Content style={{ margin: '0 16px', paddingTop: '16px' }}>
//             <div
//               style={{
//                 padding: 24,
//                 minHeight: 360,
//                 background: colorBgContainer,
//                 borderRadius: borderRadiusLG,
//               }}
//             >
//               {children}
//             </div>
//           </Content>
//         </Layout>
//       </Layout>
//     </Layout>
//   );
// }

// src/components/BaseLayout.tsx
'use client';

import { Typography, Breadcrumb, Layout, theme } from 'antd';
import Link from 'next/link';
import AppHeader from './AppHeader';
import AppSider from './AppSider';

const { Header, Content } = Layout;

interface BaseLayoutProps {
  title: string;
  breadcrumbs: Array<{ title: string; href?: string }>;
  children: React.ReactNode;
}

export default function BaseLayout({
  title,
  breadcrumbs,
  children,
}: BaseLayoutProps) {
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
              items={breadcrumbs.map(item => ({
                title: item.href ? <Link href={item.href}>{item.title}</Link> : item.title,
              }))}
            />
            <Typography.Title level={4}>{title}</Typography.Title>
          </Header>
          <Content style={{ margin: '0 16px', paddingTop: '16px' }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}