import Img from '@/ui/Img';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface CardProps {
  image?: Sanity.Image;
  companyId: string;
  companyName: string;
}

export default function CompanyCard({ companyId, companyName, image }: CardProps) {
  return (
    <div className="overflow-hidden">
      <Link href={`/company/${companyId}`} className="flex h-full">
        <Card className="border-none bg-gray-50 shadow-none dark:border-none dark:shadow-none">
          <CardHeader className="p-2">
            <CardTitle></CardTitle>
            <CardDescription>
              <Img image={image} imageWidth={1024} className="" />
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-10 text-left text-3xl font-semibold">
            {companyName}
          </CardContent>
          <CardContent className="text-normal pl-10 text-left text-slate-700"></CardContent>
        </Card>
      </Link>
    </div>
  );
}
