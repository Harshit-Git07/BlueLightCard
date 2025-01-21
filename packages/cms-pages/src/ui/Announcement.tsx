import Content from './modules/RichtextModule/Content';
import CTA from '@/ui/CTA';
import { getAnnouncements } from '@/lib/sanity/queries';

interface AnnouncementProps {
  brand: string;
}

export default async function Announcement({ brand }: AnnouncementProps) {
  const announcements = await getAnnouncements(brand);
  if (!announcements) return null;

  const active = announcements.find(({ start, end }) => {
    return (!start || new Date(start) < new Date()) && (!end || new Date(end) > new Date());
  });

  if (active == null) return null;

  return (
    <aside className="flex items-center justify-center gap-x-4 bg-blue-50 text-gray-700 font-bold p-2 text-center text-canvas max-md:text-sm md:gap-x-6">
      <div className="anim-fade-to-r text-lg flex items-center space-x-4">
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15Z"
            fill="#1B5D82"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.6154 6.85899C11.3987 6.85899 8.78207 9.47566 8.78207 12.6923C8.78207 14.6757 9.77374 16.4173 11.2821 17.4757V19.359C11.2821 19.8173 11.6571 20.1923 12.1154 20.1923H17.1154C17.5737 20.1923 17.9487 19.8173 17.9487 19.359V17.4757C19.4571 16.4173 20.4487 14.6757 20.4487 12.6923C20.4487 9.47566 17.8321 6.85899 14.6154 6.85899ZM12.1154 22.6923C12.1154 23.1507 12.4904 23.5257 12.9487 23.5257H16.2821C16.7404 23.5257 17.1154 23.1507 17.1154 22.6923V21.859H12.1154V22.6923ZM16.2821 16.609L16.9904 16.109C18.1154 15.3257 18.7821 14.0507 18.7821 12.6923C18.7821 10.3923 16.9154 8.52565 14.6154 8.52565C12.3154 8.52565 10.4487 10.3923 10.4487 12.6923C10.4487 14.0507 11.1154 15.3257 12.2404 16.109L12.9487 16.609V18.5257H16.2821V16.609Z"
            fill="white"
          ></path>
        </svg>
        <Content value={active.content} />
      </div>

      <CTA className="link anim-fade-to-l" link={active.cta} />
    </aside>
  );
}
