const lightFont = chrome.runtime.getURL("MuseoSansRounded100.otf");
const mediumFont = chrome.runtime.getURL("MuseoSansRounded300.otf");
const boldFont = chrome.runtime.getURL("MuseoSansRounded700.otf");

export const customFontFaceLight = `
@font-face {
  font-family: 'MuseoSansRounded';
  src: url('${lightFont}') format('opentype');
  font-weight: normal;
  font-style: normal;
}
`;

export const customFontFaceMedium = `
@font-face {
  font-family: 'MediumMuseoSansRounded';
  src: url('${mediumFont}') format('opentype');
  font-weight: normal;
  font-style: normal;
}
`;

export const customFontFaceBold = `
@font-face {
  font-family: 'BoldMuseoSansRounded';
  src: url('${boldFont}') format('opentype');
  font-weight: normal;
  font-style: normal;
}
`;

export const discountBannerContainer = `
display: flex!important;
flex-direction: column!important;
position: fixed!important;
top: 0!important;
right: 15px!important;
width: 375px!important;
height: 440px!important;
color: black!important;
z-index: 9999!important;
background: white!important;
border-radius: 16px!important;
box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.35)!important;
padding-bottom: 16px!important;
`;

export const injectedStyles = `
  ${customFontFaceLight}
  ${customFontFaceMedium}
  ${customFontFaceBold}

  #notification-banner .discountHeaderContainer {
    position: relative!important;
    display: flex!important;
    flex-direction: column!important;
    width: 375px!important;
    height: 72px!important;
    justify-content: flex-start!important;
    align-items: center!important;
  }

  #notification-banner .headerContainer {
    display: flex!important;
    width: 100%!important;
    height: 72px!important;
    padding: 16px!important;
    justify-content: center!important;
    align-items: center!important;
    gap: 33px!important;
  }

  #notification-banner .emptyBox {
    width: 24px;
    height: 24px;
  }

  #notification-banner .headerImg {
    height: 40px;
  }

  #notification-banner .discountBody {
    display: flex!important;
    flex-direction: column!important;
    align-items: center!important;
    gap: 24px!important;
  }

  #notification-banner .bodyContainer {
    display: flex!important;
    flex-direction: column!important;
    align-items: center!important;
    gap: 12px!important;
    width: 295px!important;
  }

  #notification-banner .titleGrey {
    color: #989a9c!important;
    font-family: 'MuseoSansRounded'!important;
    text-align: center!important;
    font-size: 16px!important;
    font-style: normal!important;
    font-weight: 600!important;
    line-height: 24px!important;
    letter-spacing: 0.16px!important;
  }

  #notification-banner .textLargeNotification {
    color: #1c1c1c!important;
    text-align: center!important;
    font-family: 'BoldMuseoSansRounded'!important;
    font-size: 32px!important;
    font-style: bold!important;
    font-weight: 900!important;
    letter-spacing: -0.32px!important;
    line-height: 102%!important;
    margin: 0!important;
  }

  #notification-banner .primaryButtonNotification {
    text-decoration: none;
    font-family: 'MediumMuseoSansRounded'!important;
    color: #fff!important;
    display: flex!important;
    width: 343px!important;
    height: 48px!important;
    justify-content: center!important;
    align-items: center!important;
    border-radius: 8px!important;
    background: #009!important;
    font-size: 16px!important;
    outline: none!important;
    border: none!important;
    cursor: pointer!important;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15)!important;
    text-align: center!important;
  }

  #notification-banner .closeBtnStyle {
    width: 24px!important;
    height: 24px!important;
    cursor: pointer!important;
    }
    
    #notification-banner .titleSucces {
    color: #36966F!important;
    font-family: 'MediumMuseoSansRounded'!important;
    text-align: center!important;
    font-size: 16px!important;
    font-style: normal!important;
    font-weight: 600!important;
    line-height: 24px!important;
    letter-spacing: 0.16px!important;
    }

    .text-center{
      color: var(--OnSurface, #1C1C1C)!important;
      text-align: center!important;
      font-size: 32px!important;
      font-family: 'BoldMuseoSansRounded'!important;
      font-style: normal!important;
      font-weight: 600!important;
      line-height: 102%!important; /* 32.64px */
      letter-spacing: -0.32px!important;
      text-align: center!important;
    }

    .circle-logo {
      border-radius: 50%!important;
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15)!important;
    }
`;
