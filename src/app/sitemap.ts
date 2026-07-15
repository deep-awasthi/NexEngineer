import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nexengineer.vercel.app';

  // Define critical workspace paths
  const routes = [
    '',
    '/login',
    '/signup',
    '/dsa',
    '/library',
    '/studio',
    '/ide',
    '/profile',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return routes;
}
