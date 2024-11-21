import { fetchSanity, fetchSanityStatic, groq } from '@/lib/sanity/fetch';
import { notFound } from 'next/navigation';
import Company from '@/ui/modules/company/Company';

export default async function Page({ params }: Props) {
  const { company, offers } = await getCompany(params);
  if (!company) notFound();
  return <Company company={company} offers={offers} />;
}

export async function generateMetadata({ params }: Props) {
  const { company, offers } = await getCompany(params);
  if (!company) notFound();
  return company.brandCompanyDetails[0].companyName;
}

export async function generateStaticParams() {
  const ids = await fetchSanityStatic<string[]>(groq`*[_type == "company"]._id`);

  return ids.map((id) => ({ params: { id } }));
}

async function delay(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

async function getCompany(params: Props['params']) {
  console.log(`Fetching company and offers for ID: ${params.id}`);
  try {
    const result = await fetchSanity<{
      company: Sanity.Company;
      offers: Sanity.Offer[];
    }>(
      groq`{
        "company": *[_type == 'company' && _id == $id][0]{
          ...,
        },
        "offers": *[_type == 'offer' && company._ref == $id]{
          ...
        }
      }`,
      {
        params: { id: params.id },
        tags: ['company', 'offers'],
      },
    );
    console.log(`Successfully fetched data for company ID: ${params.id}`);
    return result;
  } catch (error) {
    console.error(`Error fetching data for company ID: ${params.id}`, error);
    throw error;
  }
}

interface Props {
  params: { id: string };
}
