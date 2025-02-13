import { FlexibleMenuData, FlexibleMenusData, MenusData } from '@bluelightcard/shared-ui';
import { OfferFlexibleItemModel, OfferFlexibleModel } from '../models/offer';
import { FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST } from '@bluelightcard/shared-ui/constants';

export function transformFlexibleMenuDataForView(
  flexibleMenusData: MenusData['flexible'],
): OfferFlexibleModel[] {
  if (!flexibleMenusData || !flexibleMenusData.length) {
    return [];
  }

  const caseInsensitiveAllowList = FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST.map((allowlistTitle) => {
    return allowlistTitle.toLowerCase();
  });

  return flexibleMenusData
    .filter((flexibleMenusData: FlexibleMenusData) => {
      return flexibleMenusData.menus.length;
    })
    .filter((flexibleMenusData: FlexibleMenusData) => {
      return caseInsensitiveAllowList.includes(flexibleMenusData.title.toLowerCase());
    })
    .map((flexibleMenusData: FlexibleMenusData) => {
      return {
        title: flexibleMenusData.title,
        subtitle: '',
        random: true,
        items: flexibleMenusData.menus.map(transformFlexibleMenuData),
      };
    });
}

function transformFlexibleMenuData(flexibleMenuData: FlexibleMenuData): OfferFlexibleItemModel {
  return {
    id: flexibleMenuData.id,
    title: flexibleMenuData.title,
    imagehome: flexibleMenuData.imageURL,
    imagedetail: '',
    navtitle: '',
    intro: '',
    footer: '',
    random: true,
    hide: false,
    items: [],
  };
}
