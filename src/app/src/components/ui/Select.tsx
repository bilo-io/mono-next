/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import ReactSelect, { ActionMeta, StylesConfig } from 'react-select';

export type DropdownValue = string | string[] | number | number[] | null;

interface DropdownProps {
    isMulti?: boolean;
    options: {
        value: string;
        label: string;
    }[];
    value: DropdownValue
    onChange: (newValue: DropdownValue, actionMeta: ActionMeta<string | number | null>) => void;
    style?: React.CSSProperties;
    label?: string;
    placeholder?: string;
    id?: string,
}

export const Select: React.FC<DropdownProps> = ({
    isMulti = false,
    options,
    value,
    onChange,
    label,
    placeholder = 'Select...',
    id,
    ...rest
}) => {
    const { theme } = useTheme();

    const customStyles: StylesConfig<object, boolean> = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: theme?.BACKGROUND,
            border: state.isFocused ? `1px solid ${theme?.PRIMARY}` : '1px solid #ccc',
            boxShadow: state.isFocused ? `0 0 0 1px ${theme.PRIMARY}` : 'none',
            color: theme?.TEXT,
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: theme?.BACKGROUND,
            border: `1px solid ${theme?.TEXT}88`,
            borderRadius: '4px',
            color: theme?.TEXT,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? theme?.SIDENAV_BG : state.isFocused ? theme?.PRIMARY : theme?.BACKGROUND,
            color: state.isSelected ? theme?.PRIMARY : theme?.TEXT,
            cursor: 'pointer',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#88888888',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: theme?.TEXT,
        }),
    };

    return (
        <div className="relative my-2">
            {label && <label
                onClick={(e) => e.stopPropagation()}
                className={`transition-all opacity-50 ${false ? 'top-0 text-xs' : 'top-5 text-xs'
                    }`}
            >
                {label}
            </label>}

            <ReactSelect
                id={id || label}
                // @ts-ignore
                options={options}
                value={value}
                isMulti={isMulti}
                closeMenuOnSelect={!isMulti}
                // @ts-ignore
                onChange={onChange}
                // @ts-ignore
                styles={customStyles}
                placeholder={placeholder}
                {...rest}
            />
        </div>
    );
};

export default Select;
