'use client';
import { ReactNode, useState } from 'react';
import { SideNav } from './SideNav';
import { TopNav } from './TopNav';

export const Layout = ({ title, children }: { title?: string, children: ReactNode }) => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Desktop */}
            <div className='hidden md:block'>
                <SideNav />
            </div>

            {/* Mobile */}
            {mobileNavOpen && (
                <div className="fixed inset-0 z-40 md:hidden bg-black bg-opacity-20" onClick={() => setMobileNavOpen(false)}>
                    <div
                        className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-zinc-900 bg-opacity-20 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <SideNav mobile toggleMobile={() => setMobileNavOpen(false)} />
                    </div>
                </div>
            )}

            {/* Content wrapper — flex-1 ensures it takes remaining space */}
            <div className="flex flex-col flex-1 min-w-0">
                <TopNav onMobileToggle={() => setMobileNavOpen(true)} title={title} />
                <main className="flex-1 overflow-y-auto p-4">{children}</main>
            </div>
        </div>
    );
};
