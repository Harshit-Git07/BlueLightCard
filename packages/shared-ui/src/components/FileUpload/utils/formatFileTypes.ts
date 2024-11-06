export const formatFileTypes = (fileTypes: Array<string>) => {
  const suffixes = fileTypes
    .map((fileType) => fileType.split('/')[1]?.toUpperCase())
    .filter(Boolean)
    .map((fileType) => `.${fileType}`);

  const lastElement = suffixes.pop();
  const commaSeparated = suffixes.join(', ');

  return commaSeparated ? `${commaSeparated} or ${lastElement}` : lastElement;
};
