'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Location } from '@/app/locations/page';

interface TenantOption {
    id: number;
    name: string;
}

interface AddLocationModalProps {
    buttonText: string;
    onSubmit: (location: Location) => void;
    tenants: TenantOption[];
}

export const AddLocationModal: React.FC<AddLocationModalProps> = ({
    buttonText,
    onSubmit,
    tenants,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');
    const [tenantId, setTenantId] = useState<number | ''>('');

    const handleSubmit = () => {
        if (!tenantId) return;
        onSubmit({
            name,
            address,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            tenant: null,
        });
        setIsOpen(false);
        setName('');
        setAddress('');
        setLat('');
        setLon('');
        setTenantId('');
    };

    const handleCancel = () => {
        setIsOpen(false);
        setName('');
        setAddress('');
        setLat('');
        setLon('');
        setTenantId('');
    };

    return (
        <>
            <Button variant="primary" onClick={() => setIsOpen(true)} size='sm'>
                {buttonText}
            </Button>

            {isOpen && (
                <Modal
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    submitText="Create"
                    cancelText="Cancel"
                    title="Add Location"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label>
                            Location Name:
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc',
                                }}
                            />
                        </label>

                        <label>
                            Address:
                            <input
                                type="text"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc',
                                }}
                            />
                        </label>

                        <label>
                            Latitude:
                            <input
                                type="number"
                                value={lat}
                                onChange={e => setLat(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc',
                                }}
                            />
                        </label>

                        <label>
                            Longitude:
                            <input
                                type="number"
                                value={lon}
                                onChange={e => setLon(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc',
                                }}
                            />
                        </label>

                        <label>
                            Tenant:
                            <select
                                value={tenantId}
                                onChange={e => setTenantId(Number(e.target.value))}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc',
                                }}
                            >
                                <option value="">Select a tenant</option>
                                {tenants.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </Modal>
            )}
        </>
    );
};
