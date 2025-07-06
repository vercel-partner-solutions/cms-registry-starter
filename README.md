<a href="https://sanity-registry-starter.vercel.app/">
  <h1 align="center">CMS Registry Starter</h1>
</a>

<p align="center">
    Registry Starter is a free, open-source template built with Next.js and Shadcn/ui Registry to accelerate your AI-Native Design System.
</p>

<p align="center">
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#open-in-v0"><strong>Open in v0</strong></a> ·
  <a href="#theming"><strong>Theming</strong></a> ·
  <a href="#running-locally"><strong>Running Locally</strong></a> ·
  <a href="#file-structure"><strong>File Structure</strong></a> ·
  <a href="https://ui.shadcn.com/docs/registry"><strong>Read Docs</strong></a>
</p>
<br/>

## Project Overview

The CMS Registry Starter is designed to facilitate the integration of a Content Management System (CMS) into your components and the v0 platform. This starter kit provides a structured approach to streamline the integration process, ensuring that your CMS is seamlessly incorporated into your design system.

## Explore CMS Integrations

Discover how this starter kit integrates with various CMS platforms by exploring the following branches:

- [Contentful](https://github.com/vercel-partner-solutions/cms-registry-starter/tree/contentful) ([Demo](https://contentful-registry-starter.vercel.app/))

### Key Integration Steps

1. **Update the `.well-known/r/cms` Route Handler**:
   - Modify the route handler to fetch schema information directly from the CMS. This ensures that your application can dynamically adapt to changes in the CMS schema.

2. **Configure Base Queries in `src/lib/cms/index.ts`**:
   - Implement base queries to retrieve content from the CMS. This setup is crucial for ensuring that your application can efficiently access and display CMS-managed content.

3. **Customize `prompt.md` for CMS Specifics**:
   - Tailor the `prompt.md` file to include any CMS-specific instructions or configurations. This document serves as a guide for developers interacting with the CMS through the application.

## Deploy Your Own

You can deploy your own version of the Next.js Registry Starter to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fcms-registry-starter&project-name=my-registry&repository-name=my-registry&demo-title=Registry%20Starter&demo-description=Registry%20Starter%20is%20a%20free%2C%20open-source%20template%20built%20with%20Next.js%20and%20Shadcn%2Fui%20Registry%20to%20accelerate%20your%20AI-Native%20Design%20System.&demo-url=https%3A%2F%2Fcms-registry-starter.vercel.app&demo-image=%2F%2Fcms-registry-starter.vercel.app%2Fpreview.png)

## Open in v0

[![Open in v0](https://cms-registry-starter.vercel.app/open-in-v0.svg)](https://v0.dev/chat/api/open?title=Dashboard+Kit&prompt=These+are+existing+design+system+styles+and+files.+Please+utilize+them+alongside+base+components+to+build.&url=https%3A%2F%2Fcms-registry-starter.vercel.app%2Fr%2Fdashboard.json)

This registry application also exposes `Open in v0` buttons for each component. Once this application is deployed, the
`Open in v0` button redirects to [`v0.dev`](https://v0.dev) with a prepopulated prompt and a URL pointing back to this
registry's `/r/${component_name}.json` endpoint. This endpoint will provide v0 the necessary file information, content,
and metadata to start your v0 chat with your component, theme, and other related code.

These `/r/${component_name}.json` files are generated using `shadcn/ui` during the `build` and `dev` based on the
repository's [`registry.json`](./registry.json). For more information, refer to the
[documentation](https://ui.shadcn.com/docs/registry/registry-json).

## Theming

To use a custom theme for all the components, all you need to do is modify the CSS tokens in
[`tokens.css`](./src/app/tokens.css). More information on these practices can be found
on [ui.shadcn.com/docs](https://ui.shadcn.com/docs).

#### MCP

To use this registry with MCP, you must also edit [`registry.json`](./registry.json)'s first
`registry-item` named `registry`. This `registry:style` item also contains your design tokens that can be used with MCP.

For example, it looks like this:

```json
    {
      "name": "registry",
      "type": "registry:style",
      "cssVars": {
        "light": {
          "primary": "oklch(0.52 0.13 144.17)",
          "primary-foreground": "oklch(1.0 0 0)",
          "radius": "0.5rem",
          ...
        },
        "dark": {
          "primary": "oklch(0.52 0.13 144.17)",
          "primary-foreground": "oklch(1.0 0 0)",
          ...
        }
      },
      "files": []
    }
```

#### Fonts

To use custom fonts, you can either use [
`next/font/google`](https://nextjs.org/docs/pages/getting-started/fonts#google-fonts) or the [
`@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) CSS rule. For example, `fonts.css` might look
like:

```css
@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 400;
  src:
    url("https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm45xW5rygbi49c.woff2")
      format("woff2"),
    url("https://fonts.gstatic.com/s/montserrat/v15/JTUSjIg1_i6t8kCHKm45xW5rygbj49c.woff")
      format("woff");
}

@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 700;
  src:
    url("https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_dJE3gnD-w.woff2")
      format("woff2"),
    url("https://fonts.gstatic.com/s/montserrat/v15/JTURjIg1_i6t8kCHKm45_dJE3g3D_w.woff")
      format("woff");
}
```

If you use `@font-face`, you will also need to modify [`tailwind.css`](src/app/tailwind.css) AND
[`tailwind.config.ts`](src/app/tailwind.config.ts) to map your custom fonts to Tailwind. Refer to this
[Tailwind documentation](https://tailwindcss.com/docs/font-family#customizing-your-theme)

## Running locally

```bash
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000).

## File Structure

`app/(design)` routes contains the registry pages.

`app/starters` routes contains various starters (using either `minimal` and `shell` layouts)

`@/components` contains all compound components used in the registry

`@/components/ui` contains all base `shadcn/ui` used in the registry

`@/components/design` contains all components for this application

`@/hooks` contains all React hooks

`@/lib` contains all business logic & utils

`src/lib/cms`: Specifically dedicated to CMS integration, including base queries and schema handling.

`.well-known`: Contains route handlers for fetching schema information from the CMS, ensuring dynamic adaptability to schema changes.
