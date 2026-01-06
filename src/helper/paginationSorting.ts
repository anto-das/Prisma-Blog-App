type IOptions = {
  page?: number | string;
  limit?: number | string;
  sortBy?: string | string;
  sortOrder?: string | string;
};

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

function paginationSorting(options: IOptions): IOptionsResult {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip = Number(page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
      page,
      limit,
      skip,
      sortBy,
      sortOrder
  }
}

export default paginationSorting;
