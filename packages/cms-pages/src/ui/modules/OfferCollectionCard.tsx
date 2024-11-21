import Img from '@/ui/Img';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface CardProps {
  image?: Sanity.Image;
  id: string;
  offerCollectionKey: string;
  name: string;
}

export default function OfferCollectionCard({ id, offerCollectionKey, name, image }: CardProps) {
  return (
    <div className="overflow-hidden">
      <Link href={`/flexibleOffers/${id}/${offerCollectionKey}`}>
        <Card className="border-none dark:border-none shadow-none dark:shadow-none bg-gray-50">
          <CardHeader className="p-2">
            <CardTitle></CardTitle>
            <CardDescription>
              <Img image={image} imageWidth={1024} className="" />
            </CardDescription>
          </CardHeader>
          <CardContent className="text-lg font-semibold text-left pl-10">{name}</CardContent>
        </Card>
      </Link>
    </div>
  );
}
