import { fetchSanity, groq } from './fetch';

const navigationQuery = groq`
	title,
	items[]{
		...,
		internal->{ _type, title, metadata },
		links[]{
			...,
			internal->{ _type, title, metadata }
		}
	}
`;

export const creativeModuleQuery = groq`
	modules[]{
		...,
		subModules[]{
			...,
			ctas[]{
				...,
				link{
					...,
					internal->{ title, metadata }
				}
			}
		}
	}
`;

export async function getSite(brand: string) {
  const site = await fetchSanity<Sanity.Site>(
    groq`
					*[_type == 'site' && brand->.code == $brand][0]{
							...,
							ctas[]{
									...,
									link{
											...,
											internal->{ _type, title, metadata }
									}
							},
							headerMenu->{ ${navigationQuery} },
							footerMenu->{ ${navigationQuery} },
							social->{ ${navigationQuery} },
							'ogimage': ogimage.asset->url
					}
			`,
    { params: { brand }, tags: ['site'] },
  );

  return site;
}

export async function getAnnouncements(brand: string) {
  return await fetchSanity<Sanity.Announcement[]>(
    groq`*[_type == 'site' && brand->.code == $brand][0].announcements[]->{
			...,
			cta{
				...,
				internal->{ _type, title, metadata }
			}
		}`,
    {
      tags: ['announcements'],
      params: { brand },
      revalidate: 30,
    },
  );
}
