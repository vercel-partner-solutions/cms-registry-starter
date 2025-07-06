import { BlogHero } from "@/components/blog-hero";
import { getBlogArticle } from "@/lib/cms";

async function ConnectedBlogHeroDemo() {
  const blog = await getBlogArticle("getting-started-nextjs-15");

  if (!blog) return null;

  return (
    <BlogHero
      title={blog.title}
      description={blog.summary}
      articleUrl={`/article/${blog.slug}`}
      image={blog.image?.url}
    />
  );
}

async function StaticBlogHeroDemo() {
  return (
    <BlogHero
      title="Article Title"
      description="Placeholder article description will go here"
      articleUrl={`/article/placeholder-1`}
      image="/blog-hero.png"
    />
  );
}

export const blogHero = {
  name: "blog-hero",
  components: {
    Default: <ConnectedBlogHeroDemo />,
  },
  getComponents: (searchParams: {
    [key: string]: string | string[] | undefined;
  }) => {
    const isConnected = searchParams.connected !== undefined;

    return {
      Default: isConnected ? <ConnectedBlogHeroDemo /> : <StaticBlogHeroDemo />,
    };
  },
};
