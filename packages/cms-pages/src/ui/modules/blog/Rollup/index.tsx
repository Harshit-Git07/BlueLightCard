import { fetchSanity, groq } from '@/lib/sanity/fetch';
import Content from '@/ui/modules/RichtextModule/Content';
import Filtering from '@/ui/modules/blog/Rollup/Filtering';
import List from './List';
import { stegaClean } from '@sanity/client/stega';
import { cn } from '@/lib/utils';

export default async function Rollup({
  intro,
  layout,
  limit = 100,
  displayFilters,
  predefinedFilters,
}: Partial<{
  intro: any;
  layout: 'grid' | 'carousel';
  limit: number;
  displayFilters: boolean;
  predefinedFilters: Sanity.BlogCategory[];
}>) {
  const posts = await fetchSanity<Sanity.BlogPost[]>(
    groq`*[_type == 'blog.post'][0...$limit]|order(publishDate desc){
			...,
			categories[]->
		}`,
    {
      params: { limit },
      tags: ['posts'],
    },
  );

  return (
    <section className="section space-y-8">
      {intro && (
        <header className="richtext text-blue-700">
          <Content value={intro} />
          <hr />
        </header>
      )}

      {displayFilters && <Filtering predefinedFilters={predefinedFilters} />}

      <List
        posts={posts}
        predefinedFilters={predefinedFilters}
        className={cn(
          'gap-x-6 gap-y-12',
          stegaClean(layout) === 'grid'
            ? 'grid md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]'
            : 'carousel max-xl:full-bleed pb-4 [--size:320px] max-xl:px-4',
        )}
      />
    </section>
  );
}
