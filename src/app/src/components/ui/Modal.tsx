'use client';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '@/context/ThemeContext';

interface ModalProps {
    onSubmit: () => void;
    onCancel: () => void;
    submitText?: string;
    cancelText?: string;
    children: React.ReactNode;
    title: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    onSubmit,
    onCancel,
    submitText = 'Submit',
    cancelText = 'Cancel',
    children,
    title,
}) => {
    const { theme, isDark } = useTheme();

    useEffect(() => {
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = original;
        };
    }, []);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    const modal = (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                width: '100vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backdropFilter: 'blur(6px)',
                backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.3)',
                zIndex: 9999,
                padding: '1rem',
            }}
            onClick={handleBackdropClick}
        >
            <div
                style={{
                    backgroundColor: theme.BACKGROUND,
                    color: theme.TEXT,
                    borderRadius: '12px',
                    padding: '2rem',
                    width: '100%',
                    maxWidth: '600px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                    position: 'relative',
                }}
            >
                {/* X Button */}
                <button
                    onClick={onCancel}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: theme.TEXT,
                        cursor: 'pointer',
                    }}
                    aria-label="Close modal"
                >
                    ×
                </button>

                {/* Title */}
                <div
                    style={{
                        marginBottom: '1.25rem',
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                        lineHeight: 1.2,
                    }}
                >
                    {title}
                </div>

                {/* Content */}
                <div style={{ marginBottom: '2rem' }}>{children}</div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            backgroundColor: 'transparent',
                            color: theme.PRIMARY,
                            border: `1px solid ${theme.PRIMARY}`,
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onSubmit}
                        style={{
                            backgroundColor: theme.PRIMARY,
                            color: '#fff',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}
                    >
                        {submitText}
                    </button>
                </div>
            </div>
        </div>
    );

    return typeof window === 'undefined' ? null : ReactDOM.createPortal(modal, document.body);
};
