import { NextRequest, NextResponse } from "next/server";

// Function for fetching the schema from Contentstack (types and fields)
async function fetchSchema() {
  const response = await fetch("https://api.contentstack.io/v3/content_types", {
    method: "GET",
    headers: {
      api_key: process.env.CONTENTSTACK_API_KEY!,
      authorization: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
    },
  });

  if (!response.ok) {
    throw new Error("Error retrieving schema");
  }

  const schema = await response.json();
  return schema;
}

export async function GET(request: NextRequest) {
  // Generate current timestamp
  const timestamp = new Date().toISOString();

  // Create JSON content with timestamp
  const timestampData = {
    generatedAt: timestamp,
  };

  try {
    // Fetch content types using the abstracted function
    const contentTypes = await fetchSchema();

    // Include content types in the registry item
    const registryItem = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: "schema",
      type: "registry:file",
      files: [
        {
          path: ".well-known/r/cms",
          content: JSON.stringify(
            { ...timestampData, contentTypes: contentTypes },
            null,
            2
          ),
          type: "registry:file",
          target: "lib/cms/schema.json",
        },
      ],
    };

    return NextResponse.json(registryItem);
  } catch (error) {
    console.error("❌ Fetch failed:", error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
