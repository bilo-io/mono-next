'use client'

import Button from "./ui/Button";

interface PaginationProps {
    page: number;
    limit: number;
    total: number;
    onChange?: (page: number, limit: number) => void;
}

export interface PaginatedResponse<T,> {
    data: T[] | null;
    meta: {
        page: number;
        limit: number;
        total: number;
    }
}

export function Pagination({ page, limit, total, onChange }: PaginationProps) {
    const totalPages = Math.ceil(total / limit);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onChange?.(newPage, limit);
        }
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(e.target.value, 10);
        onChange?.(1, newLimit); // Reset to page 1 when limit changes
    };

    return (
        <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2 items-center">
                <Button
                    variant="outline" size='sm'
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="disabled:opacity-50"
                >
                    Prev
                </Button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <Button
                    variant="outline" size='sm'
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    className="disabled:opacity-50"
                >
                    Next
                </Button>
            </div>

            <div>
                <label className="mr-2 text-sm">Rows per page:</label>
                <select value={limit} onChange={handleLimitChange} className="border px-2 py-2 text-sm rounded-lg">
                    {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size} className="p-2">
                            {size}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
