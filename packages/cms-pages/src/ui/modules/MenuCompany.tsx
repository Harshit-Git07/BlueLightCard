import CompanyCarousel from './CompanyCarousel';

export default function MenuCompany({
  menuCompany,
}: Partial<{
  menuCompany: Sanity.MenuCompany;
}>) {
  if (menuCompany == null) return null;
  return <CompanyCarousel menu={menuCompany} />;
}
