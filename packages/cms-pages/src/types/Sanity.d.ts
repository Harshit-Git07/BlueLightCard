import type { SanityImageObject } from '@sanity/image-url/lib/types/types';
import type { SanityDocument } from 'next-sanity';

declare global {
  namespace Sanity {
    // documents

    type Site = SanityDocument<{
      title: string;
      logo: Logo;
      announcements?: Announcement[];
      copyright?: any;
      ctas?: CTA[];
      headerMenu?: Navigation;
      footerMenu?: Navigation;
      social?: Navigation;
      ogimage?: string;
    }>;

    type PageBase = SanityDocument<{
      title?: string;
      metadata: Metadata;
    }>;

    type Page = PageBase & {
      readonly _type: 'page';
      modules?: Module[];
    };

    type Navigation = SanityDocument<{
      title: string;
      items?: Array<Link | LinkList>;
    }>;

    type Announcement = SanityDocument<{
      content: any;
      cta?: Link;
      start?: string;
      end?: string;
    }>;

    type BlogPost = PageBase & {
      readonly _type: 'blog.post';
      body: any;
      readTime: number;
      headings?: Array<{ style: string; text: string }>;
      categories: BlogCategory[];
      publishDate: string;
    };

    type BlogCategory = SanityDocument<{
      title: string;
    }>;

    type Logo = SanityDocument<{
      name: string;
      image: ImageTrio;
    }>;

    type Testimonial = SanityDocument<{
      content: any;
      author?: {
        name: string;
        title?: string;
        image?: Image;
      };
    }>;

    type MenuOffer = SanityDocument<{
      _type: string;
      title: string;
      image: ImageTrio;
      inclusions: Offer[];
    }>;

    type MenuCampaign = SanityDocument<{
      _type: string;
      title: string;
      image: ImageTrio;
      inclusions: Campaign[];
    }>;

    type MenuCompany = SanityDocument<{
      _type: string;
      title: string;
      image: ImageTrio;
      inclusions: Company[];
    }>;

    type MenuThemedOffer = SanityDocument<{
      _id: string;
      _type: string;
      title: string;
      image: ImageTrio;
      inclusions: OfferCollection[];
    }>;

    type BlockChild = SanityDocument<{
      marks: [];
      text: string;
    }>;

    type Block = SanityDocument<{
      style: string;
      markDefs: [];
      children: BlockChild[];
    }>;

    interface OfferCollection {
      _id: string;
      _type: string;
      _key: string;
      offerCollectionName: string;
      offerCollectionDescription: string;
      offerCollectionImage: ImageTrio;
      offers: Offer[];
    }

    type Company = SanityDocument<{
      _id: string;
      _type: string;
      brandCompanyDetails: BrandCompanyDetails[];
      companyLocations?: CompanyLocation[] | null;
    }>;

    type BrandlessCompany = Omit<Company, 'brandCompanyDetails'> & {
      brandCompanyDetails?: Company['brandCompanyDetails'];
    };

    type BrandedCompany = SanityDocument<BrandlessCompany & BrandCompanyDetails>;

    interface ImageWithSize {
      url: string;
      aspectRatio: number;
      height: number;
      width: number;
    }

    type CampaignTermsAndConditionsContentChild = SanityDocument<{
      text: string;
      marks: [];
    }>;

    type CampaignTermsAndConditionsContent = SanityDocument<{
      markDefs: [];
      children: CampaignTermsAndConditionsContentChild[];
      style: string;
    }>;

    type CampaignTermsAndConditions = SanityDocument<{
      tableOfContents: boolean;
      tocPosition: 'right' | 'left';
      content: CampaignTermsAndConditionsContent[];
    }>;

    type CampaignInclusions = Company | Offer;

    type Campaign = SanityDocument<{
      image: {
        default?: ImageWithSize;
        light?: ImageWithSize;
        dark?: ImageWithSize;
      };
      name: string;
      termsAndConditions: CampaignTermsAndConditions;
      inclusions: CampaignInclusions[];
    }>;

    type CampaignTile = SanityDocument<{
      image: {
        default?: ImageWithSize;
        light?: ImageWithSize;
        dark?: ImageWithSize;
      };
      name: string;
    }>;

    type Offer = SanityDocument<{
      boostDetails: {
        boost: {
          name: string;
          image: ImageTrio;
        };
      } | null;
      brands: Brand[];
      categorySelection?: any | null;
      company: Company;
      commonExclusions?: any | null;
      discountDetails: {
        _type: 'discount.type';
        discountCoverage: string;
        otherDiscountDescriptionDetails: string;
        discountType: string;
        discountDescription: string;
      };
      eventDate: string;
      evergreen: boolean;
      expires: string;
      image: ImageTrio;
      inclusions?: any | null;
      name: string;
      offerClassification: {
        _type: 'classification.type';
        offerClassification: string;
      };
      offerDescription: any;
      offerType: {
        _type: 'offer.type';
        offerType: string;
      };
      offerId: number;
      redemptionType: RedemptionType;
      restrictions?: any | null;
      start: string;
      status: string;
      termsAndConditions: any;
    }>;

    type BrandlessOffer = Omit<Offer, 'brands'> & {
      brands?: Offer['brands'];
    };

    type BrandedOffer = SanityDocument<BrandlessOffer & Brand>;

    // objects

    interface CTA {
      link?: Link;
      style?: string;
    }

    type Image = SanityImageObject & {
      _type: 'image';
    } & Partial<{
        alt: string;
        loading: 'lazy' | 'eager';
      }>;

    interface ImageTrio {
      default?: Image | string | null;
      light?: Image | string | null;
      dark?: Image | string | null;
    }

    interface RedemptionType {
      _type: 'redemption.type';
      redemptionType: string;
      offerType?: string;
      genericCode?: {
        code: string;
        offerUrl: string;
      };
      offerUrl?: string;
      lowCodeAlertNumber?: number;
      maxCodesPerUser?: number;
      alertEmail?: string;
      campaignId?: number;
      drawDate?: string;
      numberOfWinners?: number;
    }

    type AgeRestriction = SanityDocument<{
      _type: 'age.restriction';
      description: string;
      name: string;
    }>;

    type CompanyLocation = SanityDocument<{
      _key: string;
      _type: 'company.location';
      location?: {
        _type: 'geopoint';
        lat?: number | null;
        lng?: number | null;
        alt?: number | null;
      } | null;
      storeName?: string | null;
      addressLine1?: string | null;
      addressLine2?: string | null;
      townCity?: string | null;
      region?: string | null;
      postcode?: string | null;
      country?: 'UK' | 'AU' | null;
      telephone?: string | null;
    }>;

    type Brand = SanityDocument<{
      code: string;
      description?: string;
      link: string;
      logo: ImageTrio;
      name: string;
    }>;

    interface BrandCompanyDetails {
      _key: string;
      ageRestrictions: AgeRestriction[];
      brand: Brand;
      brandName?: string;
      companyId?: number;
      companyLogo: ImageTrio;
      companyName: string;
      companyShortDescription?: string;
      displayName?: string;
      legalEntityName?: string;
      legalPrivacyLink?: string;
    }

    interface Link {
      readonly _type: 'link';
      label: string;
      type: 'internal' | 'external';
      internal?: Page | BlogPost;
      external?: string;
      params?: string;
    }

    interface LinkList {
      readonly _type: 'link.list';
      label: string;
      links?: Link[];
    }

    interface Metadata {
      title: string;
      description: string;
      slug: { current: string };
      image?: Image;
      ogimage?: string;
      noIndex: boolean;
    }

    type Module<T = any> = {
      _type: T;
      _key: string;
    } & T;
  }
}

export {};
