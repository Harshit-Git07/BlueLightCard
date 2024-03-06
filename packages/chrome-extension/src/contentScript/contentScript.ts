import {
  injectDiscountReceivedNotification,
  injectGoogleSearchResultNotification,
  injectNotification,
} from '../utils/uiHelpers';
import { createUrlWithGA4CampaignQueryParams } from '../utils/googleAnalytics';
import { extractUrlContent } from '../utils/helpers';

let urls: string[] = [];
const elementsMap = new Map<string, Set<Element>>();

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    let target = mutation.target as HTMLElement;
    const searchResults = target.querySelectorAll('.MjjYud');
    const sponsors = target.querySelectorAll('.qGXjvb');
    const combinedResults = [...searchResults, ...sponsors];
    if (combinedResults.length > 0 || sponsors.length > 0) {
      combinedResults.forEach((node) => {
        let urlElement: HTMLElement | null = node.querySelector('cite');
        if (!urlElement) {
          urlElement = node.querySelector('.x2VHCd');
        }
        if (urlElement) {
          const url = extractUrlContent(urlElement);
          if (url) {
            urls.push(url);
            if (!elementsMap.has(url)) {
              elementsMap.set(url, new Set());
            }
            elementsMap.get(url)?.add(node);
          }
        }
      });
    }
  });
  googleResultScanner();
});

if (window.location.href.includes('google')) {
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

const alreadyInsertedNodesMap: Map<string, Set<Element>> = new Map<string, Set<Element>>();
const googleResultScanner = () => {
  chrome.runtime.sendMessage({ message: 'scanUrls', urls: urls }, function (response) {
    elementsMap.forEach((nodes, url) => {
      response.matchedUrls.map((item: { url: string; idx: number }) => {
        if (item.url === url) {
          if (!alreadyInsertedNodesMap.has(url)) {
            alreadyInsertedNodesMap.set(url, new Set());
          }
          nodes.forEach((node) => {
            if (!alreadyInsertedNodesMap.get(url)?.has(node)) {
              injectGoogleSearchResultNotification(node);
              alreadyInsertedNodesMap.get(url)?.add(node);
            }
          });
        }
      });
    });
  });
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.isDiscountReceived) {
    injectDiscountReceivedNotification(request.id);
  } else if (request.id) {
    injectNotification(request.id, createUrlWithGA4CampaignQueryParams(request.id, request.name));
  }
});
