export const extractUrlContent = (element: HTMLElement) => {
  const text = element.textContent;
  if (text) {
    return cleanUrlString(text);
  } else {
    return '';
  }
};

const cleanUrlString = (url: string) => {
  let cleanedUrl = url.replace(/https?:\/\/(www\.)?/, '').split(/[ ›]/)[0];
  const parts = cleanedUrl.split('.');
  const ccSLDs = ['co.uk', 'com.au', 'co.nz', 'co.za', 'com.sg'];
  const domainEndsInCcSLD = ccSLDs.some((ccSLD) => cleanedUrl.endsWith(ccSLD));

  if (domainEndsInCcSLD) {
    return parts.length > 3 ? parts.slice(-4).join('.') : parts.slice(-3).join('.');
  } else {
    return parts.length > 2 ? parts.join('.') : parts.slice(-2).join('.');
  }
};
