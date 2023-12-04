export const filterUndefinedValues = (obj: any) =>
  Object.entries(obj).reduce((acc: any, [key, value]) => {
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {});

export const filterUndefinedValuesIgnoreZero = (obj: any) =>
  Object.entries(obj).reduce((acc: any, [key, value]) => {
    if (value || value === 0) {
      acc[key] = value;
    }
    return acc;
  }, {});
