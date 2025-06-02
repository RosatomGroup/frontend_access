import {Layout} from 'antd';
import '@ant-design/v5-patch-for-react-19';
import AppSider from '../../components/AppSider';
import AppHeader from '../../components/AppHeader';
import AppLayout from '@/components/AppLayout';

export default function Home() {
    return (
        <Layout>
            <AppHeader/>
            <Layout style={{minHeight: '100vh'}}>
                <AppSider/>
                <AppLayout/>
            </Layout>
        </Layout>
    );
}

