const parseBoolean = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const filter = {};

  if (type) filter.contactType = type;
  if (isFavourite !== undefined) {
    const parsedFavourite = parseBoolean(isFavourite);
    if (parsedFavourite !== undefined) {
      filter.isFavourite = parsedFavourite;
    }
  }

  return filter;
};
