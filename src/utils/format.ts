export const filterWhere = (strs: Array<any>, sepator = ' and '): string => {
  const sql = strs.filter((str) => str).join(sepator);
  return sql ? `where ${sql}` : '';
};

export const createWhere = (exp1: () => any, exp2: string): string => {
  return exp1() ? exp2 : '';
};

export const createSet = (prop: any, fieldName: string): string => {
  return prop
    ? `${fieldName} = ${typeof prop === 'string' ? `'${prop}'` : prop}`
    : '';
};

export const filterSet = (fields: Array<string>, sepator = ',') => {
  return fields.filter((i) => i).join(sepator);
};

export const getValue = (target: any) => {
  return ![null, undefined, ''].includes(target)
    ? typeof target === 'string'
      ? `'${target}'`
      : target
    : null;
};
