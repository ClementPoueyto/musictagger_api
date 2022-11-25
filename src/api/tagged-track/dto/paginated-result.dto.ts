export class PaginatedResultDto<T> {
  data: T[];
  metadata?: {
    total: number;
    page: number;
    limit: number;
  };
}
