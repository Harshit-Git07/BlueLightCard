import Img from '@/ui/Img';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

interface CardProps {
  offer: Sanity.Offer;
  companyId: string;
}

export default function OfferCard({ offer, companyId }: CardProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Add relative positioning here */}
      <Link href={`/company/${companyId}`}>
        <Card className="border-none bg-gray-50 shadow-none dark:border-none dark:shadow-none">
          <CardHeader className="p-2">
            <CardTitle></CardTitle>
            <CardDescription>
              <Img
                image={offer?.image?.default as Sanity.Image}
                imageWidth={1024}
                className="h-full w-full rounded-xl shadow-lg"
              />
              {offer.boostDetails?.boost?.image?.default && (
                <div className="absolute right-0 top-0 p-3">
                  <Img
                    image={offer.boostDetails.boost.image.default as Sanity.Image}
                    imageWidth={1000}
                    className="h-20 w-20 rounded-full bg-white bg-opacity-80"
                  />{' '}
                  {/* Adjust size and styling */}
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-10 text-left text-3xl font-semibold">
            {offer?.company?.brandCompanyDetails?.[0].companyName}
          </CardContent>
          <CardContent className="text-normal pl-10 text-left text-slate-700">
            {offer?.name}
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
