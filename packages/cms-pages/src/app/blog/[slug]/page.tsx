import { fetchSanity, fetchSanityStatic, groq } from '@/lib/sanity/fetch';
import { notFound } from 'next/navigation';
import Post from '@/ui/modules/blog/Post';
import processMetadata from '@/lib/processMetadata';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: Props) {
  const post = await getPost(params);
  if (!post) notFound();
  return <Post post={post} />;
}

export async function generateMetadata({ params }: Props) {
  const post = await getPost(params);
  if (!post) notFound();
  return await processMetadata(post);
}

export async function generateStaticParams() {
  const slugs = await fetchSanityStatic<string[]>(
    groq`*[_type == 'blog.post' && defined(metadata.slug.current)].metadata.slug.current`,
  );

  return slugs.map((slug) => ({ slug }));
}

async function getPost(params: Props['params']) {
  return await fetchSanity<Sanity.BlogPost>(
    groq`*[_type == 'blog.post' && metadata.slug.current == $slug][0]{
			...,
			'body': select(_type == 'image' => asset->, body),
			'readTime': length(pt::text(body)) / 200,
			'headings': body[style in ['h2', 'h3']]{
				style,
				'text': pt::text(@)
			},
			categories[]->,
			metadata {
				...,
				'ogimage': image.asset->url
			}
		}`,
    {
      params,
      tags: ['blog.post'],
    },
  );
}

interface Props {
  params: { slug?: string };
}
