import { MetadataRoute } from 'next';
import { getURL } from '@/utils/helpers';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = getURL();

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/account/', '/api/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
