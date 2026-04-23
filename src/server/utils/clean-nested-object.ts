export const cleanNestedObject = (obj: any) => {
  if (!obj || typeof obj !== 'object') return obj;
  return {
    id: obj._id ? obj._id.toString() : undefined,
    name: obj.name,
  };
};
