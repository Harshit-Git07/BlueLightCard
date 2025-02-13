import { FlexibleMenuData, FlexibleMenusData, MenusData } from '@bluelightcard/shared-ui';
import { WebPlatformAdapter } from './WebPlatformAdapter';
import { AmplitudeExperimentFlags } from './amplitude/AmplitudeExperimentFlags';
import { FlexibleMenusDataTransformedForView } from '../page-types/members-home';
import { CardCarouselOffer } from '../../offers/components/CardCarousel/types';
import { cleanText } from '@bluelightcard/shared-ui';
import { FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST } from '@bluelightcard/shared-ui/constants';

export function transformFlexibleMenuDataForView(
  flexibleMenusData: MenusData['flexible'],
  platformAdapter: WebPlatformAdapter
): FlexibleMenusDataTransformedForView {
  const isAllFlexibleMenusEnabled =
    platformAdapter.getAmplitudeFeatureFlag(
      AmplitudeExperimentFlags.ENABLE_ALL_FLEXIBLE_MENUS_HOMEPAGE_WEB
    ) === 'on';

  if (!flexibleMenusData || !flexibleMenusData.length || !isAllFlexibleMenusEnabled) {
    return [];
  }

  const caseInsensitiveAllowList = FLEXIBLE_MENUS_DATA_TITLE_ALLOWLIST.map((allowlistTitle) => {
    return allowlistTitle.toLowerCase();
  });

  return flexibleMenusData
    .filter(predicateToRemoveFlexibleMenusDataWithoutMenus)
    .filter(predicateToRemoveFlexibleMenusDataNotInAllowListCaseInsensitive)
    .sort(compareFlexibleMenusDataTitleByAllowlistPositionCaseInsensitive)
    .map((flexibleMenusData: FlexibleMenusData) => {
      return {
        id: flexibleMenusData.id,
        title: flexibleMenusData.title,
        menus: flexibleMenusData.menus.map(transformFlexibleMenuData),
      };
    });

  function predicateToRemoveFlexibleMenusDataNotInAllowListCaseInsensitive(
    flexibleMenusData: FlexibleMenusData
  ) {
    return caseInsensitiveAllowList.includes(flexibleMenusData.title.toLowerCase());
  }

  function compareFlexibleMenusDataTitleByAllowlistPositionCaseInsensitive(
    a: FlexibleMenusData,
    b: FlexibleMenusData
  ): number {
    const aTitleCaseInsensitiveIndex = caseInsensitiveAllowList.indexOf(
      a.title.toLocaleLowerCase()
    );
    const bTitleCaseInsensitiveIndex = caseInsensitiveAllowList.indexOf(
      b.title.toLocaleLowerCase()
    );

    return aTitleCaseInsensitiveIndex - bTitleCaseInsensitiveIndex;
  }
}

function transformFlexibleMenuData(flexibleMenuData: FlexibleMenuData): CardCarouselOffer {
  return {
    href: `/flexible-offers?id=${flexibleMenuData.id}`,
    imageUrl: flexibleMenuData.imageURL,
    offerId: flexibleMenuData.id,
    offername: cleanText(flexibleMenuData.title),
  };
}

function predicateToRemoveFlexibleMenusDataWithoutMenus(
  flexibleMenusData: FlexibleMenusData
): boolean {
  return flexibleMenusData.menus.length > 0;
}
