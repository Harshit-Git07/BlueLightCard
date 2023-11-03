
export const filterUndefinedValues = (obj: any) =>
  Object.entries(obj).reduce((acc:any, [key, value]) => {
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {});
