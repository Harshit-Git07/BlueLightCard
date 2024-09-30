import { NotificationType } from 'src/types/notificationType';
import { injectedStyles, discountBannerContainer } from './const';
const iconLogo = chrome.runtime.getURL('icon.png');

export function injectGoogleSearchResultNotification(parent: Element) {
  const message = `<div style='display: flex; align-items: center; gap: 12px;'>
    <img src=${iconLogo} style='border-radius: 50%; width: 24px; height: 24px'/>
    <h4 style="font-size:16px!important; margin-block-start: 10px; margin-block-end: 10px;">Blue Light Card offers available</h4>
    </div>`;
  parent.insertAdjacentHTML('afterbegin', message);
}

export function injectDiscountReceivedNotification(id: string, type: NotificationType) {
  // Prevent duplicate notifications
  if (document.getElementById('notification-banner')) {
    return; // Early return if the notification already exists
  }

  const successMessage =
    type === 'CODE'
      ? {
          title: 'Offer Code Copied',
          message: 'Complete your purchase by pasting the code during checkout',
        }
      : {
          title: '',
          message: 'Special pricing now applied to selected products',
        };

  const popupModalHeight = type === 'CODE' ? '440px' : '385px';
  const imageLogo = chrome.runtime.getURL('BLC_Logo.png');
  const closeIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <mask id="mask0_714_15" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <rect width="24" height="24" fill="#D9D9D9"/>
      </mask>
      <g mask="url(#mask0_714_15)">
        <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="#1C1C1C"/>
      </g>
    </svg>
  `;

  const checkIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="132" height="132" viewBox="0 0 132 132" fill="none">
      <g filter="url(#filter0_d_467_958)">
        <rect x="10" y="6" width="112" height="112" rx="56" fill="#36966F"/>
        <mask id="mask0_467_958" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="18" y="14" width="97" height="96">
          <rect x="18.5" y="14" width="96" height="96" fill="#D9D9D9"/>
        </mask>
        <g mask="url(#mask0_467_958)">
          <path d="M56.7 86L33.9 63.2L39.6 57.5L56.7 74.6L93.4 37.9L99.1 43.6L56.7 86Z" fill="white"/>
        </g>
      </g>
      <defs>
        <filter id="filter0_d_467_958" x="0" y="0" width="132" height="132" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="4"/>
          <feGaussianBlur stdDeviation="5"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_467_958"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_467_958" result="shape"/>
        </filter>
      </defs>
    </svg>
  `;

  const notificationHtml = `
    <style>
      ${injectedStyles}
    </style>
    <div style="${discountBannerContainer(popupModalHeight)}" id="notification-banner">
    <div class="discountHeaderContainer">
      <div class="headerContainer">
        <div class="emptyBox"></div>
        <img src="${imageLogo}" alt="circle logo" />
        <div class="closeBtnStyle" id="notificationCloseBtn">
          ${closeIcon}
        </div>
      </div>
    </div>
    <div class="discountBody">
      <div class="bodyContainer">
        <p class="titleSucces">${successMessage.title}</p>
        ${checkIcon}
        <p class="textLarge text-center messageSuccess">
          ${successMessage.message}
        </p>
      </div>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML('beforeend', notificationHtml);

  const closeButton = document.getElementById('notificationCloseBtn');
  const notificationDiv = document.getElementById('notification-banner');

  setTimeout(() => {
    if (closeButton && notificationDiv) {
      closeButton.addEventListener('click', () => {
        notificationDiv.style.display = 'none';
        chrome.runtime.sendMessage({ message: 'offerReceivedViewed', id: id });
      });
    }
  }, 0);
}

export function injectNotification(id: string, offerDetailsUrl: string) {
  // Prevent duplicate notifications
  if (document.getElementById('notification-banner')) {
    return; // Early return if the notification already exists
  }

  const imageLogo = chrome.runtime.getURL('BLC_Logo.png');
  const closeIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#D9D9D9">
      <mask id="mask0_714_15" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <rect width="24" height="24" fill="#D9D9D9"/>
      </mask>
      <g mask="url(#mask0_714_15)">
        <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="#1C1C1C"/>
      </g>
    </svg>
  `;

  const notificationHtml = `
    <style>
      ${injectedStyles}
    </style>
    <div style="${discountBannerContainer()}" id="notification-banner">
      <div class="discountHeaderContainer">
        <div class="headerContainer">
          <div class="emptyBox"></div>
          <img src="${imageLogo}" alt="circle logo" />
          <div class="closeBtnStyle" id="notificationCloseBtn">
            ${closeIcon}
          </div>
        </div>
      </div>
      <div class="discountBody">
        <div class="bodyContainer">
          <p class="titleGrey">Savings detected!</p>
          <img class="circle-logo" src="${iconLogo}" alt="circle logo" />
          <p class="textLargeNotification">
            You can get a discount on this website
          </p>
        </div>
        <a href="${offerDetailsUrl}" target="_blank" class="primaryButtonNotification">
          Discover offers
        </a>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', notificationHtml);

  const closeButton = document.getElementById('notificationCloseBtn');
  const notificationDiv = document.getElementById('notification-banner');

  setTimeout(() => {
    if (closeButton && notificationDiv) {
      closeButton.addEventListener('click', () => {
        notificationDiv.style.display = 'none';
        chrome.runtime.sendMessage({ message: 'notificationViewed', id: id });
      });
    }
  }, 0);
}
