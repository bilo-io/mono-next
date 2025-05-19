import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
export async function paginate<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  page = 1,
  limit = 10,
): Promise<PaginatedResponse<T>> {
  const skip = (page - 1) * limit;

  const [data, total] = await query.skip(skip).take(limit).getManyAndCount();

  return {
    data,
    meta: {
      total,
      page,
      limit,
    },
  };
}
