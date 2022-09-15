export class PaginatedResultDto<T> {
    data: T[];
    meta: {
      total: number;
      page: number;
    };
  }