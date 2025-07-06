/**
 * This file centralizes all CMS-specific logic for fetching content.
 * It currently uses a Blog as an example to illustrate the structure and functionality.
 * It uses Sanity CMS to fetch article content.
 */
import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  details: string;
  publishedAt?: string;
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
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  summary: string;
  details: any[];
  publishedAt?: string;
  image?: {
    asset: {
      _ref: string;
      url?: string;
    };
    alt?: string;
  };
}

/**
 * Base function for executing queries against the Sanity CMS.
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
  try {
    const result = await client.fetch<T>(query, variables);
    return result;
  } catch (error) {
    console.error("CMS Query Error:", error);
    throw new Error("Failed to fetch content from CMS");
  }
}

/**
 * Transforms the Sanity article into a BlogArticle object.
 * @param {CMSArticle} item - The Sanity article item to transform.
 * @returns {BlogArticle} - The transformed BlogArticle object.
 */
function reshapeToArticle(item: CMSArticle): BlogArticle {
  // Convert Sanity block content to plain text for details
  // In a real implementation, you might want to use @portabletext/react for rich text
  const detailsText =
    item.details
      ?.map((block: any) => {
        if (block._type === "block" && block.children) {
          return block.children.map((child: any) => child.text).join("");
        }
        return "";
      })
      .join("\n") || "";

  return {
    id: item._id,
    title: item.title || "",
    slug: item.slug?.current || "",
    summary: item.summary || "",
    details: detailsText,
    publishedAt: item.publishedAt,
    image: item.image?.asset
      ? {
          url:
            item.image.asset.url ||
            `https://cdn.sanity.io/images/teft49db/production/${item.image.asset._ref.replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png")}`,
          alt: item.image.alt || item.title,
        }
      : undefined,
  };
}

export async function getBlogArticles(
  options: BlogsQuery = {}
): Promise<BlogArticle[]> {
  const {
    limit = 10,
    offset = 0,
    category,
    search,
    includeDrafts = false,
  } = options;

  // Build GROQ query with filters
  let query = `*[_type == "article"`;

  // Add draft filter
  if (!includeDrafts) {
    query += ` && defined(publishedAt)`;
  }

  // Add category filter
  if (category) {
    query += ` && category == $category`;
  }

  // Add search filter
  if (search) {
    query += ` && (title match "*${search}*" || summary match "*${search}*")`;
  }

  query += `] | order(publishedAt desc)`;

  // Add pagination
  if (offset > 0 || limit !== 10) {
    query += `[${offset}...${offset + limit}]`;
  }

  // Add field selection
  query += ` {
    _id,
    title,
    slug,
    summary,
    details,
    publishedAt,
    image {
      asset-> {
        _ref,
        url
      },
      alt
    }
  }`;

  try {
    const cmsArticles = await contentQuery<CMSArticle[]>(query, {
      category,
      search,
    });
    return cmsArticles.map(reshapeToArticle);
  } catch (error) {
    console.error("Error fetching blog articles:", error);
    return [];
  }
}

export async function getBlogArticle(
  slug: string,
  options: { includeDrafts?: boolean } = {}
): Promise<BlogArticle | null> {
  const { includeDrafts = false } = options;

  // Build GROQ query for single article
  let query = `*[_type == "article" && slug.current == $slug`;

  // Add draft filter
  if (!includeDrafts) {
    query += ` && defined(publishedAt)`;
  }

  query += `][0] {
    _id,
    title,
    slug,
    summary,
    details,
    publishedAt,
    image {
      asset-> {
        _ref,
        url
      },
      alt
    }
  }`;

  try {
    const cmsArticle = await contentQuery<CMSArticle>(query, { slug });
    return cmsArticle ? reshapeToArticle(cmsArticle) : null;
  } catch (error) {
    console.error("Error fetching blog article:", error);
    return null;
  }
}

// Additional helper function to get article count
export async function getBlogArticleCount(
  options: { includeDrafts?: boolean; search?: string } = {}
): Promise<number> {
  const { includeDrafts = false, search } = options;

  let query = `count(*[_type == "article"`;

  if (!includeDrafts) {
    query += ` && defined(publishedAt)`;
  }

  if (search) {
    query += ` && (title match "*${search}*" || summary match "*${search}*")`;
  }

  query += `])`;

  try {
    return await contentQuery<number>(query);
  } catch (error) {
    console.error("Error fetching article count:", error);
    return 0;
  }
}
