import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { demos } from "@/app/(design)/blocks/[slug]/(demos)";
import { ComponentCard } from "@/components/design/component-card";
import { Button } from "@/components/ui/button";
import { getComponent } from "@/lib/utils";
import { ConnectToggle } from "@/components/design/connect-toggle";

export async function generateStaticParams() {
  return Object.keys(demos).map((slug) => ({
    slug,
  }));
}

export default async function BlockPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const block = getComponent(slug);

  if (!block) {
    notFound();
  }

  const { components } = demos[slug];

  const cmsComponents =
    components && typeof components === "object"
      ? Object.fromEntries(
          Object.entries(components).map(([key, component]) => {
            // Check if the demo has a function that can accept search params
            const demoConfig = demos[slug];
            if (demoConfig && typeof demoConfig.getComponents === "function") {
              return [key, demoConfig.getComponents(resolvedSearchParams)[key]];
            }
            return [key, component];
          })
        )
      : components;

  return (
    <div className="container p-5 md:p-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="w-full">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/">
                <ArrowLeft className="mr-2 size-4" />
                Back to Home
              </Link>
            </Button>
            <ConnectToggle />
          </div>
          <h1 className="font-bold text-3xl tracking-tight">{block.title}</h1>
        </div>
      </div>

      <ComponentCard
        name={block.name}
        baseUrl={process.env.VERCEL_BRANCH_URL ?? ""}
        title="Block Preview"
        promptTitle={`${block.title} Block Kit`}
        components={cmsComponents}
      />
    </div>
  );
}
