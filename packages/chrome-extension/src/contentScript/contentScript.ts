import {
  //injectGoogleSearchResultNotification,
  injectDiscountReceivedNotification,
  injectNotification,
} from '../utils/helpers';
import { createUrlWithGA4CampaignQueryParams } from '../utils/googleAnalytics';

const cleanUrlString = (url: string) => {
  let cleanedUrl = url.replace(/https?:\/\/(www\.)?/, '').split(/[ ›]/)[0];

  const parts = cleanedUrl.split('.');

  const ccSLDs = ['co.uk', 'com.au', 'co.nz', 'co.za', 'com.sg'];

  const domainEndsInCcSLD = ccSLDs.some((ccSLD) => cleanedUrl.endsWith(ccSLD));

  if (domainEndsInCcSLD) {
    return parts.slice(-3).join('.');
  } else {
    return parts.slice(-2).join('.');
  }
};

let urls: string[] = [];
let allElements: Element[] = [];

const adParentElements = document.querySelectorAll('.qGXjvb');

adParentElements.forEach((parent) => {
  allElements.push(parent);
  const citeElements = parent.querySelectorAll('.x2VHCd');
  citeElements.forEach((element) => {
    //@ts-ignore
    const url = element.dataset.dtld;
    if (url) {
      urls.push(url);
    }
  });
});

const parentElements = document.querySelectorAll('.MjjYud');

parentElements.forEach((parent) => {
  allElements.push(parent);
  const citeElements = parent.querySelectorAll('cite');
  citeElements.forEach((cite) => {
    const url = cite.textContent;
    if (url) {
      const cleanedDomain = cleanUrlString(url);
      urls.push(cleanedDomain);
    }
  });
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.isDiscountReceived) {
    injectDiscountReceivedNotification(request.id);
  } else if (request.id) {
    injectNotification(request.id, createUrlWithGA4CampaignQueryParams(request.id, request.name));
  }
});
