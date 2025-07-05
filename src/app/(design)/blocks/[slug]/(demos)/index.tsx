import type { ReactElement, ReactNode } from "react";

import { hero } from "@/app/(design)/blocks/[slug]/(demos)/hero";
import { login } from "@/app/(design)/blocks/[slug]/(demos)/login";
import { productGrid } from "@/app/(design)/blocks/[slug]/(demos)/product-grid";
import { promo } from "@/app/(design)/blocks/[slug]/(demos)/promo";
import { blogHero } from "@/app/(design)/blocks/[slug]/(demos)/blog-hero";

interface Block {
  name: string; // this must match the `registry.json` name
  components?: {
    [name: string]: ReactNode | ReactElement;
  };
  // returns component based on search params
  getComponents?: (searchParams: {
    [key: string]: string | string[] | undefined;
  }) => {
    [name: string]: ReactNode | ReactElement;
  };
}

export const demos: { [name: string]: Block } = {
  "blog-hero": blogHero,
  hero,
  login,
  promo,
  "product-grid": productGrid,
};
