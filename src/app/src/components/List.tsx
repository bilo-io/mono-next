import React from "react";

type RenderItemProps<T> = {
    item: T;
    index: number;
};

interface ListProps<T> {
    items: T[];
    renderItem: (props: RenderItemProps<T>) => React.ReactNode;
    maxHeightClass?: string; // override for max-h-[85vh]
    className?: string;
}

export function List<T>({
    items,
    renderItem,
    maxHeightClass = "max-h-[85vh]",
    className = "",
}: ListProps<T>) {
    return (
        <ul className={`space-y-2 overflow-hidden overflow-y-auto ${maxHeightClass} ${className}`}>
            {items.map((item, index) => (
                <li
                    key={(item as any).id ?? index}
                    className="p-4 border rounded shadow flex flex-row items-center justify-between"
                >
                    {renderItem({ item, index })}
                </li>
            ))}
        </ul>
    );
}
