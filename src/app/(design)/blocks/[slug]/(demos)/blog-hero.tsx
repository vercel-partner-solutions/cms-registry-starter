import { BlogHero } from "@/components/blog-hero";

async function BlogHeroDemo() {
  return (
    <BlogHero
      title="Getting Started with Next.js 15"
      description="Learn about the latest features and improvements in Next.js 15, including the new App Router enhancements and performance optimizations."
      articleUrl="#"
      featuredImage="/blog-hero.png"
    />
  );
}

export const blogHero = {
  name: "blog-hero",
  components: {
    Default: <BlogHeroDemo />,
  },
};
