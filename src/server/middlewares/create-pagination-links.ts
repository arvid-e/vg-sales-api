interface PaginationOptions {
  baseUrl: string;
  page: number;
  limit: number;
  totalPages: number;
  hasUser: boolean;
}

/**
 * Creates pagination links for get-all endpoints.
 */
export const createPaginationLinks = (options: PaginationOptions) => {
  const { baseUrl, page, limit, totalPages, hasUser } = options;

  const links: any[] = [
    { rel: 'self', href: `${baseUrl}?page=${page}&limit=${limit}` },
    { rel: 'first', href: `${baseUrl}?page=1&limit=${limit}` },
    { rel: 'last', href: `${baseUrl}?page=${totalPages}&limit=${limit}` },
  ];

  if (page < totalPages) {
    links.push({
      rel: 'next',
      href: `${baseUrl}?page=${page + 1}&limit=${limit}`,
    });
  }

  if (page > 1) {
    links.push({
      rel: 'prev',
      href: `${baseUrl}?page=${page - 1}&limit=${limit}`,
    });
  }

  if (hasUser) {
    links.push({ rel: 'create', method: 'POST', href: baseUrl });
  }

  return links;
};
