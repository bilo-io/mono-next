'use client'
import React from 'react'
import { Skeleton } from '../Skeleton'

export const SkeletonListItem = () => {
    return (
        <div className="flex flex-row">
            <Skeleton className="w-16 h-20 m-1" />
            <div className="flex flex-col flex-1">
                <Skeleton className="w-full h-6 m-1" />
                <Skeleton className="w-full h-12 m-1" />
            </div>
        </div>
    )
}

interface SkeletonListProps {
    count?: number
}

export const SkeletonList = ({ count = 5 }: SkeletonListProps) => {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }, (_, index) => (
                <SkeletonListItem key={index} />
            ))}
        </div>
    )
}
