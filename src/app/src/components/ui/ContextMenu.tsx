import { useTheme } from '@/context/ThemeContext';
import { useHover } from '@/hooks/useHover';
import React, { useRef, useState, useEffect } from 'react';
import { FaEllipsisVertical } from 'react-icons/fa6';

interface ContextMenuItem {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
}

interface ContextMenuProps {
    items: ContextMenuItem[];
}

interface MenuItemProps {
    item: ContextMenuItem;
    onClick: (fn: () => void) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
    item,
    onClick,
}) => {
    const { isHovered, onHoverStart, onHoverEnd } = useHover();
    const { theme } = useTheme();

    return (
        <div
            onClick={() => onClick(item.onClick)}
            className="flex items-center justify-between gap-2 px-4 py-2 cursor-pointer"
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            style={{
                backgroundColor: isHovered ? `${theme?.PRIMARY}33` : '',
            }}
        >
            <span>{item.label}</span>
            {item.icon && <span className="w-4 h-4">{item.icon}</span>}
        </div>
    );
};

export const ContextMenu: React.FC<ContextMenuProps> = ({ items }) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const { theme } = useTheme();

    // Position menu after opening
    useEffect(() => {
        if (open && buttonRef.current && menuRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const menu = menuRef.current;
            const menuHeight = menu.offsetHeight;
            const menuWidth = menu.offsetWidth;

            let top = buttonRect.bottom;
            let left = buttonRect.left;

            // Check vertical bounds
            if (top + menuHeight > window.innerHeight) {
                top = window.innerHeight - menuHeight - 8;
            }

            // Check horizontal bounds
            if (left + menuWidth > window.innerWidth) {
                left = window.innerWidth - menuWidth - 8;
            }

            setMenuPosition({ top, left });
        }
    }, [open]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current?.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => setOpen(prev => !prev);

    const handleItemClick = (onClick: () => void): void => {
        onClick();
        setOpen(false);
    };

    return (
        <div className="relative inline-block">
            <button
                ref={buttonRef}
                onClick={handleToggle}
                className="text-gray-500 hover:text-black focus:outline-none"
                aria-label="Open context menu"
            >
                <FaEllipsisVertical />
            </button>

            {open && (
                <div
                    ref={menuRef}
                    className="absolute z-50 shadow-md rounded border w-40"
                    style={{
                        top: menuPosition.top,
                        left: menuPosition.left,
                        position: 'fixed',
                        backgroundColor: theme.BACKGROUND,
                        borderColor: theme.TEXT,
                        color: theme.TEXT
                    }}
                >
                    {items.map((item, index) => (
                        <MenuItem item={item} key={index} onClick={handleItemClick} />
                    ))}
                </div>
            )}
        </div>
    );
};
