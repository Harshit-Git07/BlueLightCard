import Date from '@/ui/Date';
import Content from '../RichtextModule/Content';
import { cn } from '@/lib/utils';
import css from './Company.module.css';
import Img from '@/ui/Img';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import RedemptionType from './RedemptionDetails';
import { Badge } from '@/components/ui/badge';

interface CompanyProps {
  company: Sanity.Company;
  offers: Sanity.Offer[];
}

export default function Company({ company, offers }: CompanyProps) {
  return (
    <div className="flex justify-center items-center">
      <article className="w-3/6 mx-auto">
        <header className={`${css.header} grid grid-cols-2 items-center gap-2 mt-10`}>
          <div className="flex items-top">
            <Img
              image={company.brandCompanyDetails[0].companyLogo.default as Sanity.Image}
              className=""
            />
          </div>
          <div className="">
            <h1 className="text-3xl font-bold mb-10 text-blue-800">
              {company.brandCompanyDetails[0].companyName}
            </h1>
            <Content
              value={company.brandCompanyDetails[0].companyShortDescription}
              className={cn(css.body, 'text-base pr-10')}
            />
          </div>
        </header>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">
            Offers from {company.brandCompanyDetails[0].companyName}
          </h2>
          {offers.map((offer, index) => (
            <div key={index} className="border rounded-xl shadow-sm my-5">
              <div className="flex items-center space-x-4 my-3 p-1 px-5">
                <Img
                  image={offer.image?.default as Sanity.Image}
                  imageWidth={500}
                  className="rounded-xl shadow-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between space-x-2">
                    <h3 className="text-2xl text-blue-800 font-bold">{offer.name}</h3>
                    <span className="pr-5">
                      <Badge className="bg-blue-500 capitalize">
                        {offer.offerType?.offerType} offer
                      </Badge>
                    </span>
                  </div>
                  <Content
                    value={offer.offerDescription.content}
                    className={cn(css.body, 'mt-5 text-base font-semibold pr-10')}
                  />
                  <div className="mt-10">
                    <h3 className="text-xl text-blue-800 font-bold">How to claim</h3>
                    <div className="my-4">
                      <RedemptionType
                        redemptionType={{
                          offerType: offer.redemptionType.offerType ?? '',
                          offerUrl: offer.redemptionType.offerUrl,
                          genericCode: offer.redemptionType.genericCode,
                          numberOfWinners: offer.redemptionType.numberOfWinners,
                        }}
                      />
                    </div>
                    <div>
                      Offer expires on <Date value={offer.expires} />
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="terms-and-conditions p-5">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="terms-and-conditions">
                    <AccordionTrigger className="text-lg font-bold text-blue-800">
                      Terms and conditions
                    </AccordionTrigger>
                    <AccordionContent>
                      <Content
                        value={offer.termsAndConditions.content}
                        className={cn(css.body, 'mt-5 text-base font-semibold pr-10')}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          ))}
        </section>
      </article>
    </div>
  );
}
