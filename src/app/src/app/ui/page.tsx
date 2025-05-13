'use client'
import { Layout } from '@/components/Navigation/Layout';
import { SkeletonList } from '@/components/ui/Skeleton/views/SkeletonList';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastProvider';

export default function UiPage() {
    const { showToast } = useToast();

    return (
        <Layout>
            <h1>Welcome to the Dashboard</h1>

            <h1>Toast</h1>
            <div className="space-x-2 p-4">
                <button onClick={() => showToast('Info message', 'info')} className="btn">Info</button>
                <button onClick={() => showToast('Success message!', 'success')} className="btn">Success</button>
                <button onClick={() => showToast('Something went wrong.', 'error')} className="btn">Error</button>
                <button onClick={() => showToast(<strong>Warning: Check input!</strong>, 'warning')} className="btn">Warning</button>
            </div>

            <h1>Loading indicators</h1>

            <h2>Skeleton</h2>

            <SkeletonList count={3} />

            <h2>Spinner</h2>
            <div className='flex flex-row'>
                <Spinner size={24} />
                <Spinner size={48} />
                <Spinner size={64} />
                <Spinner size={92} />
                <Spinner size={128} />
            </div>
        </Layout>
    );
}
