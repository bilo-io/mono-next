export interface PaginatedResponse<T,> {
    data: T[] | null,
    meta: {
        total: number,
        page: number,
        limit: number
    }
}
