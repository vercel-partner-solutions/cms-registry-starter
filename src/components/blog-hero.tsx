import Image from "next/image";
import Link from "next/link";

export function BlogHero({
  title,
  description,
  image,
  articleUrl,
}: {
  title: string;
  description: string;
  image?: string;
  articleUrl: string;
}) {
  if (image) {
    return (
      <section className="relative w-full h-[560px] text-white">
        <Link href={articleUrl}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-16">
          <div className="max-w-4xl">
            <Link href={articleUrl}>
              <h1 className="font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl mb-4">
                {title}
              </h1>
            </Link>
            <Link href={articleUrl}>
              <p className="text-lg text-gray-200 mb-8 max-w-3xl">
                {description}
              </p>
            </Link>
            <Link
              href={articleUrl}
              className="text-white underline font-semibold transition-colors duration-300 hover:text-gray-300"
            >
              Read More
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Fallback for when there is no featured image
  return (
    <section className="bg-muted/50 dark:bg-muted/20 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Link href={articleUrl}>
            <h1 className="font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl mb-6 text-foreground">
              {title}
            </h1>
            <p className="text-xl mb-8 leading-relaxed text-muted-foreground">
              {description}
            </p>
          </Link>
          <Link
            href={articleUrl}
            className="text-white underline font-semibold transition-colors duration-300 hover:text-gray-300"
            style={{
              textDecorationThickness: "2px",
              textUnderlineOffset: "4px",
            }}
          >
            Read More
          </Link>
        </div>
      </div>
    </section>
  );
}
