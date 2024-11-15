export const getAriaDescribedBy = (
  componentId: string,
  tooltip: string | undefined,
  description: string | undefined,
  placeholder: string | undefined,
  validationMessage: string | undefined,
) => {
  const toolTipId = tooltip && `${componentId}-tooltip`;
  const descriptionId = description && `${componentId}-description`;
  const validationMessageId = validationMessage && `${componentId}-validation-message`;
  const placeholderId = placeholder && `${componentId}-placeholder`;

  const elementIds = [toolTipId, descriptionId, placeholderId, validationMessageId];

  return elementIds.filter(Boolean).join(' ');
};
