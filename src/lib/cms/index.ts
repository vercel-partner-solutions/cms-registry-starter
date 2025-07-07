import * as contentstack from "contentstack";

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
  search?: string;
  includeDrafts?: boolean;
}

interface CMSArticle {
  uid: string;
  title: string;
  slug: string;
  summary: string;
  details: string;
  image?: {
    url: string;
    title?: string;
  };
}

const Stack = contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY || "",
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN || "",
  environment: process.env.CONTENTSTACK_ENVIRONMENT || "",
});

async function contentQuery<T = any>(
  contentTypeUid: string,
  variables: Record<string, any> = {}
): Promise<T> {
  try {
    const Query = Stack.ContentType(contentTypeUid).Query();

    if (variables.where) {
      for (const key in variables.where) {
        Query.where(key, variables.where[key]);
      }
    }
    if (variables.limit) {
      Query.limit(variables.limit);
    }
    if (variables.offset) {
      Query.skip(variables.offset);
    }
    if (variables.search) {
      Query.search(variables.search);
    }

    const result = await Query.toJSON().find();
    return result[0] as T;
  } catch (error) {
    console.error(`Contentstack query failed for ${contentTypeUid}:`, error);
    return [] as T;
  }
}

function reshapeToArticle(item: CMSArticle): BlogArticle {
  return {
    id: item.uid || "",
    title: item.title || "",
    slug: item.slug || "",
    summary: item.summary || "",
    details: item.details || "",
    image: item.image
      ? {
          url: item.image.url || "",
          alt: item.image.title || item.title,
        }
      : undefined,
  };
}

export async function getBlogArticles(
  options: BlogsQuery = {}
): Promise<BlogArticle[]> {
  const cmsArticles = await contentQuery<CMSArticle[]>("article", {
    limit: options.limit,
    offset: options.offset,
    search: options.search,
  });

  return cmsArticles.map(reshapeToArticle);
}

export async function getBlogArticle(
  slug: string,
  options: { includeDrafts?: boolean } = {}
): Promise<BlogArticle | null> {
  const articles = await contentQuery<CMSArticle[]>("article", {
    where: { slug: slug },
    limit: 1,
  });

  if (!articles || articles.length === 0) {
    return null;
  }

  return reshapeToArticle(articles[0]);
}
