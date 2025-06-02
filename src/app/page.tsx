import { Layout } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import AppSider from '../components/AppSider';
import AppHeader from '../components/AppHeader';
import AppLayout from '@/components/AppLayout';
import AuthGuard from '../components/AuthGuard';

export default function Home() {
    return (
        <AuthGuard>
            {(currentUser) => (
                <Layout>
                    <AppHeader currentUser={currentUser} />
                    <Layout style={{ minHeight: '100vh' }}>
                        <AppSider userRole={currentUser?.role || 'user'} />
                        <AppLayout currentUser={currentUser} lastRequests={[]} />
                    </Layout>
                </Layout>
            )}
        </AuthGuard>
    );
}