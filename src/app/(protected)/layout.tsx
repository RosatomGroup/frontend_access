import 'antd/dist/reset.css';
import AuthGuard from '@/components/AuthGuard';

export default function ProtectedLayout({children}) {
    return (
        <AuthGuard>
            {children}
        </AuthGuard>
    );
}