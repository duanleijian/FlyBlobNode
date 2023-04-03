export const paging = (pageNum: number, pageSize: number) => {
  return {
    pageNum: (pageNum - 1) * pageSize,
    pageSize,
  };
};

export const filterParam = (param: any) => {
  const newParams = {};
  Object.keys(param).forEach((key) => {
    if (![undefined, null, ''].includes(param[key])) {
      newParams[key] = param[key];
    }
  });
  return newParams;
};
