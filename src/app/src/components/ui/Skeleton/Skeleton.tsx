import React from 'react'
import { clsx } from 'clsx'

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={clsx('animate-pulse bg-zinc-300 dark:bg-zinc-600 rounded', className)} />
)
