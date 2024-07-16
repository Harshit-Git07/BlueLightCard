# Changelog

## [1.8.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/shared-ui-v1.7.0...shared-ui-v1.8.0) (2024-07-16)


### Features

* added tokens to button component ([#1772](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1772)) ([dca0992](https://github.com/bluelightcard/BlueLightCard-2.0/commit/dca09921f1c05d7783fe3e20aba09c949cc403f6))
* added typography to Badge component ([#1762](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1762)) ([fb984a1](https://github.com/bluelightcard/BlueLightCard-2.0/commit/fb984a1d9de4cd7a3162bc30a7afee1d8893911e))
* added typography to Pill component ([#1766](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1766)) ([44aa4ba](https://github.com/bluelightcard/BlueLightCard-2.0/commit/44aa4bacae373a38170e33f9f66fe8fc2bebe222))
* built and tokenise Offer card carousel ([#1706](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1706)) ([81e9b58](https://github.com/bluelightcard/BlueLightCard-2.0/commit/81e9b58726498886d6f06e590ec9574c8f53c1aa))


### Bug Fixes

* converted companyId and offerId sent to amplitude for offersheets share cta and terms cta to string to remove the decimal part ([#1767](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1767)) ([263dc79](https://github.com/bluelightcard/BlueLightCard-2.0/commit/263dc79972877b9facce0fc55dfbb8435b874325))
* ensure code is visible in dark mode ([#1765](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1765)) ([421c9e4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/421c9e4b478177347dabe64cd59c196b32c6494a))

## [1.7.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/shared-ui-v1.6.0...shared-ui-v1.7.0) (2024-07-10)

### Features

- added typography tokens to banner component ([#1735](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1735)) ([0512959](https://github.com/bluelightcard/BlueLightCard-2.0/commit/0512959cf190bf330b4e5517b08be5d298e483ab))
- applied tokens on the responsive offer card component ([#1666](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1666)) ([951af13](https://github.com/bluelightcard/BlueLightCard-2.0/commit/951af13ed47f57907411fb3a49c4ac41e57553f3))

### Bug Fixes

- ensure redeem data for preApplied is pre-fetched ([#1748](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1748)) ([9b8b6e4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/9b8b6e45153dddf3ca694bbd24a966ed1de7d0d4))
- generic event on CTA click for mobile app ([#1749](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1749)) ([181328f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/181328fda1241450670b4bae713d2499495b794c))
- Removed title and description from navigator.share, fixes copy on mobi ([#1712](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1712)) ([5521f26](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5521f268403d666ab3ac4a28ba4e5b4d03c3ef49))
- To 897 change the redemption flows magic button click ([#1714](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1714)) ([1ab7a70](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1ab7a70b32cf4b8daffa1cca9f96e231dc30cc55))
- TO-779 sets the ShareButton to be borderless ([#1717](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1717)) ([f50cce6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f50cce6ffbe726e5277932428afd200e538190a8))
- vault event on CTA click for mobile app ([#1752](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1752)) ([8fc35cd](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8fc35cde2b7f859f842d2dd1f69859056020abf0))

### Other Changes

- consolidate non vault flags ([#1727](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1727)) ([ff8e131](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ff8e1310c584bfb5ee936c33b208628672718425))
- updated tokens ([#1731](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1731)) ([a30440d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a30440db02f072639e802016ae99cca547db7844))

## [1.6.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/shared-ui-v1.5.1...shared-ui-v1.6.0) (2024-07-02)

### Features

- TO-871 vaultqr codes in offer sheet ([#1664](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1664)) ([b842a5a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/b842a5affad8286892b6a4282c722a5994da0471))

### Bug Fixes

- Fix/to 782 share link modifications for app 2 ([#1679](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1679)) ([03dd055](https://github.com/bluelightcard/BlueLightCard-2.0/commit/03dd0557f5b387f48745cfc7b2e52c67f9fdde24))
- For deep link for the 'share' CTA on the offer sheet ([03dd055](https://github.com/bluelightcard/BlueLightCard-2.0/commit/03dd0557f5b387f48745cfc7b2e52c67f9fdde24))
- vault codes were not being copied ([#1697](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1697)) ([2741ddb](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2741ddbed18cfd9f205f53dba5eb83e517153734))

## [1.5.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/shared-ui-v1.5.0...shared-ui-v1.5.1) (2024-07-01)

### Bug Fixes

- fix bug with already converted font size ([#1683](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1683)) ([1b424f1](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1b424f136a3f0af3f148e65322d3c98e7a0655f7))
- Updated readme to trigger web/shared chore ([#1687](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1687)) ([8dd4f15](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8dd4f1591f77a96ed2d095a7d9eacd99cdfda388))

## [1.5.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/shared-ui-v1.4.0...shared-ui-v1.5.0) (2024-07-01)

### Features

- adds feature flags check for preApplied, showCard and vaultQR ([#1629](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1629)) ([557bc22](https://github.com/bluelightcard/BlueLightCard-2.0/commit/557bc22c18b033847c6b302bca3214cd0762db9c))
- implements OfferSheet flow for showCard with single button click and button copy ([#1662](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1662)) ([dd895f0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/dd895f0c959dd62def5602063f26bcfd726ddba5))
- TO-776 Create Amplitude events for Shared-UI ([#1591](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1591)) ([9bef4ee](https://github.com/bluelightcard/BlueLightCard-2.0/commit/9bef4eefad788dce51dc13eb56e84258792e626c))
- TO-869 implement offer sheet for pre applied discount offers ([#1631](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1631)) ([fc4fa6a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/fc4fa6aef2a918cca8d346af2c3bf5e7d1fe3c80))

### Bug Fixes

- added forward slash to base url for ShareButton component ([63db07c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/63db07ccfa7acd3444866ce4ab5b8ca082654fd1))
- ensure preApplied offer on mobile sends correct event ([#1670](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1670)) ([451d702](https://github.com/bluelightcard/BlueLightCard-2.0/commit/451d70259caa3e43286fa2d97db40855a371eaf0))
- Fix/added local port to share btn deep link ([#1653](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1653)) ([a222a17](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a222a173675de785eb09682e9586299537e7fc36))
- TO-779 sets blue outline as important to fix yellow color on android ([#1669](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1669)) ([699f672](https://github.com/bluelightcard/BlueLightCard-2.0/commit/699f672adc73c42e8f2c6f0c93e77bbc2ac36946))
- TO-869 small changes to correct implementation ([#1657](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1657)) ([b1d7a52](https://github.com/bluelightcard/BlueLightCard-2.0/commit/b1d7a529a2a823d24057892fb14c17ab1c379efe))
- TO-887 max per user reached error ([#1637](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1637)) ([2eb46a9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2eb46a9e72aa1fc7056037297c4ec16fadfa957f))
- TO-887 max per user reached error app button text ([#1641](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1641)) ([f3d5e1c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f3d5e1c63dd5c35ba0582da4e755449b94d4592a))
- TO-901 Copy changes for non-vault redemption flows ([#1680](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1680)) ([333c333](https://github.com/bluelightcard/BlueLightCard-2.0/commit/333c333cd284d24a430f2e206474421d57a52157))

### Other Changes

- cleans unnecessary comment from code ([#1668](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1668)) ([5b84f81](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5b84f81b1898ac7359d8fdd965453219474421f4))
- disco 291 spike use typography tokens in tailwind ([#1649](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1649)) ([5b28bcf](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5b28bcf3dc9e0d43b21c81d6d6d8cdecba362080))
- globalisation changes ([#1676](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1676)) ([7280e33](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7280e332335d7575ed3c3b9f125ba05d96172de3))

## [1.4.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/shared-ui-v1.3.0...shared-ui-v1.4.0) (2024-06-19)

### Features

- [DISCO-312] Try out change identifier to limit stack deploys ([#1428](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1428)) ([55a845c](https://github.com/bluelightcard/BlueLightCard-2.0/commit/55a845c8499988a8fcf3c7cf340dd6b984173e92))
- add mobile one tap for redemption ([a3eb5ce](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a3eb5ce04bd704c56f5140100823e3cde9cbb6f8))
- add mobile one tap for redemption ([a3eb5ce](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a3eb5ce04bd704c56f5140100823e3cde9cbb6f8))
- added new card hybrid styles to Card on mobile hybrid ([#1558](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1558)) ([f47d153](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f47d1535069ef14d4f85880f18ba4a57707843d9))
- added preset to mobile-hybird with new tokens ([#1394](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1394)) ([5d3d3f3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/5d3d3f3cd5d4ebdef8d19299220ad4c43917704e))
- adds offer-sheet-redeem-generic-web flag for generic offers to run new OfferSheet flow ([#1560](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1560)) ([898360b](https://github.com/bluelightcard/BlueLightCard-2.0/commit/898360b7ec906bb8a2611c851a8451bd547f4356))
- Mobile Hybrid Company Page ([#1368](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1368)) ([d83cec0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d83cec0486b403cecfacfdd9ffe8c72d2961bf29))
- resolve build issue and added new tokens ([#1434](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1434)) ([d893d38](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d893d38fc7c28117b36f777ef643f8de4ee85f5b))
- TO-859 show copy code text for generic offers ([#1598](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1598)) ([d7ba7e4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d7ba7e4de5a70c88a1b71185aab296bcacd53c3b))
- TR-605 add one click back to mobile ([8b9c15e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8b9c15ebc0777dfc114d5207b1764426e965196d))
- TR-605 add one click back to mobile ([#1464](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1464)) ([8b9c15e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8b9c15ebc0777dfc114d5207b1764426e965196d))
- Trigger build ([#1444](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1444)) ([e4bdbf2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e4bdbf202bd0994cb0730e3d53e17e812b6e5f75))

### Bug Fixes

- add error state back for 500s ([#1461](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1461)) ([8b030e3](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8b030e3edb91a59684a585110eb30f05f95246ed))
- adds double button journey on web platform in OfferSheet ([#1618](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1618)) ([62365b9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/62365b92c01cd2a329540d798d7c70d5ca3e1c27))
- bump version control ([#1500](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1500)) ([4973fda](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4973fda1d9f322c5082d7444dc86617865819297))
- change redirect method ([d6a22c1](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d6a22c112eaa49ed5c26904863e9012752c85879))
- edit timeout ([85fe7db](https://github.com/bluelightcard/BlueLightCard-2.0/commit/85fe7db925537bbbf359b83c36d7106015860833))
- ensure company logo shows on state update ([#1536](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1536)) ([53b7605](https://github.com/bluelightcard/BlueLightCard-2.0/commit/53b7605a0a63d996fb3b8e9cd9a20017563c9f8a))
- ensure description text is visible ([#1621](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1621)) ([0f70c81](https://github.com/bluelightcard/BlueLightCard-2.0/commit/0f70c81755fd15fd2874829d091e9762b97514b8))
- first letter of 'Copy Discount Code' changed to upper case ([#1604](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1604)) ([8a8ef7e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8a8ef7eb78eae695e57967e52f9294637eb93c35))
- fix issue with brand preset ([#1437](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1437)) ([7cb4893](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7cb48933cba40c4b308a7f8c14fccbfa9de02e59))
- Offer pop up close button is not visible in the Dark mode ([#1579](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1579)) ([c408bc0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c408bc04e92f98d4f98be1c6c589d2965e70e8de))
- Offer sheet handle redirect ([#1611](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1611)) ([f32dca7](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f32dca73789fa2d3d6c75c76203523f62050e6a9))
- Offer sheet handle redirect ([#1612](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1612)) ([85fe7db](https://github.com/bluelightcard/BlueLightCard-2.0/commit/85fe7db925537bbbf359b83c36d7106015860833))
- offer sheet redirect ([#1614](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1614)) ([bb1ae91](https://github.com/bluelightcard/BlueLightCard-2.0/commit/bb1ae91fbc82826c48281ce478071d9d226b34e2))
- OfferSheet different logic for onClick handlers on mobile hybrid and web ([#1620](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1620)) ([3bf2134](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3bf213490594d9617b8f3cf68daf01d7b3888a09))
- parametrise vault redemption experiment id and store as environment variable ([#1470](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1470)) ([10c9416](https://github.com/bluelightcard/BlueLightCard-2.0/commit/10c9416d96e1790b5871234a90e09ef34468e381))
- parametrise vault redemption experiment id and store as environment variable ([#1478](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1478)) ([d9f56fb](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d9f56fb99bfef5e17aeee49d367590defc2f483b))
- Refactor offer sheet ([#1605](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1605)) ([45e7588](https://github.com/bluelightcard/BlueLightCard-2.0/commit/45e75889728073d676b4045ab69de7e50dba98f0))
- Reinstate the 'double' navigation call to handle odd iOS behaviour ([#1610](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1610)) ([586ea2a](https://github.com/bluelightcard/BlueLightCard-2.0/commit/586ea2accc80b78a1690058da31f6e72348e334f))
- Revert/tr-605 mobile one tap ([#1494](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1494)) ([519e7de](https://github.com/bluelightcard/BlueLightCard-2.0/commit/519e7de91295a384647a380e40e679610d6668f2))
- TO 781 company cta redirects to non existent offer page when offer not found ([#1587](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1587)) ([078a747](https://github.com/bluelightcard/BlueLightCard-2.0/commit/078a74707f6d358d370294ea65d7025376a3b51c))
- TO-767 scroll offersheet backdrop ([#1484](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1484)) ([2bb0c45](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2bb0c45940611545a07a039e499c865d8a5347f3))
- TO-774 homepage offer redirect url ([#1549](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1549)) ([f3ce990](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f3ce99047507dc7b1e3280e2452523f9006c8a78))
- TR-605: redirecting fix for url ([efc4078](https://github.com/bluelightcard/BlueLightCard-2.0/commit/efc4078d4c113ae6c1263310afbc67f9dbafbd2c))
- TR-605: redirecting fix for url ([#1487](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1487)) ([efc4078](https://github.com/bluelightcard/BlueLightCard-2.0/commit/efc4078d4c113ae6c1263310afbc67f9dbafbd2c))
- update alt text on header image ([#1562](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1562)) ([428f8eb](https://github.com/bluelightcard/BlueLightCard-2.0/commit/428f8ebcb5853aee421c7594cb85c688b9336470))
- update env vars ([#1481](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1481)) ([fe23b2f](https://github.com/bluelightcard/BlueLightCard-2.0/commit/fe23b2f680656817cc5c6abc97302740fa74a8e4))

### Other Changes

- adds logs to debug redirect on offersheet ([#1613](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1613)) ([97f175e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/97f175e815e29af32b7ccec8d93363e6ef9c882d))
- disco 392 setup tailwind config in the shared UI package ([#1623](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1623)) ([fff5e9d](https://github.com/bluelightcard/BlueLightCard-2.0/commit/fff5e9daff7e9de0d91e8809ddf58c42433f293d))
- fix flag storybook ci ([#1525](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1525)) ([8ab99b0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/8ab99b0a4252bfddf92d2269f26f9c35e74c945a))
- remove timeout ([cd229cc](https://github.com/bluelightcard/BlueLightCard-2.0/commit/cd229cc09c8abb456f03b0270261d3a755c85c76))
- remove timeout ([#1616](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1616)) ([cd229cc](https://github.com/bluelightcard/BlueLightCard-2.0/commit/cd229cc09c8abb456f03b0270261d3a755c85c76))
- updated tokens ([#1491](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1491)) ([73edb98](https://github.com/bluelightcard/BlueLightCard-2.0/commit/73edb9827adb64df581bd6eedb6ae24d72f964b3))

## [1.3.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/shared-ui-v1.2.0...shared-ui-v1.3.0) (2024-05-23)

### Features

- add kinds to response ([#1383](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1383)) ([f50ec92](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f50ec9263cfd5c667f41d5ec3db8947868e98c24))
- add vault redirect for when user have no codes. ([f50ec92](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f50ec9263cfd5c667f41d5ec3db8947868e98c24))

### Bug Fixes

- event offer viewed ([#1423](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1423)) ([4c92900](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4c92900930eafd3394b0db5e18f03b507f932ab8))
- event offer viewed ([#1426](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1426)) ([6da9012](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6da901226c145cf7806f02c6c922f850396391a9))
- Offer viewed amplitude event not triggering correctly on prod ([#1406](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1406)) ([ac2e733](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ac2e7335a6fdf55d32c3bfe4a3be5f28a63d94d8))
- tr 602 general fixes ([#1410](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1410)) ([4d43ce2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4d43ce243686cae73b42872202e94ac532c1c414))

### Other Changes

- disco 295 setup migration structure ([#1417](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1417)) ([d5abde6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d5abde6dafaa9e31e5b92cc69e261bba5fca5988))

## [1.2.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/shared-ui-v1.1.0...shared-ui-v1.2.0) (2024-05-23)

### Features

- [TR-543]: Implement platform adapter and mobile hybrid clipboard ([#1344](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1344)) ([774b964](https://github.com/bluelightcard/BlueLightCard-2.0/commit/774b9646c87ec69ff49aa3e57a1f68403c039ed8))
- [TR-603]: Updated broken snapshot ([#1416](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1416)) ([c8904c6](https://github.com/bluelightcard/BlueLightCard-2.0/commit/c8904c69e6394c8b506d8465dad04c8e03e0bcb8))
- add offer sheet to mobile hybrid for generic/vault/pre applied offers ([#1234](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1234)) ([f9ffcf1](https://github.com/bluelightcard/BlueLightCard-2.0/commit/f9ffcf1058b8480bbcbdb525c63c7f4f256c1403))
- Feature/disco 126 update v5 search result handling ([#1384](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1384)) ([e8faa06](https://github.com/bluelightcard/BlueLightCard-2.0/commit/e8faa060a65dd4e48f30049eb2365c7aa306789e))
- move company page components to shared-ui package ([#1197](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1197)) ([71a2a36](https://github.com/bluelightcard/BlueLightCard-2.0/commit/71a2a3655d81c5368014967e80cb8aabba1fb9ae))
- TO-698 offer sheet web version ([#1356](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1356)) ([527b961](https://github.com/bluelightcard/BlueLightCard-2.0/commit/527b961e7892f54355ad3b9255f59f1592d39830))
- TR-478 Show offer sheet for generic offers in mobile hybrid ([#1351](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1351)) ([44c9a90](https://github.com/bluelightcard/BlueLightCard-2.0/commit/44c9a90fec3ddaa7699278966165b1a417bdc562))
- use new web offer sheet experiment ([#1414](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1414)) ([7d08d20](https://github.com/bluelightcard/BlueLightCard-2.0/commit/7d08d20959a9e9f98ed1dbec5f8807f11705ee88))

### Bug Fixes

- copy changes ([#1411](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1411)) ([8262882](https://github.com/bluelightcard/BlueLightCard-2.0/commit/82628829844d39a20b2a1f389311272c99590600))
- implement fallback to redirect in same tab ([#1376](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1376)) ([eaa3d22](https://github.com/bluelightcard/BlueLightCard-2.0/commit/eaa3d22fdc53f65dfdb3bab0217acb5f5aa61f2e))
- offer not opening on mobile-hybrid legacy ([#1315](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1315)) ([d80e9c9](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d80e9c9e7060ca381b72734ad0937c2ed166c0d5))
- prevent double logging events ([#1402](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1402)) ([4b8c8a1](https://github.com/bluelightcard/BlueLightCard-2.0/commit/4b8c8a134d9e24b9c0134d5d2c1ecc55dc60808b))
- TR-534 company name missing ([#1334](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1334)) ([ed1431e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ed1431e9ea5e02e9fa17b42f01f34c5cc1fd1677))
- TR-581 tidy up leaky abstractions ([#1396](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1396)) ([46e6c55](https://github.com/bluelightcard/BlueLightCard-2.0/commit/46e6c559c8ff86292435557622c85c2b58521254))
- TR-590 Fixed offer sheet styling for mobile ([#1386](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1386)) ([6b84883](https://github.com/bluelightcard/BlueLightCard-2.0/commit/6b848838dc86d5acc6919facb40f0f9584e3ac1c))
- TR-601 Fixed offer sheet styling to be correctly hidden in DOM when not visible ([#1404](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1404)) ([3a2cc4e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/3a2cc4e9ded25b928e2e1273d38532b2572014ae))
- update paste at checkout wording ([#1403](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1403)) ([375f5e2](https://github.com/bluelightcard/BlueLightCard-2.0/commit/375f5e2e00f337ed8129518e9a893db1fe62528d))
- web issues ([#1397](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1397)) ([2195122](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2195122b4ecf36d7085be2377c5766c1540d42ad))

### Other Changes

- [TR-581]: Move shared-ui config to provider ([#1395](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1395)) ([ef4f7b0](https://github.com/bluelightcard/BlueLightCard-2.0/commit/ef4f7b0525b44ec9238fdc892a77ca481fece6ef))

## [1.1.0](https://github.com/bluelightcard/BlueLightCard-2.0/compare/shared-ui-v1.0.2...shared-ui-v1.1.0) (2024-05-08)

### Features

- implement platform adapter for shared UI & v5 API support ([#1244](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1244)) ([1e5809e](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1e5809e6da7f66ebab10a2a9ef24fe2598d0118d))
- TO-624 offer sheet shared UI ([#1177](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1177)) ([91ebf84](https://github.com/bluelightcard/BlueLightCard-2.0/commit/91ebf84b1921e6aa17eb73350bd26cc43a51d4b2))
- TO-661 integrate offer sheet ([#1225](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1225)) ([a75fc78](https://github.com/bluelightcard/BlueLightCard-2.0/commit/a75fc78ded101e81658c1ec05e703639d0aa0900))
- TR-388 Add offer sheet experiment ([#1229](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1229)) ([25a4112](https://github.com/bluelightcard/BlueLightCard-2.0/commit/25a4112a341c4259b629e2551bebf40b2927a143))
- TR-388 Reintroduce mobile hybrid offer sheet experiment ([#1261](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1261)) ([74a6604](https://github.com/bluelightcard/BlueLightCard-2.0/commit/74a66047717c1fdccfe78cc4def53eedc79726aa))
- Update shared-ui offer sheet flow ([#1288](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1288)) ([44ffd79](https://github.com/bluelightcard/BlueLightCard-2.0/commit/44ffd799c20e8ab814c95b4e2cea64b609412f35))

### Bug Fixes

- [TR-428]: Add E2E tests for redemption firehose integration & fix firehose integration for compVaultClick ([#1211](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1211)) ([74ed9f1](https://github.com/bluelightcard/BlueLightCard-2.0/commit/74ed9f1b6d10643d8ab9bf53dcd902fce3ad5aa5))
- [TR-461] ios styling issues ([#1258](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1258)) ([58709d1](https://github.com/bluelightcard/BlueLightCard-2.0/commit/58709d19293d0e110a7928420b870f3be9811f62))
- [TR-488]: Allow navigating to external URLs from mobile-hybrid ([#1272](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1272)) ([1048124](https://github.com/bluelightcard/BlueLightCard-2.0/commit/10481245c7b8a589dcb4e001abffac10fd618f44))
- TR-498 Fix offer details links to use actual company ID ([#1297](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1297)) ([15b8801](https://github.com/bluelightcard/BlueLightCard-2.0/commit/15b88013a0269886d8fa45340996e01563337c56))

## [1.0.2](https://github.com/bluelightcard/BlueLightCard-2.0/compare/shared-ui-v1.0.1...shared-ui-v1.0.2) (2024-04-15)

### Bug Fixes

- missing npm auth token ([#1184](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1184)) ([2fa02ad](https://github.com/bluelightcard/BlueLightCard-2.0/commit/2fa02ad4dc90c2464e3731cb9b4cdafc6f830c93))

## [1.0.1](https://github.com/bluelightcard/BlueLightCard-2.0/compare/shared-ui-v1.0.0...shared-ui-v1.0.1) (2024-04-15)

### Bug Fixes

- added missing typescript eslint module ([#1178](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1178)) ([1311da4](https://github.com/bluelightcard/BlueLightCard-2.0/commit/1311da4ade52c2e5aee4b99873e2dba7a0a51ec1))

## 1.0.0 (2024-04-11)

### Features

- shared UI ([#1109](https://github.com/bluelightcard/BlueLightCard-2.0/issues/1109)) ([d7d3551](https://github.com/bluelightcard/BlueLightCard-2.0/commit/d7d3551c040241bedede7c9a74e41405ce1dac78))
