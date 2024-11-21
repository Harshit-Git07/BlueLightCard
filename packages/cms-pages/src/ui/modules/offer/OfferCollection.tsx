import css from './OfferCollection.module.css';
import Img from '@/ui/Img';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import LinkIcon from './LinkIcon';

interface OfferCollectionProps {
  menu: Sanity.MenuThemedOffer;
}

export default function OfferCollection({ menu }: OfferCollectionProps) {
  const offerCollectionImage = menu.inclusions[0].offerCollectionImage.default;
  const offerCollectionTitle = menu.inclusions[0].offerCollectionName;
  const offerCollectionDescription = menu.inclusions[0].offerCollectionDescription;
  const offers = menu.inclusions[0].offers;

  return (
    <div className="flex justify-center items-center">
      <article className="w-full md:w-3/4 lg:w-4/5 xl:w-4/5 mx-auto">
        <header className="flex items-center mt-10 justify-center">
          <Img image={offerCollectionImage as Sanity.Image} />
        </header>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800 flex justify-center">
            {offerCollectionTitle}
          </h2>
          <div className="flex justify-center mx-5">{offerCollectionDescription}</div>
          <div className={`flex flex-wrap ${css.offerContainer}`}>
            {offers.map((offer, index) => (
              <div
                key={index}
                className={`mx-2 my-2 border-2 rounded shadow-md hover:shadow-xl transition duration-300 ease-in-out p-4 overflow-hidden flex flex-col ${css.offerCard}`}
              >
                <Link href={`/company/${offer.company._id}`}>
                  <div className="flex justify-center relative group transition duration-300 ease-in-out hover:scale-110">
                    <Img
                      image={
                        offer.company.brandCompanyDetails[0].companyLogo.default as Sanity.Image
                      }
                      imageWidth={1600}
                      className="w-full h-full"
                    />
                    {offer.boostDetails != null && (
                      <div className="absolute -top-5 flex justify-end rounded-lg">
                        <Img
                          image={offer.boostDetails.boost.image.default as Sanity.Image}
                          imageWidth={1000}
                          className="w-1/3 h-1/3 rounded-full bg-clip-content p-2 bg-white bg-opacity-80"
                        />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="flex-grow">
                  <div className="text-center my-5 text-2xl text-blue-800 font-bold">
                    {offer.company.brandCompanyDetails[0].companyName}
                  </div>
                  <div className="my-2">
                    <hr />
                  </div>
                  <div className="text-center mt-4">
                    <div className="text-lg font-semibold">{offer.name}</div>
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <Link href={`/company/${offer.company._id}`}>
                    <Button className="bg-blue-800 text-lg font-semibold text-white py-2 px-4 hover:bg-blue-600 hover:outline hover:outline-2 hover:outline-blue-600">
                      Go to offer
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
