// components/Layout.tsx
'use client';
import { ReactNode, useState } from 'react';
import { SideNav } from './SideNav';
import { TopNav } from './TopNav';

export const Layout = ({ children }: { children: ReactNode }) => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className='flex flex-row w-full'>
            <SideNav />
            {mobileNavOpen && <SideNav mobile toggleMobile={() => setMobileNavOpen(false)} />}
            <div className="md:ml-64 transition-all w-full">
                <TopNav onMobileToggle={() => setMobileNavOpen(true)} />
                <main className="p-4 w-full">{children}</main>
            </div>
        </div>
    );
};
