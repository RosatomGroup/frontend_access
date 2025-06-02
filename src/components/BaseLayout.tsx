'use client';

import { Breadcrumb, Layout, theme, Typography } from 'antd';
import Link from 'next/link';
import AppHeader from './AppHeader';
import AppSider from './AppSider';
import { useUser } from "@/hooks/AppGuardUserAdmin";
import styles from './BaseLayout.module.css';

const { Header, Content } = Layout;

interface BreadcrumbItem {
    title: string;
    href?: string;
}

interface BaseLayoutProps {
    title: string;
    breadcrumbs: BreadcrumbItem[];
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

    const user = useUser();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AppSider
                userRole={user?.accessLevel as 'ADMIN' | 'USER' | null}
                isLoading={!user}
            />
            <Layout>
                <Header style={{ background: colorBgContainer, borderRadius: borderRadiusLG, margin: 16 }}>
                    <AppHeader />
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        {breadcrumbs.map((item, idx) =>
                            item.href ? (
                                <Breadcrumb.Item key={idx}>
                                    <Link href={item.href}>{item.title}</Link>
                                </Breadcrumb.Item>
                            ) : (
                                <Breadcrumb.Item key={idx}>{item.title}</Breadcrumb.Item>
                            )
                        )}
                    </Breadcrumb>
                    <Typography.Title level={2}>{title}</Typography.Title>
                    <div className={styles.content}>{children}</div>
                </Content>
            </Layout>
        </Layout>
    );
}
