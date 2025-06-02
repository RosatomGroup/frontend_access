'use client';

import {Breadcrumb, Layout, Spin, theme, Typography} from 'antd';
import Link from 'next/link';
import AppHeader from './AppHeader';
import AppSider from './AppSider';
import {useUser} from "@/hooks/AppGuardUserAdmin";
import styles from './BaseLayout.module.css';

const {Header, Content} = Layout;

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
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const {user, loading} = useUser();

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="large" tip="Загрузка..."/>
            </div>
        );
    }

    return (
        <Layout className={styles.layout}>
            <AppHeader/>
            <Layout className={styles.contentLayout}>
                <AppSider userRole={user?.accessLevel}/>
                <Layout>
                    <Header className={styles.pageHeader} style={{background: colorBgContainer}}>
                        <div className={styles.headerContent}>
                            <Breadcrumb
                                items={breadcrumbs.map(item => ({
                                    title: item.href ? (
                                        <Link href={item.href}>{item.title}</Link>
                                    ) : (
                                        item.title
                                    ),
                                }))}
                            />
                            <Typography.Title level={4} className={styles.pageTitle}>
                                {title}
                            </Typography.Title>
                        </div>
                    </Header>
                    <Content className={styles.pageContent}>
                        <div
                            className={styles.contentContainer}
                            style={{
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