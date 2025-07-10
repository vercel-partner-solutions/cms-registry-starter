/**
 * This file centralizes all CMS-specific logic for fetching content.
 * It currently uses a Blog as an example to illustrate the structure and functionality.
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
  sys: {
    id: string;
    publishedAt: string;
    firstPublishedAt: string;
  };
  title: string;
  slug: string;
  summary: string;
  details: string;
  image: {
    sys: { id: string };
    url: string;
    title: string;
    description?: string;
    width: number;
    height: number;
    contentType: string;
  };
}

const GET_ARTICLES_QUERY = `
  query GetArticles($limit: Int, $skip: Int, $preview: Boolean) {
    articleCollection(limit: $limit, skip: $skip, preview: $preview, order: [sys_publishedAt_DESC]) {
      total
      items {
        sys {
          id
          publishedAt
          firstPublishedAt
        }
        title
        slug
        summary
        details
        image {
          sys {
            id
          }
          url
          title
          description
          width
          height
          contentType
        }
      }
    }
  }
`;

const GET_ARTICLE_BY_SLUG_QUERY = `
  query GetArticleBySlug($slug: String!, $preview: Boolean) {
    articleCollection(where: { slug: $slug }, limit: 1, preview: $preview) {
      items {
        sys {
          id
          publishedAt
          firstPublishedAt
        }
        title
        slug
        summary
        details
        image {
          sys {
            id
          }
          url
          title
          description
          width
          height
          contentType
        }
      }
    }
  }
`;

/**
 * Base function for executing queries against the Contentful CMS.
 *
 * This function should be used by all other functions to perform CMS queries.
 * It takes a query string and an optional set of variables to execute the query.
 *
 * @template T - The expected return type of the query.
 * @param {string} query - The GraphQL query string to be executed against Contentful.
 * @param {Record<string, any>} [variables={}] - An optional set of variables to be used in the query.
 * @returns {Promise<T>} - A promise that resolves to the result of the query.
 */
async function contentQuery<T = any>(
  query: string,
  variables: Record<string, any> = {}
): Promise<T> {
  const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
  const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
    throw new Error("Missing Contentful environment variables");
  }

  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}

/**
 * Transforms the Contentful article into a BlogArticle object.
 * @param {CMSArticle} item - The Contentful article item to transform.
 * @returns {BlogArticle} - The transformed BlogArticle object.
 */
function reshapeToArticle(item: CMSArticle): BlogArticle {
  // In a real implementation, for rich text JSON you want to use @contentful/rich-text-plain-text-renderer

  return {
    id: item.sys.id,
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    details: item.details,
    image: item.image
      ? {
          url: item.image.url,
          alt: item.image.description || item.image.title || item.title,
        }
      : undefined,
  };
}

export async function getBlogArticles(
  options: BlogsQuery = {}
): Promise<BlogArticle[]> {
  const { limit = 10, offset = 0, includeDrafts = false } = options;

  // Convert offset to skip for Contentful
  const skip = offset;

  const data = await contentQuery(GET_ARTICLES_QUERY, {
    limit,
    skip,
    preview: includeDrafts,
  });

  const cmsArticles: CMSArticle[] = data.articleCollection.items;
  return cmsArticles.map(reshapeToArticle);
}

export async function getBlogArticle(
  slug: string,
  options: { includeDrafts?: boolean } = {}
): Promise<BlogArticle | null> {
  const { includeDrafts = false } = options;

  const data = await contentQuery(GET_ARTICLE_BY_SLUG_QUERY, {
    slug,
    preview: includeDrafts,
  });

  const cmsArticles: CMSArticle[] = data.articleCollection.items;
  const article = cmsArticles[0];

  return article ? reshapeToArticle(article) : null;
}
