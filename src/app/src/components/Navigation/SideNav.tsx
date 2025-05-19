'use client';
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { FiHome, FiUsers, FiMapPin, FiChevronRight, FiChevronLeft, FiShield } from 'react-icons/fi';
import clsx from 'clsx';
import { AiFillBank } from 'react-icons/ai';
import { FaShapes } from 'react-icons/fa';

const navItems = [
    {
        icon: <FiHome />,
        label: 'Home',
        href: '/dashboard'
    },
    {
        icon: <AiFillBank />,
        label: 'Tenants',
        href: '/tenants'
    },
    {
        icon: <FiMapPin />,
        label: 'Locations',
        href: '/locations'
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
        icon: <FaShapes />,
        label: 'Styleguide',
        href: '/ui'
    },
    // {
    //     icon: <FiSettings />,
    //     label: 'Settings',
    //     href: '/settings'
    // },
];

export const SideNav = ({ mobile, toggleMobile }: { mobile?: boolean; toggleMobile?: () => void }) => {
    const [expanded, setExpanded] = useState(true);
    const { theme } = useTheme();

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
                <span className="text-lg font-bold">
                    {
                        expanded
                            ? 'RBAC'
                            : ''
                    }
                </span>
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
