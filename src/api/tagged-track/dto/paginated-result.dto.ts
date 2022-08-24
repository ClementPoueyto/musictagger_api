export class PaginatedResultDto {
    data: any[];
    meta: {
      total: number;
      page: number;
    };
  }