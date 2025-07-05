/**
 * This file centralizes all CMS-specific logic for fetching content.
 * It currently uses a Blog as an example to illustrate the structure and functionality.
 *
 * Integration Instructions:
 * 1. Update the CMSArticle interface to reflect the actual data structure provided by your CMS.
 * 2. Implement the contentQuery function to execute queries against your CMS.
 *    This function should be the base for all other query functions.
 * 3. Ensure functions like getBlogArticles and getBlogArticle utilize contentQuery
 *    to retrieve data, replacing the mock data with real CMS queries.
 */

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  details: string;
  image?: {
    url: string;
    alt?: string;
  };
}

interface BlogsQuery {
  limit?: number;
  offset?: number;
  category?: string;
  search?: string;
  includeDrafts?: boolean;
}

interface CMSArticle {
  identifier: string;
  headline: string;
  permalink: string;
  brief: string;
  content: string;
  picture?: {
    link: string;
    description?: string;
  };
}

/**
 * MAINTAINER, REPLACE WITH BASE CMS QUERY
 *
 * Base function for executing queries against the CMS.
 *
 * This function should be used by all other functions to perform CMS queries.
 * It takes a query string and an optional set of variables to execute the query.
 *
 * @template T - The expected return type of the query.
 * @param {string} query - The query string to be executed against the CMS.
 * @param {Record<string, any>} [variables={}] - An optional set of variables to be used in the query.
 * @returns {Promise<T>} - A promise that resolves to the result of the query.
 */
async function contentQuery<T = any>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  return {} as T;
}

/**
 * Transforms the CMS content into a BlogArticle object.
 * @template T - The type of the CMS item being transformed.
 * @param {T} item - The CMS item to transform.
 * @returns {BlogArticle} - The transformed BlogArticle object.
 */
function reshapeToArticle<T extends CMSArticle>(item: T): BlogArticle {
  return {
    id: item.identifier || "",
    title: item.headline || "",
    slug: item.permalink || "",
    summary: item.brief || "",
    details: item.content || "",
    image: item.picture
      ? {
          url: item.picture.link || "",
          alt: item.picture.description || "",
        }
      : undefined,
  };
}

export async function getBlogArticles(
  options: BlogsQuery = {}
): Promise<BlogArticle[]> {
  // MAINTAINER, REPLACE WITH CMS QUERY (via contentQuery)
  const cmsArticles = [
    {
      identifier: "1",
      headline: "Getting Started with Next.js 15",
      permalink: "getting-started-nextjs-15",
      brief: "Learn about the latest features and improvements in Next.js 15.",
      content:
        "This article covers the new App Router enhancements and performance optimizations in Next.js 15.",
      picture: {
        link: "/blog-hero.png",
        description: "Next.js 15 Hero Image",
      },
    },
  ];
  return cmsArticles.map(reshapeToArticle);
}

export async function getBlogArticle(
  slug: string,
  options: { includeDrafts?: boolean } = {}
): Promise<BlogArticle | null> {
  // MAINTAINER, REPLACE WITH CMS QUERY (via contentQuery)
  const articles = await getBlogArticles();
  return articles.find((article) => article.slug === slug) || null;
}
