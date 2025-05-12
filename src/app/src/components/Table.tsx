'use client';

import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

import { AgGridReact } from 'ag-grid-react';
import type { AgGridReactProps } from 'ag-grid-react';
import { useCallback, useRef } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact as AgGridReactType } from 'ag-grid-react';
import { DomLayoutType, GridReadyEvent } from 'ag-grid-community';



interface TableProps<TData = unknown> extends AgGridReactProps<TData> {
    height?: string;
    className?: string;
    domLayout?: DomLayoutType;
}

export const Table = <TData,>({
    className = '',
    height = '500px',
    domLayout,
    ...gridProps
}: TableProps<TData>) => {
    const gridRef = useRef<AgGridReactType<TData>>(null);

    const onGridReady = useCallback((params: GridReadyEvent) => {
        if (domLayout !== 'autoHeight') {
            params.api.sizeColumnsToFit();
        }
        gridProps.onGridReady?.(params); // call user's handler if provided
    }, [gridProps, domLayout]);

    const defaultColDef: ColDef = {
        flex: 1,
    };

    return (
        <div
            className={`ag-theme-alpine ${className}`}
            style={{
                height: domLayout === 'autoHeight' ? undefined : height,
                width: '100%',
            }}
        >
            <AgGridReact<TData>
                ref={gridRef}
                domLayout={domLayout}
                onGridReady={onGridReady}
                defaultColDef={defaultColDef}
                {...gridProps}
            />
        </div>
    );
};
