import { NextRequest, NextResponse } from "next/server";

// Function for fetching the schema from the CMS (types and fields)
async function fetchSchema(request: NextRequest) {
  try {
    const baseUrl = new URL(request.url).origin;
    const response = await fetch(`${baseUrl}/.well-known/schema`);
    if (!response.ok) {
      throw new Error("Failed to fetch schema");
    }
    const schema = await response.json();
    return schema;
  } catch (error) {
    console.error("Error fetching schema:", error);
    return {};
  }
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
    const contentTypes = await fetchSchema(request);

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
