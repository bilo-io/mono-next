'use client';
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { FiHome, FiUsers, FiChevronRight, FiChevronLeft, FiShield } from 'react-icons/fi';
import clsx from 'clsx';
import { FaUserShield } from 'react-icons/fa6';
import { IoShapes } from 'react-icons/io5';

const navItems = [
    {
        icon: <FiHome />,
        label: 'Home',
        href: '/'
    },
    {
        icon: <FiUsers />,
        label: 'Users',
        href: '/users'
    },
    {
        icon: <FiShield />,
        label: 'Security',
        href: '/security'
    },
    {
        icon: <IoShapes />,
        label: 'Styleguide',
        href: '/ui'
    },
];

export const SideNav = ({ mobile, toggleMobile }: { mobile?: boolean; toggleMobile?: () => void }) => {
    const [expanded, setExpanded] = useState(true);
    const { theme } = useTheme();

    const SideNavTitle = (
        <div className='flex flex-row items-center'>
            <FaUserShield color={theme.PRIMARY} size={24} />
            {(
                expanded
                    ? <span
                        className="text-lg mx-2"
                        style={{ color: theme.PRIMARY }}>
                        RBAC
                    </span>
                    : null
            )}
        </div>
    )

    return (
        <aside
            className={clsx(
                'top-0 left-0 h-full z-40 transition-all duration-300',
                mobile ? 'w-64' : expanded ? 'w-64' : 'w-12',
                'overflow-hidden'
            )}
            style={{ backgroundColor: theme.SIDENAV_BG, color: theme.SIDENAV_TEXT }}
        >
            <div className="flex items-center justify-between px-4 py-3">
                {SideNavTitle}
                
                {mobile && toggleMobile && (
                    <button onClick={toggleMobile}>
                        ✖
                    </button>
                )}
            </div>
            <nav className="flex flex-col gap-2 mt-4">
                {navItems.map((item) => (
                    
                    <a key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200">
                        {item.icon}
                        {(!mobile && expanded) || mobile ? <span>{item.label}</span> : null}
                    </a>
                ))}

                <hr className='my-2 opacity-10' />

                <button
                    onClick={() => setExpanded(!expanded)}
                    className='hidden md:flex items-center  ml-4 mb-2'
                >
                    <span className='mr-3'>{expanded ? <FiChevronLeft /> : <FiChevronRight />}</span>
                    {expanded ? <span>Collapse</span> : null}
                </button>
            </nav>
        </aside>
    );
};
