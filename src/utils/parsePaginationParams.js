const parseNumber = (number, defaultValue) => {
  const parsed = parseInt(number, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
